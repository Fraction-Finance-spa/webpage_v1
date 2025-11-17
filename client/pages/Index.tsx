import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  TrendingUp,
  Users,
  Zap,
  Shield,
  ArrowRight,
  DollarSign,
} from "lucide-react";

export default function Index() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="gradient-text text-5xl sm:text-6xl font-black leading-tight">
                  Financiamiento Colaborativo
                </h1>
                <p className="text-xl text-foreground/80 leading-relaxed">
                  Conectamos empresas con inversores globales. Impulsa tu negocio
                  con acceso a capital colaborativo y oportunidades de inversión
                  única.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link
                    to="/productos/financiamiento"
                    className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Explorar Financiamiento
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Comenzar Ahora
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="#features"
                      className="px-8 py-4 bg-border/30 text-foreground rounded-xl font-bold text-lg hover:bg-border/50 transition-colors"
                    >
                      Conocer Más
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row gap-8 text-sm">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    500+
                  </div>
                  <p className="text-foreground/60">Empresas financiadas</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    $100M+
                  </div>
                  <p className="text-foreground/60">Capital desembolsado</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">
                    50K+
                  </div>
                  <p className="text-foreground/60">Inversores activos</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative h-96 sm:h-[500px] animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block p-4 bg-primary/20 rounded-2xl mb-4">
                    <DollarSign className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-foreground/60">
                    Acceso a financiamiento sin límites
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="gradient-text text-4xl sm:text-5xl font-bold mb-4">
              Por qué elegir Fraction Finance
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Una plataforma diseñada para conectar empresas con oportunidades
              de crecimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Crecimiento Garantizado",
                description:
                  "Acceso a capital colaborativo diseñado para acelerar tu crecimiento empresarial",
              },
              {
                icon: Users,
                title: "Comunidad Global",
                description:
                  "Conecta con miles de inversores de todo el mundo interesados en tu visión",
              },
              {
                icon: Zap,
                title: "Proceso Rápido",
                description:
                  "Financiamiento en menos de 48 horas con nuestro proceso simplificado",
              },
              {
                icon: Shield,
                title: "Seguridad Garantizada",
                description:
                  "Tus datos y transacciones están protegidos con tecnología blockchain",
              },
              {
                icon: DollarSign,
                title: "Sin Comisiones Ocultas",
                description:
                  "Transparencia total en todos nuestros procesos y tarifas",
              },
              {
                icon: Users,
                title: "Soporte 24/7",
                description:
                  "Equipo dedicado listo para ayudarte en cada paso del proceso",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-morphism p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="inline-block p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="gradient-text text-4xl sm:text-5xl font-bold mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-foreground/70">
              Tres simples pasos para conseguir financiamiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Solicita Financiamiento",
                description:
                  "Completa tu perfil empresarial y describe tu proyecto en detalle",
              },
              {
                step: "2",
                title: "Conecta con Inversores",
                description:
                  "Nuestro algoritmo te conecta con inversores interesados en tu sector",
              },
              {
                step: "3",
                title: "Recibe Capital",
                description:
                  "Acepta propuestas y recibe el capital directamente en tu cuenta",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 font-bold text-2xl text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="container max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border border-primary/30 p-12 sm:p-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              ¿Listo para transformar tu empresa?
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresas que ya están creciendo con
              Fraction Finance
            </p>
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="inline-block px-10 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
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
