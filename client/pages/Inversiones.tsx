import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Calendar, DollarSign, TrendingUp, Users, AlertCircle } from "lucide-react";
import { getActiveSTOs, type STO } from "@/lib/stoManager";
import { getSmartContracts, type SmartContract } from "@/lib/smartContractManager";
import STODetailModal from "@/components/STODetailModal";

export default function Inversiones() {
  const [stos, setSTOs] = useState<STO[]>([]);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [selectedSTO, setSelectedSTO] = useState<STO | null>(null);

  useEffect(() => {
    setSTOs(getActiveSTOs());
    setContracts(getSmartContracts());
  }, []);

  const stoTypes = ["Todos", "Equity", "Debt", "Hybrid", "Utility"];
  
  const filteredSTOs = (
    selectedType === "Todos"
      ? stos
      : stos.filter((sto) => sto.tipoSTO === selectedType)
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
            <h1 className="text-5xl text-foreground mb-4">Oportunidades de Inversión</h1>
            <p className="text-xl text-foreground/70">
              Accede a ofertas de tokens (STOs) con alta rentabilidad potencial
            </p>
          </div>

          {/* Type Filter */}
          {stoTypes.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {stoTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedType === type
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white border border-border/40 text-foreground hover:bg-secondary/20"
                  }`}
                >
                  {type}
                </button>
              ))}
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
                    className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-border/40 bg-gradient-to-r from-primary/5 to-blue-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-1">{sto.nombreActivo}</h3>
                          <p className="text-sm text-foreground/60">{sto.simboloActivo}</p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : sto.estado === "Activo"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isActive ? "En Venta" : sto.estado}
                        </span>
                      </div>
                      {sto.descripcion && (
                        <p className="text-sm text-foreground/70 mt-2">{sto.descripcion}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                      {/* Type Badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {sto.tipoSTO}
                        </span>
                      </div>

                      {/* Key Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-foreground/60">Precio por Token</p>
                            <p className="text-sm font-semibold text-foreground">${sto.precioPorToken} USDC</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-foreground/60">Tokens Disponibles</p>
                            <p className="text-sm font-semibold text-foreground">{sto.numerosTokensVenta} tokens</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-foreground/60">Fecha de Finalización</p>
                            <p className="text-sm font-semibold text-foreground">
                              {new Date(sto.fechaFin).toLocaleDateString("es-ES")} ({daysRemaining} días)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-foreground">Meta de Recaudación</p>
                          <p className="text-xs text-foreground/60">
                            ${sto.montoRecaudadoActual || "0"} / ${sto.montoMinimoRecaudacion}
                          </p>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Investment Limits */}
                      <div className="space-y-2 text-xs mb-6 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Inversión Mínima:</span>
                          <span className="font-semibold text-foreground">${sto.montoMinimoInversion} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Inversión Máxima:</span>
                          <span className="font-semibold text-foreground">${sto.montoMaximoInversion} USDC</span>
                        </div>
                      </div>

                      {/* Investors Count */}
                      <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg mb-6">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">{sto.inversionistas || 0} inversores</span>
                      </div>

                      {/* CTA Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedSTO(sto)}
                          className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-all text-sm font-semibold"
                        >
                          Ver Más Detalles
                        </button>
                        <button
                          disabled={!isActive}
                          className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                            isActive
                              ? "bg-primary text-white hover:bg-primary/90"
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
