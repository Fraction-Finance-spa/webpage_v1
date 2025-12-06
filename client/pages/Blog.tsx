import { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "@/components/Layout";
import { Calendar, ArrowRight } from "lucide-react";
import { articlesQueries } from "@/lib/supabase-queries";
import type { Article } from "@/lib/types/database";
import { getPublishedArticles, type BlogArticle } from "@/lib/blogManager";

const ARTICLES_PER_PAGE = 6;

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articlesQueries.getAll();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles from Supabase:", error);
        // Fallback to local articles
        const localArticles = getPublishedArticles();
        setArticles(
          localArticles.map((a) => ({
            id: a.id,
            title: a.titulo,
            slug: a.id,
            content: a.contenido,
            excerpt: a.resumen,
            author: undefined,
            featured_image_url: a.imagen,
            category: a.categoria,
            published: a.estado === "Publicado",
            views_count: 0,
            published_at: a.fechaPublicacion || a.fechaCreacion,
            created_at: a.fechaCreacion,
            updated_at: a.fechaActualizacion,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const categories = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set(articles.map((a) => a.category).filter((c) => c))),
    ],
    [articles]
  );

  const sortedAndFiltered = useMemo(
    () => (
      selectedCategory === "Todos"
        ? articles
        : articles.filter((a) => a.category === selectedCategory)
    ).sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    }),
    [articles, selectedCategory]
  );

  const paginatedArticles = useMemo(() => {
    const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
    return sortedAndFiltered.slice(startIdx, startIdx + ARTICLES_PER_PAGE);
  }, [sortedAndFiltered, currentPage]);

  const totalPages = Math.ceil(sortedAndFiltered.length / ARTICLES_PER_PAGE);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50 flex items-center justify-center" style={{ paddingTop: "80px" }}>
          <div className="text-center">
            <p className="text-foreground/70">Cargando artículos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-6xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl text-foreground mb-4">Nuestros Artículos y Noticias</h1>
            <p className="text-xl text-foreground/70">
              Artículos y análisis sobre finanzas digitales, inversión y activos tokenizados
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white border border-border/40 text-foreground hover:bg-secondary/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {sortedAndFiltered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {article.featured_image_url ? (
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-primary/40">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {article.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3 w-fit">
                        {article.category}
                      </span>
                    )}

                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-foreground/60 mb-4 mt-auto">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(article.published_at || article.created_at).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/nosotros/blog/${article.slug || article.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold text-sm"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-border/40 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 transition-colors font-semibold"
                  >
                    Anterior
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-primary text-white shadow-lg"
                            : "border border-border/40 text-foreground hover:bg-secondary/20"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-border/40 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/20 transition-colors font-semibold"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70 mb-4">
                No hay artículos disponibles en esta categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
