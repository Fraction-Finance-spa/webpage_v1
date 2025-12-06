import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { getSubdomain, SUBDOMAIN_ROUTES } from "@/lib/subdomain";

/**
 * SubdomainRouter component that handles routing based on subdomain
 * and ensures users are authenticated to access protected routes
 */
export function SubdomainRouter() {
  try {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      // Only run if auth is loaded and not on root path
      if (loading) return;

      const subdomain = getSubdomain();

      if (subdomain && SUBDOMAIN_ROUTES[subdomain]) {
        const targetRoute = SUBDOMAIN_ROUTES[subdomain];

        // If not authenticated, redirect to auth
        if (!isAuthenticated) {
          navigate("/auth");
          return;
        }

        // If current location is not the target route, redirect to it
        if (location.pathname !== targetRoute) {
          navigate(targetRoute);
        }
      }
    }, [isAuthenticated, loading, navigate, location.pathname]);

    return null;
  } catch (error) {
    console.error("SubdomainRouter error:", error);
    return null;
  }
}
