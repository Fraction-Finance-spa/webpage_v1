export interface EducacionCard {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  instructor: string;
  duracion?: string;
  nivel?: "Básico" | "Intermedio" | "Avanzado";
  imagen?: string;
  imagenFileName?: string;
  estado: "Publicado" | "Borrador";
  fechaCreacion: string;
  fechaActualizacion: string;
}

const STORAGE_KEY = "educacion_cards";

const defaultCards: EducacionCard[] = [
  {
    id: "1",
    titulo: "Introducción a Blockchain",
    descripcion: "Aprende los fundamentos de la tecnología blockchain y cómo está revolucionando las finanzas.",
    contenido: "En este curso introductorio, cubriremos los conceptos básicos de blockchain, cómo funciona la tecnología, y sus aplicaciones en el mundo financiero.",
    instructor: "Carlos González",
    duracion: "4 semanas",
    nivel: "Básico",
    estado: "Publicado",
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "DeFi Avanzado",
    descripcion: "Profundiza en las finanzas descentralizadas y estrategias de inversión avanzadas.",
    contenido: "Este curso avanzado explora las complejidades de DeFi, incluyendo contratos inteligentes, liquidez y estrategias de yield farming.",
    instructor: "María López",
    duracion: "6 semanas",
    nivel: "Avanzado",
    estado: "Publicado",
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  },
];

export function getEducacionCards(): EducacionCard[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading education cards:", error);
  }
  return defaultCards;
}

export function saveEducacionCards(cards: EducacionCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error("Error saving education cards:", error);
  }
}

export function addEducacionCard(card: Omit<EducacionCard, "id" | "fechaCreacion" | "fechaActualizacion">): EducacionCard {
  const cards = getEducacionCards();
  const newCard: EducacionCard = {
    ...card,
    id: Date.now().toString(),
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };
  cards.push(newCard);
  saveEducacionCards(cards);
  return newCard;
}

export function updateEducacionCard(id: string, updates: Partial<EducacionCard>): EducacionCard | null {
  const cards = getEducacionCards();
  const index = cards.findIndex((c) => c.id === id);
  if (index !== -1) {
    cards[index] = {
      ...cards[index],
      ...updates,
      fechaActualizacion: new Date().toISOString(),
    };
    saveEducacionCards(cards);
    return cards[index];
  }
  return null;
}

export function deleteEducacionCard(id: string): boolean {
  const cards = getEducacionCards();
  const filtered = cards.filter((c) => c.id !== id);
  if (filtered.length < cards.length) {
    saveEducacionCards(filtered);
    return true;
  }
  return false;
}

export function getPublishedCards(): EducacionCard[] {
  return getEducacionCards().filter((card) => card.estado === "Publicado");
}
