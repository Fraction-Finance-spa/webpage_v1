import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";
import { getOpenJobs, type Job } from "@/lib/jobsManager";

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Todos");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    setJobs(getOpenJobs());
  }, []);

  const departments = [
    "Todos",
    ...Array.from(new Set(jobs.map((job) => job.departamento))),
  ];

  const filteredJobs =
    selectedDepartment === "Todos"
      ? jobs
      : jobs.filter((job) => job.departamento === selectedDepartment);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2Fc2c24d2c61be44c58d8307f0bb9149f7)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: "600px",
          padding: "120px 32px 80px 32px",
        }}
      >
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2F6167da881eab41e9aebafce58dbb6d51)", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover" }}>
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary/15 to-transparent rounded-full filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight mb-6">
            <span style={{ color: "rgba(255, 255, 255, 1)", textShadow: "1px 1px 3px rgba(0, 0, 0, 1)" }}>
              Trabaja con Nosotros
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 max-w-3xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.95)", textShadow: "1px 1px 3px rgba(0, 0, 0, 1)" }}>
            Únete a un equipo apasionado por revolucionar el mundo de las finanzas digitales
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              ¿Por qué unirse a Fraction Finance?
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Somos una empresa en crecimiento comprometida con la innovación, la inclusión y el impacto positivo en el ecosistema de activos digitales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cultura de Innovación",
                description:
                  "Trabajamos con tecnologías de punta y fomentamos la creatividad y el pensamiento innovador.",
              },
              {
                title: "Equipo Talentoso",
                description:
                  "Te rodearás de profesionales expertos en finanzas, tecnología y regulaciones de activos digitales.",
              },
              {
                title: "Crecimiento Profesional",
                description:
                  "Ofrecemos oportunidades de capacitación continua y desarrollo de carrera.",
              },
              {
                title: "Impacto Real",
                description:
                  "Tu trabajo contribuye a democratizar el acceso a mercados financieros globales.",
              },
              {
                title: "Beneficios Competitivos",
                description:
                  "Paquetes de compensación atractivos, flexibilidad laboral y beneficios integrales.",
              },
              {
                title: "Ambiente Colaborativo",
                description:
                  "Fomentamos una cultura de colaboración, diversidad e inclusión.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-foreground/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-secondary/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Posiciones Abiertas
            </h2>
            <p className="text-xl text-foreground/70">
              {filteredJobs.length} oportunidad{filteredJobs.length !== 1 ? "s" : ""} disponible{filteredJobs.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedDepartment === dept
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-all"
                >
                  <button
                    onClick={() =>
                      setExpandedJobId(
                        expandedJobId === job.id ? null : job.id
                      )
                    }
                    className="w-full text-left"
                  >
                    <div className="p-6 sm:p-8 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Briefcase className="w-6 h-6 text-primary flex-shrink-0" />
                          <h3 className="text-2xl font-bold text-foreground">
                            {job.titulo}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm text-foreground/70">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.tipo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.ubicacion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                              {job.departamento}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                          expandedJobId === job.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedJobId === job.id && (
                    <div className="border-t border-border/40 p-6 sm:p-8 bg-secondary/20">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-foreground mb-3">
                            Descripción del Puesto
                          </h4>
                          <p className="text-foreground/70 leading-relaxed">
                            {job.descripcion}
                          </p>
                        </div>

                        {job.requisitos && job.requisitos.length > 0 && (
                          <div>
                            <h4 className="font-bold text-foreground mb-3">
                              Requisitos
                            </h4>
                            <ul className="space-y-2">
                              {job.requisitos.map((req, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 text-foreground/70"
                                >
                                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {job.beneficios && job.beneficios.length > 0 && (
                          <div>
                            <h4 className="font-bold text-foreground mb-3">
                              Beneficios
                            </h4>
                            <ul className="space-y-2">
                              {job.beneficios.map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 text-foreground/70"
                                >
                                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Link
                          to="/auth"
                          className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-bold flex items-center gap-2"
                        >
                          Aplicar Ahora
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70 mb-4">
                No hay posiciones disponibles en este momento en el departamento seleccionado.
              </p>
              <p className="text-foreground/50">
                Consulta más tarde o envíanos tu CV a careers@fractionfinance.com
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-xl text-foreground/70 mb-8">
            Estamos siempre en busca de talento. Envíanos tu CV y nos pondremos en contacto si existe una oportunidad adecuada.
          </p>
          <a
            href="mailto:careers@fractionfinance.com"
            className="inline-block px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-lg"
          >
            Enviar Candidatura
          </a>
        </div>
      </section>
    </Layout>
  );
}
