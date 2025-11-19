import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Leaf,
  ArrowRight,
  Coins,
  Lock,
  BarChart3,
} from "lucide-react";

export default function Index() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden" style={{
        backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2Ff34ffe5744e246fc90f605266f8241c7)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "686px",
        padding: "150px 32px 100px 32px",
        marginBottom: "-4px",
        marginTop: "0",
      }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          {/* Primary animated blob */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

          {/* Secondary animated blob */}
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary/15 to-transparent rounded-full filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Accent blob */}
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-t from-blue-400/8 to-transparent rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 70, 255, 0.05) 25%, rgba(0, 70, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 70, 255, 0.05) 75%, rgba(0, 70, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 70, 255, 0.05) 25%, rgba(0, 70, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 70, 255, 0.05) 75%, rgba(0, 70, 255, 0.05) 76%, transparent 77%, transparent)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                  <div className="inline text-black font-black">
                    <span style={{ fontWeight: "600", marginRight: "88px", color: "rgba(255, 255, 255, 1)", textShadow: "1px 1px 3px rgba(0, 0, 0, 1)" }}>
                      Acceso a financiamiento <br />
                      sin limites
                    </span>
                  </div>
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 1)", fontSize: "20px", fontWeight: "400", lineHeight: "28px", margin: "24px auto 0 auto" }}>
                  <span style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 1)", letterSpacing: "1px", fontWeight: "600", fontSize: "20px" }}>
                    Impulsamos el crecimiento con soluciones digitales de inversión y financiamiento.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link
                    to="/productos/financiamiento"
                    className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    Solicita Financiamiento
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-lg flex items-center justify-center gap-2"
                      style={{ boxShadow: "0 0 0 0 rgba(0, 0, 0, 1)" }}
                    >
                      <div style={{ cursor: 'pointer', pointerEvents: 'auto', display: 'flex' }}>
                        <p>Registrarse</p>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assets Section */}
      <section className="px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)", fontFamily: "Inter, sans-serif", padding: "128px 32px 100px", marginBottom: "-3px" }}>
        <div className="absolute inset-0 -z-10">
          {/* Section background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-white/5"></div>

          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/8 to-transparent rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/6 to-transparent rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Invierte en Activos Digitales
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Transformamos instrumentos financieros en activos digitales accesibles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Capital de Trabajo", icon: Zap, description: "Financiamiento flexible" },
              { name: "Bonos", icon: BarChart3, description: "Instrumentos corporativos" },
              { name: "Deuda Privada", icon: TrendingUp, description: "Rendimiento optimizado" },
            ].map((asset, i) => (
              <div
                key={i}
                className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 sm:p-10 text-center h-full flex flex-col items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 26, 255, 0.15) 0%, rgba(0, 26, 255, 0.05) 100%)",
                      boxShadow: "0 8px 24px rgba(0, 26, 255, 0.08)"
                    }}
                  >
                    <asset.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-foreground/60 font-medium">
                    {asset.description}
                  </p>
                  <div className="w-12 h-1 bg-primary rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)", padding: "100px 32px 128px" }}>
        <div className="absolute inset-0 -z-10">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-white/0"></div>

          {/* Right animated blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

          {/* Left accent blob */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/8 to-transparent rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              ¿Por qué elegir Fraction Finance?
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Construido para inversores individuales e institucionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Seguridad y Confianza",
                description:
                  "Seguridad de nivel bancario y protocolos avanzados. Verificación integrada y cumplimiento AML, además de reportes automatizados.",
              },
              {
                icon: Zap,
                title: "Tokenización Instantánea",
                description:
                  "Convierte activos físicos o financieros en tokens en minutos. Procesos totalmente automatizados, sin intermediarios.",
              },
              {
                icon: Globe,
                title: "Acceso 24/7",
                description:
                  "Operaciones a toda hora. Transacciones transfronterizas rápidas, seguras y eficientes.",
              },
              {
                icon: TrendingUp,
                title: "Financiamiento colaborativo",
                description:
                  "Fracciona activos tradicionales y más. Crea oportunidades de inversión accesibles para cualquier inversor.",
              },
              {
                icon: Users,
                title: "Red de Inversores",
                description:
                  "Conecta con inversores institucionales y minoristas de todo el mundo. Aumenta la visibilidad y demanda de tus activos tokenizados.",
              },
              {
                icon: Leaf,
                title: "Innovación y Sostenibilidad",
                description:
                  "Foco en activos verdes y sostenibles. Impulsa la inversión responsable con impacto real en la economía y el medio ambiente.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-8 shadow-lg hover:shadow-2xl group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:from-primary/40 group-hover:to-primary/20 transition-all">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title === "Financiamiento colaborativo" ? <p>{feature.title}</p> : feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenize Section */}
      <section className="px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)", padding: "100px 32px" }}>
        <div className="absolute inset-0 -z-10">
          {/* Section gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/3 to-white/0"></div>

          {/* Bottom left blob */}
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-primary/8 to-transparent rounded-full filter blur-3xl opacity-25 animate-pulse"></div>

          {/* Top right accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                  Tokeniza con Fraction
                </h2>
                <p className="text-xl text-foreground/70">
                  La forma más simple y segura de convertir activos. Tokenización y gestión con total transparencia.
                </p>
              </div>

              <div className="space-y-4 text-foreground/70">
                <p>
                  <strong>Datos en tiempo real.</strong> Emite activos, registra transacciones y gestiona tu cartera en una única plataforma.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Seguridad</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Proceso automatizado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Acceso a nuevos mercados</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <div style={{ cursor: "pointer", pointerEvents: "auto", display: "flex" }}>
                    <p>Solicita Financiamiento</p>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
