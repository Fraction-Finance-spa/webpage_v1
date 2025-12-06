export interface Socio {
  id: string;
  nombre: string;
  logo: string;
  descripcion: string;
  enlace: string;
  createdAt: string;
}

const STORAGE_KEY = "fraction_socios";

export function getSocios(): Socio[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading socios:", error);
    return [];
  }
}

export function saveSocios(socios: Socio[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
  } catch (error) {
    console.error("Error saving socios:", error);
  }
}

export function addSocio(socio: Omit<Socio, "id" | "createdAt">): Socio {
  const socios = getSocios();
  const newSocio: Socio = {
    ...socio,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  socios.push(newSocio);
  saveSocios(socios);
  return newSocio;
}

export function updateSocio(id: string, updates: Partial<Omit<Socio, "id" | "createdAt">>): Socio | null {
  const socios = getSocios();
  const index = socios.findIndex((s) => s.id === id);
  if (index !== -1) {
    socios[index] = { ...socios[index], ...updates };
    saveSocios(socios);
    return socios[index];
  }
  return null;
}

export function deleteSocio(id: string): boolean {
  const socios = getSocios();
  const filtered = socios.filter((s) => s.id !== id);
  if (filtered.length < socios.length) {
    saveSocios(filtered);
    return true;
  }
  return false;
}

export function getSocioById(id: string): Socio | null {
  const socios = getSocios();
  return socios.find((s) => s.id === id) || null;
}
