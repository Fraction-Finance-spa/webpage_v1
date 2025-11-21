import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Users, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import { getEducacionCards, type EducacionCard } from "@/lib/educacionManager";

export default function EducationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<EducacionCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cards = getEducacionCards();
    const found = cards.find((c) => c.id === id);
    setCard(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: "120px" }}>
          <p className="text-center text-foreground/60">Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!card) {
    return (
      <Layout>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: "120px" }}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-border/40 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-primary/40 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Curso no encontrado</h1>
              <p className="text-foreground/60 mb-6">
                El curso que buscas no existe o ha sido eliminado.
              </p>
              <button
                onClick={() => navigate("/nosotros/educacion")}
                className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Educación
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-4xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Back Button */}
          <button
            onClick={() => navigate("/nosotros/educacion")}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Educación
          </button>

          {/* Course Header */}
          <div className="bg-white rounded-lg border border-border/40 p-8 mb-8">
            {/* Level Badge */}
            {card.nivel && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                card.nivel === "Básico" ? "bg-green-100 text-green-700" :
                card.nivel === "Intermedio" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {card.nivel}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {card.titulo}
            </h1>

            {/* Description */}
            {card.descripcion && (
              <p className="text-lg text-foreground/70 mb-6">
                {card.descripcion}
              </p>
            )}

            {/* Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/20 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Instructor</p>
                  <p className="text-lg font-semibold text-foreground">{card.instructor}</p>
                </div>
              </div>

              {card.duracion && (
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-foreground/60">Duración</p>
                    <p className="text-lg font-semibold text-foreground">{card.duracion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-lg border border-border/40 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Contenido del Curso</h2>

            <div className="prose prose-sm max-w-none">
              {/* Parse and render HTML content */}
              <div 
                className="text-foreground/80 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: card.contenido }}
              />
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-border/40">
              <p className="text-sm text-foreground/60">
                Creado el {new Date(card.fechaCreacion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/nosotros/educacion")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Explorar más cursos
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
