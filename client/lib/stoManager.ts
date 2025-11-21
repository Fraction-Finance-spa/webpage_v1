export interface STO {
  id: string;
  activoDigitalId: string;
  nombreActivo: string;
  simboloActivo: string;
  estado: "Activo" | "Inactivo" | "Cerrado" | "Pendiente";
  tipoSTO: "Equity" | "Debt" | "Hybrid" | "Utility";
  numerosTokensVenta: string;
  precioPorToken: string;
  fechaInicio: string;
  fechaFin: string;
  montoMinimoRecaudacion: string;
  montoMaximoRecaudacion: string;
  montoMinimoInversion: string;
  montoMaximoInversion: string;
  descripcion?: string;
  porcentajeRendimiento?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  montoRecaudadoActual?: string;
  inversionistas?: number;
}

const STORAGE_KEY = "stos";

export function getSTOs(): STO[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading STOs:", error);
  }
  return [];
}

export function saveSTOs(stos: STO[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stos));
  } catch (error) {
    console.error("Error saving STOs:", error);
  }
}

export function addSTO(sto: Omit<STO, "id" | "fechaCreacion" | "fechaActualizacion">): STO {
  const stos = getSTOs();
  
  // Validate no duplicate offering for the same digital asset
  const existingSTO = stos.find((s) => s.activoDigitalId === sto.activoDigitalId && s.estado !== "Cerrado");
  if (existingSTO) {
    throw new Error(`Ya existe una oferta activa para el activo ${sto.nombreActivo}`);
  }

  const newSTO: STO = {
    ...sto,
    id: Date.now().toString(),
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    montoRecaudadoActual: "0",
    inversionistas: 0,
  };
  stos.push(newSTO);
  saveSTOs(stos);
  return newSTO;
}

export function updateSTO(id: string, updates: Partial<STO>): STO | null {
  const stos = getSTOs();
  const index = stos.findIndex((s) => s.id === id);
  if (index !== -1) {
    stos[index] = {
      ...stos[index],
      ...updates,
      fechaActualizacion: new Date().toISOString(),
    };
    saveSTOs(stos);
    return stos[index];
  }
  return null;
}

export function deleteSTO(id: string): boolean {
  const stos = getSTOs();
  const filtered = stos.filter((s) => s.id !== id);
  if (filtered.length < stos.length) {
    saveSTOs(filtered);
    return true;
  }
  return false;
}

export function getSTOById(id: string): STO | null {
  const stos = getSTOs();
  return stos.find((s) => s.id === id) || null;
}

export function getActiveSTOs(): STO[] {
  return getSTOs().filter((sto) => sto.estado === "Activo" || sto.estado === "Pendiente");
}

export function checkSTOAvailableForAsset(activoDigitalId: string): boolean {
  const stos = getSTOs();
  const existingSTO = stos.find((s) => s.activoDigitalId === activoDigitalId && s.estado !== "Cerrado");
  return !existingSTO;
}
