import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Calendar, ArrowRight } from "lucide-react";
import { articlesQueries } from "@/lib/supabase-queries";
import type { Article } from "@/lib/types/database";

export default function BlogWithSupabase() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesQueries.getAll();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const categories = [
    "Todos",
    ...Array.from(
      new Set(articles.map((a) => a.category).filter((c) => c))
    ) as string[],
  ];

  const filteredArticles = (
    selectedCategory === "Todos"
      ? articles
      : articles.filter((a) => a.category === selectedCategory)
  ).sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });

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

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/70">Cargando artículos...</p>
            </div>
          )}

          {/* Category Filter */}
          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
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
          {!loading && filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {article.featured_image_url ? (
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-primary/40">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
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
                          {new Date(article.published_at || article.created_at).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                      {article.views_count > 0 && (
                        <div className="flex items-center gap-1">
                          <span>👁️ {article.views_count}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`/nosotros/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold text-sm"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-16">
                <p className="text-lg text-foreground/70 mb-4">
                  No hay artículos disponibles en esta categoría.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}
