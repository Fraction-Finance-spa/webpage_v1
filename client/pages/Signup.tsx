import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      setLoading(false);
      navigate("/profile");
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="w-full max-w-md relative z-10" style={{ marginTop: "50px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-12 shadow-xl w-full">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 p-3 bg-blue-100 rounded-lg">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Crear Cuenta</h1>
              <p className="text-foreground/70">Únete a Fraction Finance</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-white/60" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/60" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/60" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-foreground"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-foreground/40" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
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

            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-white/60">Acceso inmediato</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-white/60">100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-white/60">Rápido</span>
                </div>
              </div>

              <div className="text-center text-white/70 text-sm pt-4 border-t border-white/10">
                <span style={{ color: "rgba(0, 0, 0, 1)" }} className="block mb-2">
                  ¿Ya tienes cuenta?
                </span>
                <Link to="/login" className="text-primary hover:text-primary/80 font-semibold">
                  Inicia sesión
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-white/60 text-xs mt-6 max-w-sm mx-auto">
            Al registrarte aceptas nuestros{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-semibold">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-semibold">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
