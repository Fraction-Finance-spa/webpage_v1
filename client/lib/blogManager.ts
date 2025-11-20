export interface BlogArticle {
  id: string;
  titulo: string;
  contenido: string;
  imagen?: string;
  imagenFileName?: string;
  resumen?: string;
  estado: "Publicado" | "Borrador";
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaPublicacion?: string;
  categoria?: string;
}

const STORAGE_KEY = "blog_articles";

const defaultArticles: BlogArticle[] = [
  {
    id: "1",
    titulo: "Cómo invertir en STOs",
    contenido: "Los STOs (Security Token Offerings) representan una nueva forma de invertir en activos digitales. En este artículo explicamos cómo funcionan y cómo empezar a invertir.",
    resumen: "Guía completa sobre STOs y cómo comenzar a invertir en ellos.",
    estado: "Publicado",
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    fechaPublicacion: new Date().toISOString(),
    categoria: "Inversión",
  },
  {
    id: "2",
    titulo: "Guía de Activos Digitales",
    contenido: "Los activos digitales son la revolución del mercado financiero moderno. Aprende qué son, cómo funcionan y por qué deberías considerarlos en tu cartera de inversión.",
    resumen: "Todo lo que necesitas saber sobre activos digitales y su impacto en las finanzas.",
    estado: "Publicado",
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    fechaPublicacion: new Date().toISOString(),
    categoria: "Educación",
  },
];

export function getArticles(): BlogArticle[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading articles:", error);
  }
  return defaultArticles;
}

export function saveArticles(articles: BlogArticle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error("Error saving articles:", error);
  }
}

export function addArticle(article: Omit<BlogArticle, "id" | "fechaCreacion" | "fechaActualizacion">): BlogArticle {
  const articles = getArticles();
  const newArticle: BlogArticle = {
    ...article,
    id: Date.now().toString(),
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    fechaPublicacion: article.fechaPublicacion || new Date().toISOString(),
  };
  articles.push(newArticle);
  saveArticles(articles);
  return newArticle;
}

export function updateArticle(id: string, updates: Partial<BlogArticle>): BlogArticle | null {
  const articles = getArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    articles[index] = {
      ...articles[index],
      ...updates,
      fechaActualizacion: new Date().toISOString(),
    };
    saveArticles(articles);
    return articles[index];
  }
  return null;
}

export function deleteArticle(id: string): boolean {
  const articles = getArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length < articles.length) {
    saveArticles(filtered);
    return true;
  }
  return false;
}

export function getPublishedArticles(): BlogArticle[] {
  return getArticles().filter((article) => article.estado === "Publicado");
}
