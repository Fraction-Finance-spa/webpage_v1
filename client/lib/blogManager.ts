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
  {
    id: "3",
    titulo: '"Fraction" seleccionada para ALGEN‑18',
    contenido: 'Fraction Finance ha sido seleccionada para participar en el programa ALGEN-18, un reconocimiento significativo en el ecosistema de finanzas digitales. Esta selección refleja nuestro compromiso con la innovación y la excelencia en el desarrollo de soluciones de financiamiento alternativo.',
    resumen: '"Fraction" seleccionada para participar en el programa ALGEN-18',
    estado: "Publicado",
    fechaCreacion: "2025-10-07T00:00:00Z",
    fechaActualizacion: "2025-10-07T00:00:00Z",
    fechaPublicacion: "2025-10-07T00:00:00Z",
    categoria: "Programas",
  },
  {
    id: "4",
    titulo: "SWIFT construye plataforma de pagos en Ethereum con más de 30 bancos",
    contenido: "La Society for Worldwide Interbank Financial Telecommunication (SWIFT), ha anunciado el desarrollo de una plataforma de pagos basada en Ethereum que integra a más de 30 bancos globales. Este es un hito importante en la adopción de tecnología blockchain por instituciones financieras tradicionales.",
    resumen: "SWIFT desarrolla plataforma de pagos interbancaria en Ethereum",
    estado: "Publicado",
    fechaCreacion: "2025-10-03T00:00:00Z",
    fechaActualizacion: "2025-10-03T00:00:00Z",
    fechaPublicacion: "2025-10-03T00:00:00Z",
    categoria: "Blockchain",
  },
  {
    id: "5",
    titulo: "La Fed Reduce la Tasa de Interés y Bitcoin Reacciona al Alza",
    contenido: "La Reserva Federal de Estados Unidos anunció una reducción en las tasas de interés, lo que provocó una reacción positiva inmediata en los mercados de criptoactivos. Bitcoin experimentó una suba significativa, reflejando la correlación entre políticas monetarias tradicionales y activos digitales.",
    resumen: "La Fed reduce tasas de interés y Bitcoin sube como reacción",
    estado: "Publicado",
    fechaCreacion: "2025-09-16T00:00:00Z",
    fechaActualizacion: "2025-09-16T00:00:00Z",
    fechaPublicacion: "2025-09-16T00:00:00Z",
    categoria: "Política monetaria",
  },
  {
    id: "6",
    titulo: "Nasdaq abre la puerta a la tokenización de acciones en Wall Street",
    contenido: "La bolsa de valores Nasdaq ha anunciado su iniciativa para permitir la tokenización de acciones, un paso revolucionario que podría transformar completamente la forma en que se negocian los valores en Wall Street. Esta decisión marca el inicio de una era donde los mercados tradicionales abrazan la tecnología blockchain.",
    resumen: "Nasdaq autoriza la tokenización de acciones en su plataforma",
    estado: "Publicado",
    fechaCreacion: "2025-09-08T00:00:00Z",
    fechaActualizacion: "2025-09-08T00:00:00Z",
    fechaPublicacion: "2025-09-08T00:00:00Z",
    categoria: "Acciones",
  },
  {
    id: "7",
    titulo: "EE.UU. aprueba histórica ley sobre stablecoins y se perfila como líder mundial en criptoactivos",
    contenido: "El Congreso de los Estados Unidos ha aprobado una ley histórica que regula los stablecoins, consolidando al país como líder mundial en la regulación de criptoactivos. Esta legislación proporciona un marco claro para empresas que emiten stablecoins, fomentando la innovación mientras protege a los consumidores.",
    resumen: "EE.UU. aprueba marco regulatorio para stablecoins",
    estado: "Publicado",
    fechaCreacion: "2025-07-17T00:00:00Z",
    fechaActualizacion: "2025-07-17T00:00:00Z",
    fechaPublicacion: "2025-07-17T00:00:00Z",
    categoria: "Stablecoin",
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
