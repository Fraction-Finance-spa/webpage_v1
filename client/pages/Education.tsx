import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Users, Clock, ArrowRight } from "lucide-react";
import { getPublishedCards, type EducacionCard } from "@/lib/educacionManager";

export default function Education() {
  const [cards, setCards] = useState<EducacionCard[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("Todos");

  useEffect(() => {
    setCards(getPublishedCards());
  }, []);

  const levels = [
    "Todos",
    ...Array.from(new Set(cards.map((c) => c.nivel).filter((n) => n))),
  ];

  const filteredCards = (
    selectedLevel === "Todos"
      ? cards
      : cards.filter((c) => c.nivel === selectedLevel)
  ).sort((a, b) => {
    const dateA = new Date(a.fechaCreacion).getTime();
    const dateB = new Date(b.fechaCreacion).getTime();
    return dateB - dateA;
  });

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-6xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl text-foreground mb-4">Educación Financiera</h1>
            <p className="text-xl text-foreground/70">
              Aprende sobre inversión, activos digitales y finanzas descentralizadas
            </p>
          </div>

          {/* Level Filter */}
          {levels.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedLevel === level
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white border border-border/40 text-foreground hover:bg-secondary/20"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}

          {/* Education Cards Grid */}
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg border border-border/40 hover:shadow-lg transition-all duration-300 flex flex-col p-6"
                >
                  {card.nivel && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit ${
                      card.nivel === "Básico" ? "bg-green-100 text-green-700" :
                      card.nivel === "Intermedio" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {card.nivel}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {card.titulo}
                  </h3>

                  {card.descripcion && (
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                      {card.descripcion}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-foreground/60 mb-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{card.instructor}</span>
                    </div>
                    {card.duracion && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{card.duracion}</span>
                      </div>
                    )}
                  </div>

                  <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold text-sm w-full justify-between px-3 py-2 hover:bg-primary/5 rounded">
                    Más información
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70 mb-4">
                No hay cursos disponibles en este nivel.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
