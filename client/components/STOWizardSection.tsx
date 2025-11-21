import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, DollarSign } from "lucide-react";
import { addSTO, updateSTO, type STO } from "@/lib/stoManager";
import { type SmartContract } from "@/lib/smartContractManager";

interface STOWizardSectionProps {
  setActiveSection: (section: string) => void;
  onSTOCreated: () => void;
  smartContracts: SmartContract[];
  editingSTO?: STO | null;
}

interface WizardState {
  step: number;
  activoDigitalId: string;
  nombreActivo: string;
  simboloActivo: string;
  estado: "Pendiente" | "Activo" | "Inactivo" | "Cerrado";
  tipoSTO: "Equity" | "Debt" | "Hybrid" | "Utility";
  numerosTokensVenta: string;
  precioPorToken: string;
  fechaInicio: string;
  fechaFin: string;
  montoMinimoRecaudacion: string;
  montoMaximoRecaudacion: string;
  montoMinimoInversion: string;
  montoMaximoInversion: string;
  descripcion: string;
  porcentajeRendimiento: string;
}

const STO_TYPES = [
  { id: "Equity", name: "Equity (Acciones)", description: "Tokens que representan participación accionaria" },
  { id: "Debt", name: "Debt (Deuda)", description: "Tokens que representan obligaciones de deuda" },
  { id: "Hybrid", name: "Hybrid (Híbrido)", description: "Combinación de características de Equity y Debt" },
  { id: "Utility", name: "Utility (Utilidad)", description: "Tokens con utilidad específica en la plataforma" },
];

