import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Layout from "@/components/Layout";
import { Mail, Lock, User, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";

export default function Auth() {
  const initialView = (localStorage.getItem("authView") as "welcome" | "login" | "signup") || "welcome";
  const [view, setView] = useState<"welcome" | "login" | "signup">(initialView);
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  // Clear authView from localStorage once it's used
  useEffect(() => {
    localStorage.removeItem("authView");
  }, []);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginProfileType, setLoginProfileType] = useState<"persona" | "empresa" | "">("");

  // Signup state
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupCompanyName, setSignupCompanyName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupProfileType, setSignupProfileType] = useState<"persona" | "empresa" | "">("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!loginProfileType) {
      setError("Por favor selecciona un tipo de perfil");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (loginPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(loginEmail, loginPassword);
      if (user) {
        localStorage.setItem("userEmail", loginEmail);
        localStorage.setItem("userProfileType", loginProfileType);
        localStorage.setItem("isLoggedIn", "true");
        // Navigate immediately, auth state is ready
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupEmail || !signupPassword || !signupConfirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!signupProfileType) {
      setError("Por favor selecciona un tipo de perfil");
      return;
    }

    if (signupProfileType === "persona" && (!signupFirstName || !signupLastName)) {
      setError("Por favor completa nombre y apellido");
      return;
    }

    if (signupProfileType === "empresa" && !signupCompanyName) {
      setError("Por favor completa el nombre de la empresa");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (signupPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const fullName = signupProfileType === "persona"
        ? `${signupFirstName} ${signupLastName}`
        : signupCompanyName;

      // Determine user type based on profile type
      const userType = signupProfileType === "persona" ? "investor" : "empresa";

      await signUp(signupEmail, signupPassword, fullName, userType);

      // Store minimal info in localStorage for quick access
      localStorage.setItem("userEmail", signupEmail);
      localStorage.setItem("userProfileType", signupProfileType);

      setError("Usuario creado correctamente. Por favor confirma tu email.");
      // Navigate after a delay to show confirmation message
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    setView("welcome");
    setError("");
    setLoginEmail("");
    setLoginPassword("");
    setLoginProfileType("");
    setSignupFirstName("");
    setSignupLastName("");
    setSignupCompanyName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupProfileType("");
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden" style={{
        backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2F59f75e4bc0444c389fa97848de01b062)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        opacity: "0.91",
      }}>
        <div className="absolute inset-0 -z-10" style={{ left: "85px", top: "-305px", width: "1472px" }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-20" style={{ left: "856px", top: "720px" }}></div>
        </div>
        <div className="w-full max-w-md relative z-10" style={{ marginTop: "50px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl w-full" style={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 48px",
          }}>
            {/* Welcome View */}
            {view === "welcome" && (
              <>
                <div className="text-center mb-12 w-full pt-4">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Bienvenido!</h1>
                  <p className="text-gray-600">
                    <span style={{ color: "rgb(107, 114, 128)", fontSize: "14px", backgroundColor: "rgb(250, 250, 250)" }}>
                      Inicia sesión o crea una cuenta para comenzar.
                    </span>
                  </p>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => {
                      setView("login");
                      setError("");
                    }}
                    className="w-full px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => {
                      setView("signup");
                      setError("");
                    }}
                    className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl font-bold flex items-center justify-center gap-2"
                  >
                    Registrarse
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {/* Login View */}
            {view === "login" && (
              <>
                <div className="flex items-center justify-start w-full mb-8">
                  <button
                    onClick={handleBackToWelcome}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Atrás</span>
                  </button>
                </div>

                <div className="text-center mb-12 w-full">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Inicia Sesión</h1>
                  <p className="text-gray-600">Accede a tu cuenta</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5 w-full">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Tipo de Perfil *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="loginProfileType"
                          value="persona"
                          checked={loginProfileType === "persona"}
                          onChange={(e) => setLoginProfileType(e.target.value as "persona")}
                          className="w-4 h-4 text-primary cursor-pointer"
                        />
                        <span className="font-medium text-gray-900">Perfil Persona</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="loginProfileType"
                          value="empresa"
                          checked={loginProfileType === "empresa"}
                          onChange={(e) => setLoginProfileType(e.target.value as "empresa")}
                          className="w-4 h-4 text-primary cursor-pointer"
                        />
                        <span className="font-medium text-gray-900">Perfil Empresa</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="login-email" className="block text-sm font-semibold text-gray-800">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                      <input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="login-password" className="block text-sm font-semibold text-gray-800">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                      <input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? "Cargando..." : "Ingresar"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                <div className="space-y-4 mt-6 w-full">
                  <p className="text-center text-gray-600 text-sm">
                    ¿No tienes cuenta?
                  </p>
                  <button
                    onClick={() => {
                      setView("signup");
                      setError("");
                    }}
                    className="w-full px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-all font-bold"
                  >
                    Registrarse aquí
                  </button>
                </div>
              </>
            )}

            {/* Signup View */}
            {view === "signup" && (
              <>
                <div className="flex items-center justify-start w-full mb-8">
                  <button
                    onClick={handleBackToWelcome}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Atrás</span>
                  </button>
                </div>

                <div className="text-center mb-12 w-full">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
                  <p className="text-gray-600">Únete a Fraction Finance</p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-5 w-full">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Tipo de Perfil *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="profileType"
                          value="persona"
                          checked={signupProfileType === "persona"}
                          onChange={(e) => setSignupProfileType(e.target.value as "persona")}
                          className="w-4 h-4 text-primary cursor-pointer"
                        />
                        <span className="font-medium text-gray-900">Perfil Persona</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="profileType"
                          value="empresa"
                          checked={signupProfileType === "empresa"}
                          onChange={(e) => setSignupProfileType(e.target.value as "empresa")}
                          className="w-4 h-4 text-primary cursor-pointer"
                        />
                        <span className="font-medium text-gray-900">Perfil Empresa</span>
                      </label>
                    </div>
                  </div>

                  {signupProfileType === "persona" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="signup-first-name" className="block text-sm font-semibold text-gray-800">
                          Nombre
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                          <input
                            id="signup-first-name"
                            type="text"
                            value={signupFirstName}
                            onChange={(e) => setSignupFirstName(e.target.value)}
                            placeholder="Juan"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="signup-last-name" className="block text-sm font-semibold text-gray-800">
                          Apellidos
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                          <input
                            id="signup-last-name"
                            type="text"
                            value={signupLastName}
                            onChange={(e) => setSignupLastName(e.target.value)}
                            placeholder="Pérez"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {signupProfileType === "empresa" && (
                    <div className="space-y-2">
                      <label htmlFor="signup-company-name" className="block text-sm font-semibold text-gray-800">
                        Nombre de la Empresa
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                        <input
                          id="signup-company-name"
                          type="text"
                          value={signupCompanyName}
                          onChange={(e) => setSignupCompanyName(e.target.value)}
                          placeholder="Mi Empresa S.A."
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-800">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                      <input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-800">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                      <input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-confirm-password"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-600" />
                      <input
                        id="signup-confirm-password"
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? "Creando cuenta..." : "Registrarse"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                <div className="mt-8 space-y-4 w-full">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2" />
                    <div className="flex items-center gap-2" />
                    <div className="flex items-center gap-2" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center text-white/60 text-xs mt-6 max-w-sm mx-auto">
            <div style={{ color: "rgba(255, 255, 255, 1)" }}>
              Al usar esta plataforma aceptas nuestros
            </div>
            <a href="/terminos-servicio" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-semibold block">
              Términos de Servicio
            </a>
            <span>y</span>
            <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-semibold block">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
