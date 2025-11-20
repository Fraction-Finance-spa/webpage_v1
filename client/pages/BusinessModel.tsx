import Layout from "@/components/Layout";
import { CheckCircle2, Users, TrendingUp, Lock, Clock } from "lucide-react";

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
      title: "Acceso 24/7",
      description: "A oportunidades de inversión sin límites horarios",
      icon: Clock,
    },
    {
      title: "Mayor Liquidez",
      description: "En activos históricamente ilíquidos",
      icon: TrendingUp,
    },
    {
      title: "Costos Operativos Bajos",
      description: "Gracias a la automatización y smart contracts",
      icon: Users,
    },
    {
      title: "Transparencia Total",
      description: "En cada transacción y operación",
      icon: CheckCircle2,
    },
    {
      title: "Seguridad Integrada",
      description: "Criptográfica y cumplimiento regulatorio",
      icon: Lock,
    },
  ];

  const tokenizedInstruments = [
    {
      title: "Capital de Trabajo",
      description:
        "Financiamiento directo para operaciones y flujo de caja empresarial.",
    },
    {
      title: "Bonos Corporativos",
      description: "Emisiones digitales con pagos automatizados y trazabilidad total.",
    },
    {
      title: "Deuda Privada",
      description:
        "Estructuras eficientes para préstamos privados con reglas programadas en smart contracts.",
    },
    {
      title: "Financiamiento Colaborativo",
      description:
        "Múltiples inversionistas participando en la originación y fondeo de activos mediante tokens fraccionados.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-blue-50" style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tokenizedInstruments.slice(0, 3).map((instrument, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-2">
                            {instrument.title}
                          </h4>
                          <p className="text-foreground/70 leading-relaxed">
                            {instrument.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ventajas Competitivas
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-12">
              Nuestra propuesta combina infraestructura blockchain con procesos
              financieros tradicionales, permitiendo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {competitiveAdvantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground">
                          {advantage.title}
                        </h3>
                      </div>
                      <p className="text-foreground/70 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Closing Section */}
          <section className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 md:p-12">
              <p className="text-lg text-foreground leading-relaxed">
                <strong>Fraction Finance</strong> crea un nuevo estándar para la
                inversión y el financiamiento, llevando a las empresas a obtener
                capital de manera más eficiente y a los inversionistas a acceder a
                activos reales con mayor confianza y flexibilidad.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
