import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Users, TrendingUp, Shield, Zap, Globe, Leaf, ExternalLink } from "lucide-react";
import { getSocios, type Socio } from "@/lib/sociosManager";

export default function Ecosistema() {
  const [socios, setSocios] = useState<Socio[]>([]);

  useEffect(() => {
    setSocios(getSocios());
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden" style={{
        backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2Fe696666e21b94ac6a9447362c5466c74)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "600px",
        padding: "120px 32px",
        marginBottom: "-4px",
        opacity: "0.92",
      }}>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center space-y-6 z-10">
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              Ecosistema de Innovación
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
              Únete a un próspero ecosistema de instituciones financieras, socios tecnológicos y expertos regulatorios que transforman el futuro de los mercados de capitales.
            </p>
          </div>
        </div>
      </section>

      {/* Logos de Socios Section */}
      {socios.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Nuestros Socios
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Colaboramos con instituciones y empresas líderes en el mercado financiero.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {socios.map((socio) => (
                <div
                  key={socio.id}
                  className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300 group"
                >
                  <a
                    href={socio.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-32 flex items-center justify-center mb-4 relative"
                  >
                    <img
                      src={socio.logo}
                      alt={socio.nombre}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </a>
                  <h3 className="text-lg font-bold text-foreground text-center mb-2">
                    {socio.nombre}
                  </h3>
                  <p className="text-sm text-foreground/70 text-center mb-4 flex-grow">
                    {socio.descripcion}
                  </p>
                  <a
                    href={socio.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    Visitar <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Network Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-white to-blue-50/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Red de Socios
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Colaboramos con líderes del mercado para ofrecer soluciones integrales y confiables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Instituciones Financieras",
                description: "Bancos, fondos de inversión y plataformas de trading globales que confían en nuestra tecnología.",
              },
              {
                icon: TrendingUp,
                title: "Socios Tecnológicos",
                description: "Startups innovadoras y proveedores de soluciones fintech que impulsan la transformación digital.",
              },
              {
                icon: Users,
                title: "Expertos Regulatorios",
                description: "Consultores especializados en regulación financiera y cumplimiento normativo internacional.",
              },
            ].map((partner, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <partner.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {partner.title}
                </h3>
                <p className="text-foreground/70">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Benefits Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Beneficios del Ecosistema
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Acceso a herramientas, conocimiento y oportunidades que impulsan tu crecimiento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: Zap,
                title: "Tecnología Avanzada",
                description: "Plataforma de última generación con APIs abiertas y capacidades de automatización.",
              },
              {
                icon: Globe,
                title: "Alcance Global",
                description: "Acceso a mercados internacionales y oportunidades de inversión diversificadas.",
              },
              {
                icon: Shield,
                title: "Seguridad Garantizada",
                description: "Estándares de seguridad nivel institucional con auditoría continua y compliance regulatorio.",
              },
              {
                icon: Leaf,
                title: "Sostenibilidad",
                description: "Integración de principios ESG en todas las operaciones y productos financieros.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-foreground/70">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-primary/5 to-blue-50">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Únete a Nuestra Red de Socios
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Si eres una institución financiera, startup fintech o experto regulatorio interesado en colaborar con nosotros, nos gustaría conocerte.
          </p>
          <a
            href="/nosotros/contacto"
            className="inline-flex px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-bold text-lg shadow-lg hover:shadow-xl cursor-pointer"
          >
            Contáctanos Hoy
          </a>
        </div>
      </section>
    </Layout>
  );
}
