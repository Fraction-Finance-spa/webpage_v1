import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";
import { getOpenJobs, type Job } from "@/lib/jobsManager";
import CandidaturaForm from "@/components/CandidaturaForm";

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
      {/* Main Section */}
      <section className="px-4 sm:px-6 lg:px-8" style={{ padding: "80px 32px 0" }}>
        <div className="container max-w-6xl mx-auto" style={{ margin: "40px auto 0" }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              <p>Trabaja con nosotros</p>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Somos una empresa en crecimiento comprometida con la innovación, la inclusión y el impacto positivo en el ecosistema de activos digitales.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="px-4 sm:px-6 lg:px-8 bg-secondary/20" style={{ padding: "10px 32px 80px" }}>
        <div className="container max-w-6xl mx-auto">
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
