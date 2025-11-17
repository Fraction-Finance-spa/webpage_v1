import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  TrendingUp,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Target,
  Lightbulb,
} from "lucide-react";

export default function Index() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-semibold">
                  💰 Financiamiento Colaborativo
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                  Acceso a Capital sin Límites
                </h1>
                <p className="text-xl text-foreground/70 leading-relaxed max-w-lg">
                  Conecta con inversores globales y obtén financiamiento para hacer crecer tu empresa.
                  Proceso rápido, seguro y transparente.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link
                    to="/productos/financiamiento"
                    className="px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                  >
                    Solicitar Financiamiento
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                    >
                      Comenzar Ahora
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="#features"
                      className="px-8 py-4 bg-secondary text-primary rounded-md hover:bg-blue-100 transition-colors font-bold text-lg border border-blue-200"
                    >
                      Conocer Más
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-8 border-t border-border/40 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <p className="text-sm text-foreground/70">Empresas financiadas</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$100M+</div>
                  <p className="text-sm text-foreground/70">Capital desembolsado</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <p className="text-sm text-foreground/70">Inversores activos</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-12 border border-border/40">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Crecimiento Rápido</p>
                      <p className="text-sm text-foreground/60">+250% en 12 meses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">100% Seguro</p>
                      <p className="text-sm text-foreground/60">Tecnología blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Comunidad Global</p>
                      <p className="text-sm text-foreground/60">50K+ inversores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              ¿Por qué elegir Fraction Finance?
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              La plataforma de financiamiento más segura y confiable de América Latina
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Proceso Rápido",
                description: "Obtén respuesta en 48 horas. Sin trámites complicados ni documentación excesiva.",
              },
              {
                icon: TrendingUp,
                title: "Crecimiento Acelerado",
                description: "Acceso a capital diseñado específicamente para acelerar tu crecimiento empresarial.",
              },
              {
                icon: Users,
                title: "Red Global",
                description: "Conecta con inversores de todo el mundo interesados en tu industria.",
              },
              {
                icon: Shield,
                title: "100% Seguro",
                description: "Tecnología blockchain y regulación completa para proteger tus transacciones.",
              },
              {
                icon: CheckCircle,
                title: "Transparencia Total",
                description: "Sin comisiones ocultas. Todos los costos son claros desde el inicio.",
              },
              {
                icon: Target,
                title: "Soporte Experto",
                description: "Equipo dedicado disponible 24/7 para guiarte en cada paso del proceso.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white border border-border/40 rounded-lg hover:shadow-md transition-shadow card-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Tres pasos simples
            </h2>
            <p className="text-xl text-foreground/70">
              De solicitud a capital en tu cuenta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: Briefcase,
                title: "Completa tu Perfil",
                description:
                  "Describe tu empresa, sector, y necesidades de financiamiento",
              },
              {
                step: 2,
                icon: Lightbulb,
                title: "Conecta con Inversores",
                description:
                  "Nuestro algoritmo te presenta con inversores interesados en tu sector",
              },
              {
                step: 3,
                icon: CheckCircle,
                title: "Recibe Capital",
                description:
                  "Negocia términos y recibe el capital directamente en tu cuenta",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 text-white font-bold text-2xl">
                    {item.step}
                  </div>
                  <div className="absolute top-7 left-[55%] w-[90%] h-1 bg-blue-200 -z-10 hidden md:block" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              ¿Listo para transformar tu empresa?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresas que ya están creciendo con Fraction Finance
            </p>
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="inline-block px-10 py-4 bg-white text-primary rounded-md hover:bg-blue-50 transition-colors font-bold text-lg"
              >
                Registrarse Ahora
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
