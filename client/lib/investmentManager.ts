export interface UserInvestment {
  id: string;
  stoId: string;
  stoNombre: string;
  tipo: string;
  montoInvertido: number;
  tasaEsperada: number;
  plazo: string;
  estado: "Activo" | "Completado" | "Cancelado";
  progreso: number;
  fechaInversion: string;
  fechaVencimiento: string;
  rentabilidadActual: number;
}

const STORAGE_KEY = "userInvestments";

export function getUserInvestments(userEmail: string): UserInvestment[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userEmail}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading investments:", error);
  }
  return [];
}

export function saveUserInvestments(userEmail: string, investments: UserInvestment[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userEmail}`, JSON.stringify(investments));
  } catch (error) {
    console.error("Error saving investments:", error);
  }
}

export function addInvestment(userEmail: string, investment: Omit<UserInvestment, "id">): UserInvestment {
  const investments = getUserInvestments(userEmail);
  
  const newInvestment: UserInvestment = {
    ...investment,
    id: Date.now().toString(),
  };
  
  investments.push(newInvestment);
  saveUserInvestments(userEmail, investments);
  return newInvestment;
}

export function updateInvestment(userEmail: string, id: string, updates: Partial<UserInvestment>): UserInvestment | null {
  const investments = getUserInvestments(userEmail);
  const index = investments.findIndex((inv) => inv.id === id);
  
  if (index !== -1) {
    investments[index] = {
      ...investments[index],
      ...updates,
    };
    saveUserInvestments(userEmail, investments);
    return investments[index];
  }
  return null;
}

export function deleteInvestment(userEmail: string, id: string): boolean {
  const investments = getUserInvestments(userEmail);
  const filtered = investments.filter((inv) => inv.id !== id);
  
  if (filtered.length < investments.length) {
    saveUserInvestments(userEmail, filtered);
    return true;
  }
  return false;
}

export function getActiveInvestments(userEmail: string): UserInvestment[] {
  return getUserInvestments(userEmail).filter((inv) => inv.estado === "Activo");
}

export function getTotalInvestedAmount(userEmail: string): number {
  return getUserInvestments(userEmail).reduce((sum, inv) => sum + inv.montoInvertido, 0);
}

export function getAverageYield(userEmail: string): number {
  const investments = getUserInvestments(userEmail);
  if (investments.length === 0) return 0;
  return investments.reduce((sum, inv) => sum + inv.rentabilidadActual, 0) / investments.length;
}
