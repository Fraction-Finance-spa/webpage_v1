import { useState } from "react";
import { X, FileText, Download, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { type STO } from "@/lib/stoManager";
import { type SmartContract } from "@/lib/smartContractManager";
import { addInvestment } from "@/lib/investmentManager";

interface STODetailModalProps {
  sto: STO;
  contract: SmartContract | undefined;
  onClose: () => void;
}

export default function STODetailModal({ sto, contract, onClose }: STODetailModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  const isActive = new Date() >= new Date(sto.fechaInicio) && new Date() <= new Date(sto.fechaFin);
  const daysRemaining = Math.ceil(
    (new Date(sto.fechaFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    const minInvestment = parseFloat(sto.montoMinimoInversion);
    const maxInvestment = parseFloat(sto.montoMaximoInversion);

    if (!amount || amount < minInvestment || amount > maxInvestment) {
      alert(`La inversión debe estar entre $${minInvestment} y $${maxInvestment} USDC`);
      return;
    }

    setIsInvesting(true);

    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const tasaEsperada = parseFloat(sto.porcentajeRendimiento || "0");

      // Calculate investment term in months (for demo purposes, using months from end date)
      const monthsUntilEnd = Math.max(1, Math.round(daysRemaining / 30));
      const plazo = `${monthsUntilEnd} meses`;

      // For demo purposes, assume 0% current return (will increase over time in real scenario)
      addInvestment(userEmail, {
        stoId: sto.id,
        stoNombre: sto.nombreActivo,
        tipo: sto.tipoSTO,
        montoInvertido: amount,
        tasaEsperada: tasaEsperada,
        plazo: plazo,
        estado: "Activo",
        progreso: 0,
        fechaInversion: new Date().toISOString(),
        fechaVencimiento: sto.fechaFin,
        rentabilidadActual: 0,
      });

      setInvestmentSuccess(true);
      setInvestmentAmount("");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      alert("Error al realizar la inversión. Intenta de nuevo.");
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/5 to-blue-50/50 border-b border-border/40 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">{sto.nombreActivo}</h2>
            <p className="text-sm text-foreground/60">{sto.simboloActivo} • {sto.tipoSTO}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Status & Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Descripción</p>
                  <p className="text-sm text-foreground">{sto.descripcion}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-foreground/60 mb-1">Período de Oferta</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="text-sm text-foreground">
                    {new Date(sto.fechaInicio).toLocaleDateString("es-ES")} al{" "}
                    {new Date(sto.fechaFin).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <p className="text-xs text-foreground/60 mt-1">({daysRemaining} días)</p>
              </div>

              {sto.porcentajeRendimiento && (
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Rendimiento Anual Esperado</p>
                  <p className="text-lg font-bold text-green-600">{sto.porcentajeRendimiento}% APY</p>
                </div>
              )}
            </div>
          </div>

          {/* Token Details */}
          <div className="border-t border-border/40 pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Detalles del Token</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-semibold text-blue-900">Precio por Token</p>
                </div>
                <p className="text-lg font-bold text-blue-700">${sto.precioPorToken} USDC</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-semibold text-green-900">Tokens Disponibles</p>
                </div>
                <p className="text-lg font-bold text-green-700">{sto.numerosTokensVenta}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <p className="text-xs font-semibold text-purple-900">Inversores</p>
                </div>
                <p className="text-lg font-bold text-purple-700">{sto.inversionistas || 0}</p>
              </div>
            </div>
          </div>

          {/* Fundraising Goals */}
          <div className="border-t border-border/40 pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Metas de Recaudación</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">Progreso de Recaudación</p>
                  <p className="text-sm text-foreground/60">
                    ${sto.montoRecaudadoActual || "0"} / ${sto.montoMinimoRecaudacion}
                  </p>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (parseFloat(sto.montoRecaudadoActual || "0") / parseFloat(sto.montoMinimoRecaudacion)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                  <p className="text-xs text-foreground/60 mb-1">Monto Mínimo</p>
                  <p className="text-sm font-bold text-foreground">${sto.montoMinimoRecaudacion}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                  <p className="text-xs text-foreground/60 mb-1">Monto Máximo</p>
                  <p className="text-sm font-bold text-foreground">${sto.montoMaximoRecaudacion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Limits */}
          <div className="border-t border-border/40 pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Límites de Inversión</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                <p className="text-xs text-foreground/60 mb-1">Inversión Mínima</p>
                <p className="text-sm font-bold text-foreground">${sto.montoMinimoInversion} USDC</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                <p className="text-xs text-foreground/60 mb-1">Inversión Máxima</p>
                <p className="text-sm font-bold text-foreground">${sto.montoMaximoInversion} USDC</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {contract && contract.documentos && contract.documentos.length > 0 && (
            <div className="border-t border-border/40 pt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Documentos Técnicos y de Respaldo</h3>
              <div className="space-y-2">
                {contract.documentos.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    download={doc.nombre}
                    className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{doc.nombre}</p>
                      <p className="text-xs text-foreground/60">
                        {new Date(doc.fechaCarga).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-border/40 pt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors font-semibold"
            >
              Cerrar
            </button>
            <button
              disabled={!isActive}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
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
    </div>
  );
}
