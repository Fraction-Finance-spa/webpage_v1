import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { DollarSign, TrendingUp, Users, AlertCircle } from "lucide-react";
import { getActiveSTOs, type STO } from "@/lib/stoManager";
import { getSmartContracts, type SmartContract } from "@/lib/smartContractManager";
import STODetailModal from "@/components/STODetailModal";

export default function Inversiones() {
  const [stos, setSTOs] = useState<STO[]>([]);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedSTO, setSelectedSTO] = useState<STO | null>(null);

  useEffect(() => {
    setSTOs(getActiveSTOs());
    setContracts(getSmartContracts());
  }, []);

  const stoTypes = ["Todos", "Equity", "Debt", "Hybrid", "Utility"];
  const categories = ["Todas", "Capital de trabajo", "Bonos Corporativos", "Deuda Privada"];

  const filteredSTOs = (
    selectedType === "Todos" && selectedCategory === "Todas"
      ? stos
      : stos.filter((sto) => {
          const matchType = selectedType === "Todos" || sto.tipoSTO === selectedType;
          const matchCategory = selectedCategory === "Todas" ||
            contracts.find((c) => c.id === sto.activoDigitalId)?.categoria === selectedCategory;
          return matchType && matchCategory;
        })
  ).sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());

  const calculateProgress = (sto: STO) => {
    const minAmount = parseFloat(sto.montoMinimoRecaudacion);
    const raised = parseFloat(sto.montoRecaudadoActual || "0");
    return Math.min((raised / minAmount) * 100, 100);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-6xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl text-foreground mb-4 text-left">Alternativas de Financiamiento</h1>
            <p className="text-xl text-foreground/70 text-left">
              Accede a ofertas de financiamiento con rentabilidad
            </p>
          </div>


          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="mb-12">
              <p className="text-sm font-semibold text-foreground mb-3">Categoría del Activo:</p>
              <div className="flex flex-wrap gap-3 justify-start items-start">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-white shadow-lg"
                        : "bg-white border border-border/40 text-foreground hover:bg-secondary/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STOs Grid */}
          {filteredSTOs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSTOs.map((sto) => {
                const progress = calculateProgress(sto);
                const daysRemaining = Math.ceil(
                  (new Date(sto.fechaFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const isActive = new Date() >= new Date(sto.fechaInicio) && new Date() <= new Date(sto.fechaFin);
                const relatedContract = contracts.find((c) => c.id === sto.activoDigitalId);

                return (
                  <div
                    key={sto.id}
                    className="bg-white rounded-xl border border-border/40 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/20">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground truncate">{sto.nombreActivo}</h3>
                          <p className="text-sm text-foreground/60">{sto.simboloActivo}</p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : sto.estado === "Activo"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isActive ? "En Venta" : sto.estado}
                        </span>
                      </div>
                      {sto.porcentajeRendimiento && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-green-600">{sto.porcentajeRendimiento}%</span>
                          <span className="text-xs text-foreground/60">APY</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Description */}
                      {sto.descripcion && (
                        <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{sto.descripcion}</p>
                      )}

                      {/* Type Badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {sto.tipoSTO}
                        </span>
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-foreground/2 rounded-lg">
                        <div>
                          <p className="text-xs text-foreground/60 mb-1">Precio/Token</p>
                          <p className="text-sm font-bold text-foreground">${sto.precioPorToken}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/60 mb-1">Plazo</p>
                          <p className="text-sm font-bold text-foreground">{daysRemaining} días</p>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-4 mb-5 flex-1">
                        {/* Recaudación */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-foreground">Recaudado</label>
                            <span className="text-xs font-semibold text-primary">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-foreground/50 mt-1">
                            ${parseFloat(sto.montoRecaudadoActual || "0").toLocaleString("es-ES")} / ${parseFloat(sto.montoMinimoRecaudacion).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>

                      {/* Investment Info */}
                      <div className="border-t border-border/20 pt-3 mb-5">
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-foreground/60">Inversión Mínima</span>
                            <span className="font-semibold text-foreground">${sto.montoMinimoInversion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/60">Inversión Máxima</span>
                            <span className="font-semibold text-foreground">${sto.montoMaximoInversion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/60">Inversores</span>
                            <span className="font-semibold text-foreground">{sto.inversionistas || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="space-y-2 mt-auto">
                        <button
                          onClick={() => setSelectedSTO(sto)}
                          className="w-full py-2.5 px-4 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-all text-sm font-semibold"
                        >
                          Ver Detalles
                        </button>
                        <button
                          disabled={!isActive}
                          className={`w-full py-2.5 rounded-lg font-semibold transition-all text-sm ${
                            isActive
                              ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
                              : "bg-gray-200 text-foreground/40 cursor-not-allowed"
                          }`}
                        >
                          {isActive ? "Invertir Ahora" : "Próximamente"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <p className="text-lg text-foreground/70 mb-4">
                No hay ofertas de inversión disponibles en este momento.
              </p>
              <p className="text-sm text-foreground/60">
                Revisa más tarde para ver nuevas oportunidades de inversión
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSTO && (
        <STODetailModal
          sto={selectedSTO}
          contract={contracts.find((c) => c.id === selectedSTO.activoDigitalId)}
          onClose={() => setSelectedSTO(null)}
        />
      )}
    </Layout>
  );
}
