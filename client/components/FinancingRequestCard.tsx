import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FinancingRequest, EvaluacionComercial, calculateScoring, calculateRatesByScoring, getSTODataFromFinancingRequest, updateEvaluacionComercial, updateRequestStatus, deleteFinancingRequest, getFinancingRequests, getFinancingRequestById } from "@/lib/financingRequestManager";
import { addSTO } from "@/lib/stoManager";

interface FinancingRequestCardProps {
  request: FinancingRequest;
  evaluacionComercial: Record<string, EvaluacionComercial>;
  setEvaluacionComercial: (fn: (prev: Record<string, EvaluacionComercial>) => Record<string, EvaluacionComercial>) => void;
  financingNotes: Record<string, string>;
  setFinancingNotes: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  setFinancingRequests: (requests: FinancingRequest[]) => void;
}

export default function FinancingRequestCard({
  request,
  evaluacionComercial,
  setEvaluacionComercial,
  financingNotes,
  setFinancingNotes,
  setFinancingRequests,
}: FinancingRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentEval = evaluacionComercial[request.id];
  const scoring = currentEval ? calculateScoring(currentEval).scoring : null;
  const rates = scoring ? calculateRatesByScoring(scoring) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprobado":
        return "bg-green-100 text-green-700";
      case "Rechazado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden hover:shadow-md transition-all">
      {/* Header Section */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-foreground text-lg">{request.companyName}</h4>
            <p className="text-xs text-foreground/60 mt-1">
              RUT: {request.rutEmpresa} • Contacto: {request.firstName} {request.lastName}
            </p>
            <p className="text-xs text-foreground/60 mt-1">
              Email: {request.email} • Teléfono: {request.phone}
            </p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ml-2 ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <p className="text-foreground/60">Industria</p>
            <p className="font-semibold text-foreground capitalize">{request.industry}</p>
          </div>
          <div>
            <p className="text-foreground/60">Etapa del Negocio</p>
            <p className="font-semibold text-foreground capitalize">{request.businessStage}</p>
          </div>
          <div>
            <p className="text-foreground/60">Monto Solicitado</p>
            <p className="font-semibold text-foreground">${parseFloat(request.financingAmount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-foreground/60">Tipo de Financiamiento</p>
            <p className="font-semibold text-foreground capitalize">{request.financingType.replace("-", " ")}</p>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-white border-t border-border/40 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">
          {isExpanded ? "Ocultar" : "Mostrar"} Detalles Completos
        </span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <>
          {/* Extended Information Section */}
          <div className="p-4 bg-white border-t border-border/40">
            <p className="text-xs font-semibold text-foreground mb-3 uppercase text-primary">Información Adicional</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-foreground/60">Año de Fundación</p>
                <p className="font-semibold text-foreground">{request.foundedYear}</p>
              </div>
              <div>
                <p className="text-foreground/60">Empleados</p>
                <p className="font-semibold text-foreground">{request.employeeCount}</p>
              </div>
              <div>
                <p className="text-foreground/60">Ingresos Mensuales</p>
                <p className="font-semibold text-foreground">{request.monthlyRevenue}</p>
              </div>
              <div>
                <p className="text-foreground/60">Propósito</p>
                <p className="font-semibold text-foreground capitalize">{request.financingPurpose}</p>
              </div>
              {request.financingSubtype && (
                <div>
                  <p className="text-foreground/60">Subtipo</p>
                  <p className="font-semibold text-foreground capitalize">{request.financingSubtype.replace("-", " ")}</p>
                </div>
              )}
              <div>
                <p className="text-foreground/60">Fecha Solicitud</p>
                <p className="font-semibold text-foreground">{new Date(request.createdAt).toLocaleDateString("es-ES")}</p>
              </div>
            </div>
          </div>

          {/* Commercial Evaluation Section */}
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <p className="text-xs font-semibold text-foreground mb-3 uppercase text-primary">Evaluación Comercial</p>

            {/* Evaluation Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Viabilidad Financiera</label>
                <select
                  value={evaluacionComercial[request.id]?.viabilidadFinanciera || ""}
                  onChange={(e) =>
                    setEvaluacionComercial((prev) => ({
                      ...prev,
                      [request.id]: {
                        ...prev[request.id],
                        viabilidadFinanciera: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Excelente">Excelente (100%)</option>
                  <option value="Buena">Buena (75%)</option>
                  <option value="Regular">Regular (50%)</option>
                  <option value="Deficiente">Deficiente (25%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Viabilidad Tributaria</label>
                <select
                  value={evaluacionComercial[request.id]?.viabilidadTributaria || ""}
                  onChange={(e) =>
                    setEvaluacionComercial((prev) => ({
                      ...prev,
                      [request.id]: {
                        ...prev[request.id],
                        viabilidadTributaria: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Excelente">Excelente (100%)</option>
                  <option value="Buena">Buena (75%)</option>
                  <option value="Regular">Regular (50%)</option>
                  <option value="Deficiente">Deficiente (25%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Viabilidad Judicial</label>
                <select
                  value={evaluacionComercial[request.id]?.viabilidadJudicial || ""}
                  onChange={(e) =>
                    setEvaluacionComercial((prev) => ({
                      ...prev,
                      [request.id]: {
                        ...prev[request.id],
                        viabilidadJudicial: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Excelente">Excelente (100%)</option>
                  <option value="Buena">Buena (75%)</option>
                  <option value="Regular">Regular (50%)</option>
                  <option value="Deficiente">Deficiente (25%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Tendencia de Mercado</label>
                <select
                  value={evaluacionComercial[request.id]?.tendenciaMercado || ""}
                  onChange={(e) =>
                    setEvaluacionComercial((prev) => ({
                      ...prev,
                      [request.id]: {
                        ...prev[request.id],
                        tendenciaMercado: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Creciente">Creciente (100%)</option>
                  <option value="Estable">Estable (75%)</option>
                  <option value="Decreciente">Decreciente (25%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Calidad del Equipo</label>
                <select
                  value={evaluacionComercial[request.id]?.calidadEquipo || ""}
                  onChange={(e) =>
                    setEvaluacionComercial((prev) => ({
                      ...prev,
                      [request.id]: {
                        ...prev[request.id],
                        calidadEquipo: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Excepcional">Excepcional (100%)</option>
                  <option value="Fuerte">Fuerte (75%)</option>
                  <option value="Adecuada">Adecuada (50%)</option>
                  <option value="Débil">Débil (25%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-foreground/60 mb-1 block">Reputación de la Empresa</label>
                <select
                  value={evaluacionComercial[request.id]?.reputacionEmpresa || ""}
                  onChange={(e) =>
                    setEvaluacionComercial((prev) => ({
                      ...prev,
                      [request.id]: {
                        ...prev[request.id],
                        reputacionEmpresa: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Excelente">Excelente (100%)</option>
                  <option value="Buena">Buena (75%)</option>
                  <option value="Regular">Regular (50%)</option>
                  <option value="Deficiente">Deficiente (25%)</option>
                </select>
              </div>
            </div>

            {/* Scoring and Rates Summary */}
            {currentEval && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg border border-blue-200">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Scoring General</p>
                    <p className="text-3xl font-bold text-primary">{scoring}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Estado</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        calculateScoring(currentEval).aprobado
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {calculateScoring(currentEval).aprobado ? "APROBABLE" : "RECHAZADO"}
                    </span>
                  </div>
                </div>

                {rates && (
                  <div className="space-y-4 border-l border-blue-200 pl-4">
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Categoría de Riesgo</p>
                      <p className="text-lg font-bold text-foreground">{rates.riskCategory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Financiamiento</p>
                      <p className="text-lg font-bold text-green-600">{calculateScoring(currentEval).financingTier}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Commission and Rates Based on Evaluation */}
            {rates && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-xs text-foreground/60 mb-2 font-semibold">Comisión Establecida</p>
                  <p className="text-2xl font-bold text-green-700">{rates.commissionRate.toFixed(2)}%</p>
                  <p className="text-xs text-foreground/60 mt-1">Según evaluación comercial</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-2 font-semibold">Tasa Beneficio Aportante</p>
                  <p className="text-2xl font-bold text-green-700">{rates.benefitRate.toFixed(2)}%</p>
                  <p className="text-xs text-foreground/60 mt-1">Rendimiento anual para inversores</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-2 font-semibold">Tasa de Interés Mensual</p>
                  <p className="text-2xl font-bold text-green-700">{rates.monthlyInterestRate.toFixed(2)}%</p>
                  <p className="text-xs text-foreground/60 mt-1">Costo del financiamiento</p>
                </div>
              </div>
            )}

            {/* Observations */}
            <div>
              <label className="text-xs text-foreground/60 mb-1 block">Observaciones de Evaluación</label>
              <textarea
                value={evaluacionComercial[request.id]?.observaciones || ""}
                onChange={(e) =>
                  setEvaluacionComercial((prev) => ({
                    ...prev,
                    [request.id]: {
                      ...prev[request.id],
                      observaciones: e.target.value,
                    },
                  }))
                }
                placeholder="Detalles adicionales de la evaluación comercial..."
                className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={2}
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-4 bg-white border-t border-border/40">
            <p className="text-xs font-semibold text-foreground mb-2">Notas / Comentarios</p>
            <textarea
              value={financingNotes[request.id] || request.notes || ""}
              onChange={(e) =>
                setFinancingNotes((prev) => ({
                  ...prev,
                  [request.id]: e.target.value,
                }))
              }
              placeholder="Añade notas o comentarios sobre esta solicitud..."
              className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={2}
            />
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 border-t border-border/40 flex gap-2 flex-wrap">
            <button
              onClick={() => {
                // Update evaluation first
                if (evaluacionComercial[request.id]) {
                  updateEvaluacionComercial(request.id, evaluacionComercial[request.id]);
                }

                // Get STO data from the financing request
                const stoResult = getSTODataFromFinancingRequest(request);

                if (stoResult.success && stoResult.data) {
                  try {
                    // Create the STO
                    const newSTO = addSTO(stoResult.data);

                    // Update financing request status with STO reference and rates
                    updateRequestStatus(
                      request.id,
                      "Aprobado",
                      `Tokenizado exitosamente. STO creado con financiamiento al ${stoResult.financingTier}. Comisión: ${stoResult.rates?.commissionRate.toFixed(2)}%, Beneficio Aportante: ${stoResult.rates?.benefitRate.toFixed(2)}%. ${financingNotes[request.id] || ""}`
                    );

                    // Refresh and clear state
                    setFinancingRequests(getFinancingRequests());
                    setFinancingNotes((prev) => {
                      const newNotes = { ...prev };
                      delete newNotes[request.id];
                      return newNotes;
                    });
                    setEvaluacionComercial((prev) => {
                      const newEval = { ...prev };
                      delete newEval[request.id];
                      return newEval;
                    });

                    alert(`STO creado exitosamente (${stoResult.financingTier} del monto solicitado). Comisión: ${stoResult.rates?.commissionRate.toFixed(2)}%, Beneficio: ${stoResult.rates?.benefitRate.toFixed(2)}%`);
                  } catch (error) {
                    alert(`Error al crear STO: ${(error as any).message}`);
                  }
                } else {
                  alert(stoResult.message);
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              Aprobar y Tokenizar
            </button>
            <button
              onClick={() => {
                updateRequestStatus(request.id, "Rechazado", financingNotes[request.id] || "");
                if (evaluacionComercial[request.id]) {
                  updateEvaluacionComercial(request.id, evaluacionComercial[request.id]);
                }
                setFinancingRequests(getFinancingRequests());
                setFinancingNotes((prev) => {
                  const newNotes = { ...prev };
                  delete newNotes[request.id];
                  return newNotes;
                });
                setEvaluacionComercial((prev) => {
                  const newEval = { ...prev };
                  delete newEval[request.id];
                  return newEval;
                });
              }}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Rechazar
            </button>
            {request.status !== "Pendiente" && (
              <button
                onClick={() => {
                  updateRequestStatus(request.id, "Pendiente", "");
                  setFinancingRequests(getFinancingRequests());
                  setFinancingNotes((prev) => {
                    const newNotes = { ...prev };
                    delete newNotes[request.id];
                    return newNotes;
                  });
                  setEvaluacionComercial((prev) => {
                    const newEval = { ...prev };
                    delete newEval[request.id];
                    return newEval;
                  });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded text-sm font-semibold hover:bg-gray-500 transition-colors"
              >
                Devolver a Pendiente
              </button>
            )}
            <button
              onClick={() => {
                if (confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
                  deleteFinancingRequest(request.id);
                  setFinancingRequests(getFinancingRequests());
                  setFinancingNotes((prev) => {
                    const newNotes = { ...prev };
                    delete newNotes[request.id];
                    return newNotes;
                  });
                  setEvaluacionComercial((prev) => {
                    const newEval = { ...prev };
                    delete newEval[request.id];
                    return newEval;
                  });
                }
              }}
              className="px-4 py-2 bg-gray-300 text-foreground rounded text-sm font-semibold hover:bg-gray-400 transition-colors ml-auto"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