export default function STOWizardSection({
  setActiveSection,
  onSTOCreated,
  smartContracts,
  editingSTO,
}: STOWizardSectionProps) {
  const [state, setState] = useState<WizardState>({
    step: 1,
    activoDigitalId: editingSTO?.activoDigitalId || "",
    nombreActivo: editingSTO?.nombreActivo || "",
    simboloActivo: editingSTO?.simboloActivo || "",
    estado: editingSTO?.estado || "Pendiente",
    tipoSTO: editingSTO?.tipoSTO || "Equity",
    numerosTokensVenta: editingSTO?.numerosTokensVenta || "",
    precioPorToken: editingSTO?.precioPorToken || "",
    fechaInicio: editingSTO ? editingSTO.fechaInicio.split("T")[0] : "",
    fechaFin: editingSTO ? editingSTO.fechaFin.split("T")[0] : "",
    montoMinimoRecaudacion: editingSTO?.montoMinimoRecaudacion || "",
    montoMaximoRecaudacion: editingSTO?.montoMaximoRecaudacion || "",
    montoMinimoInversion: editingSTO?.montoMinimoInversion || "",
    montoMaximoInversion: editingSTO?.montoMaximoInversion || "",
    descripcion: editingSTO?.descripcion || "",
    porcentajeRendimiento: editingSTO?.porcentajeRendimiento || "",
  });

  const handleNext = () => {
    if (state.step < 4) {
      if (state.step === 1 && !state.activoDigitalId) {
        alert("Por favor selecciona un activo digital");
        return;
      }
      if (state.step === 2 && !state.tipoSTO) {
        alert("Por favor selecciona un tipo de STO");
        return;
      }
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handlePrevious = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleSubmit = () => {
    if (
      !state.activoDigitalId ||
      !state.tipoSTO ||
      !state.numerosTokensVenta ||
      !state.precioPorToken ||
      !state.fechaInicio ||
      !state.fechaFin ||
      !state.montoMinimoRecaudacion ||
      !state.montoMaximoRecaudacion ||
      !state.montoMinimoInversion ||
      !state.montoMaximoInversion
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      if (editingSTO) {
        updateSTO(editingSTO.id, state);
      } else {
        addSTO(state as Omit<STO, "id" | "fechaCreacion" | "fechaActualizacion">);
      }
      onSTOCreated();
      setActiveSection("sto");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al crear la oferta");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {editingSTO ? "Editar Oferta de Financiamiento" : "Crear Nueva Oferta de Financiamiento"}
        </h2>
        <p className="text-foreground/70">
          Define los parámetros para una nueva oferta pública de tokens (STO).
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step < state.step
                    ? "bg-green-500 text-white"
                    : step === state.step
                      ? "bg-primary text-white border-2 border-primary"
                      : "bg-gray-200 text-foreground/60"
                }`}
              >
                {step < state.step ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              <p className="text-xs mt-1 text-center text-foreground/60">Paso {step}</p>
            </div>
          ))}
        </div>

        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
            style={{ width: `${((state.step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-border/40 p-6">
        {/* Step 1: Select Asset */}
        {state.step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 1 de 4: Seleccionar Activo Digital</h3>
            <p className="text-sm text-foreground/70">
              Elige el activo digital para el cual deseas crear la oferta de tokens.
            </p>
            <select
              value={state.activoDigitalId}
              onChange={(e) => {
                const selected = smartContracts.find((sc) => sc.id === e.target.value);
                setState((prev) => ({
                  ...prev,
                  activoDigitalId: e.target.value,
                  nombreActivo: selected?.nombre || "",
                  simboloActivo: selected?.simbolo || "",
                  numerosTokensVenta: selected?.suministroMaximo || "",
                }));
              }}
              className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Selecciona un activo digital</option>
              {smartContracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.nombre} ({contract.simbolo}) - {contract.suministroMaximo} tokens
                </option>
              ))}
            </select>
            {state.activoDigitalId && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-semibold">✓ Activo seleccionado</p>
                <p className="text-xs text-green-600 mt-1">
                  {state.nombreActivo} ({state.simboloActivo}) - {state.numerosTokensVenta} tokens disponibles
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: STO Type & Status */}
        {state.step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 2 de 4: Tipo de Oferta</h3>
            <p className="text-sm text-foreground/70">
              Selecciona el tipo de oferta de tokens que deseas crear.
            </p>
            <div className="space-y-3">
              {STO_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setState((prev) => ({ ...prev, tipoSTO: type.id as any }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    state.tipoSTO === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border/40 hover:border-primary/50 bg-white"
                  }`}
                >
                  <h4 className="font-bold text-foreground text-sm mb-1">{type.name}</h4>
                  <p className="text-xs text-foreground/70">{type.description}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Estado Inicial</label>
              <select
                value={state.estado}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    estado: e.target.value as "Pendiente" | "Activo" | "Inactivo" | "Cerrado",
                  }))
                }
                className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Token Details */}
        {state.step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 3 de 4: Detalles del Token</h3>
            <p className="text-sm text-foreground/70">
              Define los parámetros de precio y disponibilidad del token.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Precio por Token (USDC)</label>
                <input
                  type="number"
                  step="0.01"
                  value={state.precioPorToken}
                  onChange={(e) => setState((prev) => ({ ...prev, precioPorToken: e.target.value }))}
                  placeholder="Ej: 1.50"
                  className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Porcentaje de Rendimiento Anual (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={state.porcentajeRendimiento}
                    onChange={(e) => setState((prev) => ({ ...prev, porcentajeRendimiento: e.target.value }))}
                    placeholder="Ej: 12.5"
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="absolute right-4 top-2 text-foreground/60 font-semibold">%</span>
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  Tasa de rendimiento anual esperado para los inversores
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Descripción (Opcional)</label>
                <textarea
                  value={state.descripcion}
                  onChange={(e) => setState((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción de la oferta"
                  rows={3}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={state.fechaInicio}
                    onChange={(e) => setState((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Fecha de Fin</label>
                  <input
                    type="date"
                    value={state.fechaFin}
                    onChange={(e) => setState((prev) => ({ ...prev, fechaFin: e.target.value }))}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Investment Limits */}
        {state.step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 4 de 4: Límites de Inversión</h3>
            <p className="text-sm text-foreground/70">
              Define los montos mínimo y máximo de recaudación e inversión.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Monto Mínimo de Recaudación</label>
                <input
                  type="number"
                  step="0.01"
                  value={state.montoMinimoRecaudacion}
                  onChange={(e) => setState((prev) => ({ ...prev, montoMinimoRecaudacion: e.target.value }))}
                  placeholder="Ej: 50000"
                  className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Monto Máximo de Recaudación</label>
                <input
                  type="number"
                  step="0.01"
                  value={state.montoMaximoRecaudacion}
                  onChange={(e) => setState((prev) => ({ ...prev, montoMaximoRecaudacion: e.target.value }))}
                  placeholder="Ej: 500000"
                  className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Monto Mínimo de Inversión</label>
                <input
                  type="number"
                  step="0.01"
                  value={state.montoMinimoInversion}
                  onChange={(e) => setState((prev) => ({ ...prev, montoMinimoInversion: e.target.value }))}
                  placeholder="Ej: 100"
                  className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Monto Máximo de Inversión</label>
                <input
                  type="number"
                  step="0.01"
                  value={state.montoMaximoInversion}
                  onChange={(e) => setState((prev) => ({ ...prev, montoMaximoInversion: e.target.value }))}
                  placeholder="Ej: 50000"
                  className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-semibold">Resumen de la oferta:</p>
              <div className="text-xs text-blue-600 mt-2 space-y-1">
                <p>• Activo: {state.nombreActivo} ({state.simboloActivo})</p>
                <p>• Tipo: {state.tipoSTO}</p>
                <p>• Tokens: {state.numerosTokensVenta}</p>
                <p>• Precio: ${state.precioPorToken} USDC</p>
                <p>• Rendimiento Anual: {state.porcentajeRendimiento}%</p>
                <p>• Meta: ${state.montoMinimoRecaudacion} - ${state.montoMaximoRecaudacion}</p>
                <p>• Inversión: ${state.montoMinimoInversion} - ${state.montoMaximoInversion}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={handlePrevious}
          disabled={state.step === 1}
          className="flex items-center gap-2 px-4 py-2 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <button
          onClick={() => setActiveSection("sto")}
          className="px-4 py-2 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors font-semibold text-sm"
        >
          Cancelar
        </button>

        {state.step < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {editingSTO ? "Actualizar Oferta" : "Crear Oferta"}
          </button>
        )}
      </div>
    </div>
  );
}
