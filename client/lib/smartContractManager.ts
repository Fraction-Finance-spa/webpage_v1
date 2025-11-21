export interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  fechaCarga: string;
}

export interface SmartContract {
  id: string;
  nombre: string;
  simbolo: string;
  direccion: string;
  blockchain: string;
  assetClass: string;
  suministroMaximo: string;
  administrador: string;
  fechaCreacion: string;
  estado: "Activo" | "Inactivo" | "Pausado";
  codigoContrato: string;
  documentos?: Documento[];
}

const STORAGE_KEY = "smart_contracts";

export function getSmartContracts(): SmartContract[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading smart contracts:", error);
  }
  return [];
}

export function saveSmartContracts(contracts: SmartContract[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch (error) {
    console.error("Error saving smart contracts:", error);
  }
}

export function addSmartContract(contract: Omit<SmartContract, "id" | "fechaCreacion">): SmartContract {
  const contracts = getSmartContracts();
  const newContract: SmartContract = {
    ...contract,
    id: Date.now().toString(),
    fechaCreacion: new Date().toISOString(),
  };
  contracts.push(newContract);
  saveSmartContracts(contracts);
  return newContract;
}

export function updateSmartContract(id: string, updates: Partial<SmartContract>): SmartContract | null {
  const contracts = getSmartContracts();
  const index = contracts.findIndex((c) => c.id === id);
  if (index !== -1) {
    contracts[index] = {
      ...contracts[index],
      ...updates,
    };
    saveSmartContracts(contracts);
    return contracts[index];
  }
  return null;
}

export function deleteSmartContract(id: string): boolean {
  const contracts = getSmartContracts();
  const filtered = contracts.filter((c) => c.id !== id);
  if (filtered.length < contracts.length) {
    saveSmartContracts(filtered);
    return true;
  }
  return false;
}

export function getSmartContractById(id: string): SmartContract | null {
  const contracts = getSmartContracts();
  return contracts.find((c) => c.id === id) || null;
}
