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
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-semibold">
                  🚀 El Futuro de la Tokenización
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                  <strong className="text-black">Acceso a financiamiento sin limites</strong>
                </h1>
                <p className="text-xl text-foreground/70 leading-relaxed max-w-lg">
                  Accede a nuevas oportunidades con fondos tokenizados. Transforma activos tradicionales en tokens basados en blockchain con seguridad de grado institucional.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link
                    to="/productos/financiamiento"
                    className="px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                  >
                    Tokenizar Activos
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                    >
                      Early Access
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="#features"
                      className="px-8 py-4 bg-secondary text-primary rounded-md hover:bg-blue-100 transition-colors font-bold text-lg border border-blue-200"
                    >
                      Explorar Mercados
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-12 border border-border/40">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Fondos Tokenizados</p>
                      <p className="text-sm text-foreground/60">Acceso global 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Seguridad Institucional</p>
                      <p className="text-sm text-foreground/60">Grado bancario</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/40">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Red Global</p>
                      <p className="text-sm text-foreground/60">Inversores de todo el mundo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assets Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Invierte en Activos Digitales
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Transformamos una amplia gama de instrumentos financieros en activos digitales líquidos, accesibles y eficientes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Capital de Trabajo", icon: Zap },
              { name: "Bonos", icon: BarChart3 },
              { name: "Deuda Privada", icon: TrendingUp },
              { name: "Fondos Crypto", icon: Coins },
            ].map((asset, i) => (
              <div
                key={i}
                className="p-8 bg-blue-50 border border-border/40 rounded-lg hover:shadow-md transition-shadow card-shadow text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <asset.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {asset.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-blue-50">
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
                title: "Liquidez para Activos Tradicionales",
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

      {/* Tokenize Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container max-w-4xl mx-auto">
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
                    <span>Seguridad de grado bancario</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Proceso automatizado sin intermediarios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Acceso a mercados globales</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/nosotros/contacto"
                  className="px-8 py-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  Contacto
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/nosotros/empresa"
                  className="px-8 py-4 bg-secondary text-primary rounded-md hover:bg-blue-100 transition-colors font-bold border border-blue-200"
                >
                  Saber Más
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-8 border border-border/40">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Una plataforma completa
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Emite Activos</p>
                      <p className="text-sm text-foreground/70">Crea y tokeniza tus activos en minutos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Registra Transacciones</p>
                      <p className="text-sm text-foreground/70">Transparencia total en tiempo real</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Gestiona tu Cartera</p>
                      <p className="text-sm text-foreground/70">Control total desde una plataforma</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Sé Parte del Futuro Financiero
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Accede a Early Access y comienza a tokenizar activos hoy mismo. Forma parte de la revolución de los mercados de capitales digitales.
            </p>
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="inline-block px-10 py-4 bg-white text-primary rounded-md hover:bg-blue-50 transition-colors font-bold text-lg"
              >
                Solicitar Early Access
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-blue-50 border-t border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center text-sm text-foreground/60">
            <p>
              <strong>Aviso Importante:</strong> Este sitio está en fase de desarrollo y la información es meramente informativa. 
              Fraction Finance se encuentra en proceso de aprobación y regulación ante la CMF. El contenido está sujeto a cambios sin previo aviso.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
