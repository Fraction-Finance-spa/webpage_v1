export interface EvaluacionComercial {
  viabilidadFinanciera: "Excelente" | "Buena" | "Regular" | "Deficiente" | "";
  viabilidadTributaria: "Excelente" | "Buena" | "Regular" | "Deficiente" | "";
  viabilidadJudicial: "Excelente" | "Buena" | "Regular" | "Deficiente" | "";
  tendenciaMercado: "Creciente" | "Estable" | "Decreciente" | "";
  calidadEquipo: "Excepcional" | "Fuerte" | "Adecuada" | "Débil" | "";
  reputacionEmpresa: "Excelente" | "Buena" | "Regular" | "Deficiente" | "";
  observaciones: string;
  evaluador?: string;
  fechaEvaluacion?: string;
  scoring?: number;
  aprobado?: boolean;
}

export interface FinancingRequest {
  id: string;
  companyName: string;
  rutEmpresa: string;
  industry: string;
  foundedYear: string;
  employeeCount: string;
  monthlyRevenue: string;
  financingAmount: string;
  financingPurpose: string;
  businessStage: string;
  financingType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "Pendiente" | "Aprobado" | "Rechazado";
  createdAt: string;
  notes: string;
  evaluacionComercial?: EvaluacionComercial;
}

const STORAGE_KEY = "financing_requests";

export function getFinancingRequests(): FinancingRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading financing requests:", error);
  }
  return [];
}

export function saveFinancingRequests(requests: FinancingRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving financing requests:", error);
  }
}

export function addFinancingRequest(
  request: Omit<FinancingRequest, "id" | "createdAt" | "status" | "notes">
): FinancingRequest {
  const requests = getFinancingRequests();
  const newRequest: FinancingRequest = {
    ...request,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "Pendiente",
    notes: "",
  };
  requests.push(newRequest);
  saveFinancingRequests(requests);
  return newRequest;
}

export function updateFinancingRequest(
  id: string,
  updates: Partial<FinancingRequest>
): FinancingRequest | null {
  const requests = getFinancingRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index !== -1) {
    requests[index] = {
      ...requests[index],
      ...updates,
    };
    saveFinancingRequests(requests);
    return requests[index];
  }
  return null;
}

export function deleteFinancingRequest(id: string): boolean {
  const requests = getFinancingRequests();
  const filtered = requests.filter((r) => r.id !== id);
  if (filtered.length < requests.length) {
    saveFinancingRequests(filtered);
    return true;
  }
  return false;
}

export function getFinancingRequestById(id: string): FinancingRequest | null {
  const requests = getFinancingRequests();
  return requests.find((r) => r.id === id) || null;
}

export function updateRequestStatus(
  id: string,
  status: "Pendiente" | "Aprobado" | "Rechazado",
  notes: string = ""
): FinancingRequest | null {
  return updateFinancingRequest(id, { status, notes });
}

export function getPendingRequests(): FinancingRequest[] {
  return getFinancingRequests().filter((r) => r.status === "Pendiente");
}

export function getApprovedRequests(): FinancingRequest[] {
  return getFinancingRequests().filter((r) => r.status === "Aprobado");
}

export function getRejectedRequests(): FinancingRequest[] {
  return getFinancingRequests().filter((r) => r.status === "Rechazado");
}

export function calculateScoring(evaluacion: EvaluacionComercial): { scoring: number; aprobado: boolean; financingTier: string } {
  const puntajesDirectos: Record<string, number> = {
    // 25%, 50%, 75%, 100% scale
    "Deficiente": 25,
    "Débil": 25,
    "Decreciente": 25,
    "Regular": 50,
    "Adecuada": 50,
    "Estable": 50,
    "Buena": 75,
    "Fuerte": 75,
    "Creciente": 100,
    "Excelente": 100,
    "Excepcional": 100,
  };

  const criterios = [
    evaluacion.viabilidadFinanciera,
    evaluacion.viabilidadTributaria,
    evaluacion.viabilidadJudicial,
    evaluacion.tendenciaMercado,
    evaluacion.calidadEquipo,
    evaluacion.reputacionEmpresa,
  ];

  const valoresFiltrados = criterios.filter((c) => c !== "");
  if (valoresFiltrados.length === 0) {
    return { scoring: 0, aprobado: false, financingTier: "N/A" };
  }

  const sumaScores = valoresFiltrados.reduce((sum, criterio) => {
    return sum + (puntajesDirectos[criterio] || 0);
  }, 0);

  const scoring = Math.round((sumaScores / valoresFiltrados.length) * 100) / 100;
  const aprobado = scoring >= 60;

  let financingTier = "N/A";
  if (scoring >= 80) {
    financingTier = "100%"; // Full financing
  } else if (scoring >= 60) {
    financingTier = "70%"; // Reduced financing
  }

  return { scoring, aprobado, financingTier };
}

export function updateEvaluacionComercial(
  id: string,
  evaluacion: EvaluacionComercial
): FinancingRequest | null {
  const { scoring, aprobado } = calculateScoring(evaluacion);

  return updateFinancingRequest(id, {
    evaluacionComercial: {
      ...evaluacion,
      evaluador: localStorage.getItem("userName") || "Admin",
      fechaEvaluacion: new Date().toISOString(),
      scoring,
      aprobado,
    },
  });
}

export function getSTODataFromFinancingRequest(request: FinancingRequest): { success: boolean; message: string; data?: any; financingTier?: string } {
  if (!request.evaluacionComercial || request.evaluacionComercial.scoring === undefined) {
    return { success: false, message: "La solicitud no tiene evaluación comercial completada" };
  }

  const { scoring, financingTier } = calculateScoring(request.evaluacionComercial);

  if (scoring < 60) {
    return { success: false, message: "La evaluación no cumple el puntaje mínimo para tokenizar (60%)" };
  }

  // Calculate amounts based on financing tier
  const requestedAmount = parseFloat(request.financingAmount);
  const financingPercentage = financingTier === "100%" ? 1.0 : 0.7;
  const approvedAmount = Math.floor(requestedAmount * financingPercentage);

  const stoData = {
    activoDigitalId: `debt-${request.id}`,
    nombreActivo: `${request.companyName} - ${request.financingPurpose}`,
    simboloActivo: request.companyName.substring(0, 4).toUpperCase(),
    estado: "Activo" as const,
    tipoSTO: "Debt" as const,
    numerosTokensVenta: Math.floor(approvedAmount / 1000).toString(),
    precioPorToken: "1000",
    fechaInicio: new Date().toISOString(),
    fechaFin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    montoMinimoRecaudacion: (approvedAmount * 0.8).toString(),
    montoMaximoRecaudacion: approvedAmount.toString(),
    montoMinimoInversion: "1000",
    montoMaximoInversion: approvedAmount.toString(),
    descripcion: `Financiamiento para ${request.companyName}. ${request.financingPurpose}`,
    porcentajeRendimiento: "8",
  };

  return { success: true, message: "Datos de STO generados", data: stoData, financingTier };
}
