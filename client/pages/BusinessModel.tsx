import Layout from "@/components/Layout";
import { CheckCircle2, Users, TrendingUp, Lock, Clock, Zap, Wallet } from "lucide-react";

export default function BusinessModel() {
  const enterpriseBenefits = [
    "Acceso rápido a capital",
    "Costos de originación más bajos",
    "Procesos digitales y verificación automatizada",
    "Transparencia de fondos y flujos de pago",
  ];

  const investorBenefits = [
    "Acceso a activos de renta fija y crédito privado antes restringidos",
    "Monto mínimo de inversión reducido gracias a la fracción digital",
    "Información en tiempo real y mayor seguridad operativa",
    "Portafolios diversificados y con mejor relación riesgo-retorno",
  ];

  const competitiveAdvantages = [
    {
      title: "Acceso 24/7 a oportunidades de financiamiento e inversión",
      description: "Los activos tokenizados permiten operar sin restricciones de horarios ni intermediarios tradicionales.",
      icon: Clock,
    },
    {
      title: "Mayor liquidez para instrumentos históricamente ilíquidos",
      description: "La fraccionalización y los mercados digitales facilitan la compra, venta y transferencia de activos.",
      icon: TrendingUp,
    },
    {
      title: "Costos operativos reducidos mediante automatización",
      description: "Los smart contracts eliminan procesos manuales y disminuyen costos de originación, gestión y liquidación.",
      icon: Zap,
    },
    {
      title: "Transparencia total y trazabilidad on-chain",
      description: "Cada operación queda registrada en blockchain, permitiendo auditoría en tiempo real.",
      icon: CheckCircle2,
    },
    {
      title: "Seguridad criptográfica y cumplimiento regulatorio integrado",
      description: "Infraestructura compatible con KYC, AML y normas financieras, reforzada por estándares de seguridad blockchain.",
      icon: Lock,
    },
    {
      title: "Portafolios diversificados con exposición a activos reales",
      description: "Los inversionistas pueden construir carteras más estables y resilientes al acceder a instrumentos de financiamiento respaldados por activos reales tokenizados.",
      icon: Wallet,
    },
  ];

  const tokenizedInstruments = [
    {
      title: "Capital de Trabajo",
      description: ["Facturas (Factoring)", "Proveedores(Confirming)"],
    },
    {
      title: "Bonos Corporativos",
      description: ["Bonos privados.", "Bonos verdes."],
    },
    {
      title: "Deuda Privada",
      description: ["Crédito corto plazo", "Crédito largo plazo", "Crédito con garantía"],
    },
    {
      title: "Financiamiento Colaborativo",
      description:
        "Múltiples inversionistas participando en la originación y fondeo de activos mediante tokens fraccionados.",
    },
  ];

  const processSteps = [
    {
      number: 1,
      title: "Solicitud de Financiamiento",
      description: "La empresa presenta su necesidad de capital y carga la información requerida para evaluar y estructurar la oportunidad.",
    },
    {
      number: 2,
      title: "Creación de la Oferta",
      description: "Una vez validado el caso, se genera una oferta tokenizada con sus condiciones: monto, plazo, tasa y estructura del instrumento.",
    },
    {
      number: 3,
      title: "Aportantes Financian la Oferta",
      description: "Inversionistas retail e institucionales participan aportando capital de forma fraccionada mediante activos digitales.",
    },
    {
      number: 4,
      title: "Transferencia del Financiamiento",
      description: "Al completarse el fondeo, los recursos se liberan automáticamente a la empresa y comienza el ciclo de pago según las reglas del activo.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-blue-50" style={{ padding: "80px 0 5px" }}>
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Nuestro Modelo de Negocio
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              Conectamos el sistema financiero tradicional con tecnología blockchain
              para habilitar un mercado de financiamiento más ágil, transparente y
              escalable.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ margin: "0 auto -5px", padding: "64px 32px 0" }}>
          {/* Tokenización Section */}
          <section className="mb-20">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-6 text-center">
                Instrumentos financieros tokenizados
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                Digitalizamos instrumentos financieros para crear un
                sistema moderno de emisión, inversión y liquidez, donde
                múltiples inversionistas pueden participar en la
                originación y fondeo de activos mediante tokens
                fraccionados. La tokenización transforma los instrumentos
                de financiamiento en activos digitales programables,
                negociables y accesibles para todos.
              </p>
            </div>

            {/* Instruments Grid */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tokenizedInstruments.slice(0, 3).map((instrument, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0" />
                        <div className="flex flex-col" style={{ margin: "0 6px 0 -2px" }}>
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mx-auto">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          </div>
                          <h4 className="text-lg font-bold text-foreground mb-2 pt-2.5">
                            {instrument.title}
                          </h4>
                          <div className="text-foreground/70 leading-relaxed mb-4.5">
                            {Array.isArray(instrument.description) ? (
                              <>
                                {instrument.description.map((item, idx) => (
                                  <p key={idx} className="mb-0">
                                    {item}
                                  </p>
                                ))}
                              </>
                            ) : (
                              <p>{instrument.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-20">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-6 text-center">
                ¿Cómo Funciona?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white font-bold text-lg">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ecosystem Section */}
          <section className="mb-20 relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 md:p-12">
              <h2 className="text-4xl font-bold text-foreground mb-6 text-center">
                Creando un Ecosistema de Valor
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-12 text-center">
                Diseñamos una infraestructura que beneficia tanto a
                empresas como a inversionistas, integrando emisión,
                custodia, inversión, cumplimiento y liquidez en un solo
                entorno.
              </p>

              {/* Two Column Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* For Enterprises */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Para Empresas
                </h3>
                  <ul className="space-y-4">
                    {enterpriseBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/70 leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* For Investors */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Para Inversionistas
                </h3>
                  <ul className="space-y-4">
                    {investorBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/70 leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Competitive Advantages */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
              Ventajas Competitivas
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-12">
              Nuestra propuesta combina infraestructura blockchain con procesos
              financieros tradicionales, permitiendo:
            </p>

            <div className="flex flex-col gap-4">
              {competitiveAdvantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative pt-2.5 px-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10" style={{ margin: "auto 0" }}>
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm leading-snug" style={{ margin: "auto 0" }}>
                          {advantage.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
