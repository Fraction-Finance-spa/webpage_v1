import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // Fetch user role asynchronously without blocking
        if (session?.user?.email) {
          supabase
            .from("users")
            .select("user_type")
            .eq("email", session.user.email)
            .single()
            .then(({ data }) => {
              if (data?.user_type) {
                setUserRole(data.user_type);
              }
            })
            .catch((err) => {
              console.warn("Could not fetch user role:", err);
            });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);

      if (session?.user?.email) {
        try {
          const { data } = await supabase
            .from("users")
            .select("user_type")
            .eq("email", session.user.email)
            .single();

          if (data?.user_type) {
            setUserRole(data.user_type);
          }
        } catch (err) {
          console.warn("Could not fetch user role:", err);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, userType: string = "investor") => {
    try {
      console.log("Starting signup for:", email);

      // Create auth user - this is the only essential step
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (authError) {
        console.error("Auth signup error:", authError);
        throw new Error(authError.message || "Failed to create account");
      }

      console.log("Signup successful for:", email);

      if (authData.user) {
        setUser(authData.user);
        setUserRole(userType);

        // Try to create user record asynchronously (non-blocking)
        // This runs in the background without blocking signup completion
        setTimeout(() => {
          console.log("Creating user profile in database...");
          supabase.from("users").insert([
            {
              id: authData.user!.id,
              email,
              full_name: fullName,
              user_type: userType,
              status: "active",
            },
          ]).catch((err) => {
            console.warn("Could not create user profile:", err);
          });
        }, 0);
      }

      return authData.user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Failed to sign in");
      }

      if (data.user) {
        setUser(data.user);

        // Try to fetch user role asynchronously (non-blocking)
        supabase
          .from("users")
          .select("user_type")
          .eq("email", email)
          .single()
          .then(({ data: userData }) => {
            if (userData?.user_type) {
              setUserRole(userData.user_type);
            }
          })
          .catch((err) => {
            console.warn("Could not fetch user role:", err);
          });
      }

      return data.user;
    } catch (error) {
      console.error("SignIn error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
        isAdmin: userRole === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
