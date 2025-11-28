import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Brain,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function Index() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden" style={{
        backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2Fcfb1dbdec5284d19854f1a167f9f94b5)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "728px",
        padding: "150px 32px 120px 32px",
        marginBottom: "-4px",
        marginTop: "0",
        opacity: "0.92",
      }}>
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
                  <span style={{ letterSpacing: "1px", textShadow: "1px 1px 3px rgba(0, 0, 0, 1)", font: '600 25px "Inter Tight", sans-serif' }}>
                    Potenciamos el crecimiento con soluciones digitales de inversión y financiamiento.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/productos/financiamiento"
                      className="flex-1 px-5 bg-blue-50 text-black rounded-xl hover:bg-blue-100 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl py-2.5"
                    >
                      Solicitar Financiamiento
                    </Link>
                    <Link
                      to="/productos/inversiones"
                      className="flex-1 px-5 bg-blue-50 text-black rounded-xl hover:bg-blue-100 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl py-2.5"
                    >
                      Explorar Oportunidades
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
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
      <section className="px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)", fontFamily: "Inter, sans-serif", padding: "100px 32px" }}>
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
              Financia e invierte en Activos Digitales
            </h2>
            <div className="text-xl text-foreground/70 mx-auto" style={{ maxWidth: "855px" }}>
              <p>
                Accede a oportunidades de financiamiento empresarial mediante activos digitales, con procesos ágiles y alternativas diseñadas para ofrecer rendimientos estables y confiables.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Capital de Trabajo", icon: Zap, description: "Financiamiento de corto plazo para cubrir necesidades operativas, como inventarios, proveedores o flujo diario de caja." },
              { name: "Bonos", icon: BarChart3, description: "Instrumentos de deuda emitidos por empresas para financiar expansión, proyectos o reestructuración, con pagos de interés y plazo definido." },
              { name: "Deuda Privada", icon: TrendingUp, description: "Préstamos estructurados directamente entre empresa e inversionistas con condiciones flexibles y personalización del riesgo." },
              { name: "Fondos de Inversión", icon: Globe, description: "Portafolios diversificados que invierten en múltiples activos, desde private equity y real estate hasta infraestructura y tecnología." },
            ].map((asset, i) => (
              <div
                key={i}
                className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-5 h-full flex flex-col items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 26, 255, 0.15) 0%, rgba(0, 26, 255, 0.05) 100%)",
                      boxShadow: "0 8px 24px rgba(0, 26, 255, 0.08)"
                    }}
                  >
                    <asset.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 mx-auto">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-foreground/60 font-medium text-left">
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
      <section id="features" className="px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)", padding: "100px 32px" }}>
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
            <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
              Porque reunimos en un solo lugar financiamiento, inversión y
              tecnología. Te conectamos con inversionistas y usamos IA para
              evaluar tu empresa y mostrarte condiciones claras y transparentes
              para decidir cómo financiarte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Seguridad y Confianza",
                description:
                  "Auditorías, verificación integrada y cumplimiento AML, además de reportes automatizados.",
              },
              {
                icon: Brain,
                title: "Evaluación Inteligente con IA",
                description:
                  "Analizamos los datos de tu empresa para estimar probabilidad de aprobación, riesgo y condiciones de financiamiento antes de que envíes una solicitud formal.",
              },
              {
                icon: Zap,
                title: "Tokenización Instantánea",
                description:
                  "Convierte activos financieros en tokens en minutos. Procesos totalmente automatizados, sin intermediarios.",
              },
              {
                icon: TrendingUp,
                title: "Financiamiento Colaborativo",
                description:
                  "Fracciona activos tradicionales y más. Crea oportunidades de inversión accesibles para todo tipo de inversionista.",
              },
              {
                icon: Globe,
                title: "Acceso 24/7",
                description:
                  "Solicita financiamiento y gestiona tus operaciones en cualquier momento, con transacciones rápidas, seguras y eficientes.",
              },
              {
                icon: Users,
                title: "Red de Inversores",
                description:
                  "Conecta con inversionistas institucionales y minoristas. Aumenta la visibilidad y demanda de tus activos digitales.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-8 shadow-lg hover:shadow-2xl group"
              >
                <div className="w-12 h-12 flex items-center justify-center transition-all" style={{ animationDuration: "0.5s", backgroundImage: "linear-gradient(135deg, rgba(0, 26, 255, 0.15) 0%, rgba(0, 26, 255, 0.05) 100%)", borderRadius: "16px", boxShadow: "rgba(0, 26, 255, 0.08) 0px 8px 24px 0px", margin: "0 auto 24px", transitionDuration: "0.5s" }}>
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3" style={{ textAlign: "center" }}>
                  {feature.title === "Financiamiento Colaborativo" ? <p style={{ textAlign: "center" }}>{feature.title}</p> : feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenize Section */}
      <section className="px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)", padding: "100px 32px", color: "rgba(0, 45, 255, 0.02)" }}>
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
                <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: "rgba(0, 0, 0, 1)" }}>
                  Tokeniza con Fraction
                </h2>
                <p className="text-xl text-foreground/70">
                  La forma más simple y segura de convertir activos en
                  financiamiento.
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
                  to="/auth"
                  className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <div style={{ cursor: "pointer", pointerEvents: "auto", display: "flex" }}>
                    <p>Solicita Financiamiento</p>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2Fd28b7233fb464c048c101a2a8634fbe0?format=webp&width=800"
                alt="Tokenización Fraction"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
