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

export function calculateScoring(evaluacion: EvaluacionComercial): { scoring: number; aprobado: boolean } {
  const scores: Record<string, number> = {
    // Viabilidad Financiera
    "Excelente": 100,
    "Buena": 85,
    "Regular": 65,
    "Deficiente": 30,
    // Viabilidad Tributaria
    // Viabilidad Judicial
    // Calidad del Equipo
    "Excepcional": 100,
    "Fuerte": 85,
    "Adecuada": 70,
    "Débil": 40,
    // Reputación de Empresa
    // Tendencia de Mercado
    "Creciente": 100,
    "Estable": 85,
    "Decreciente": 50,
  };

  const criterios = [
    evaluacion.viabilidadFinanciera,
    evaluacion.viabilidadTributaria,
    evaluacion.viabilidadJudicial,
    evaluacion.tendenciaMercado,
    evaluacion.calidadEquipo,
    evaluacion.reputacionEmpresa,
  ];

  const puntajesDirectos: Record<string, number> = {
    "Excelente": 100,
    "Buena": 85,
    "Regular": 65,
    "Deficiente": 30,
    "Excepcional": 100,
    "Fuerte": 85,
    "Adecuada": 70,
    "Débil": 40,
    "Creciente": 100,
    "Estable": 85,
    "Decreciente": 50,
  };

  const valoresFiltrados = criterios.filter((c) => c !== "");
  if (valoresFiltrados.length === 0) {
    return { scoring: 0, aprobado: false };
  }

  const sumaScores = valoresFiltrados.reduce((sum, criterio) => {
    return sum + (puntajesDirectos[criterio] || 0);
  }, 0);

  const scoring = Math.round((sumaScores / valoresFiltrados.length) * 100) / 100;
  const aprobado = scoring >= 80;

  return { scoring, aprobado };
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
