import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getPublishedArticles, type BlogArticle } from "@/lib/blogManager";

export default function Blog() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  useEffect(() => {
    setArticles(getPublishedArticles());
  }, []);

  const categories = [
    "Todos",
    ...Array.from(new Set(articles.map((a) => a.categoria).filter((c) => c))),
  ];

  const filteredArticles =
    selectedCategory === "Todos"
      ? articles
      : articles.filter((a) => a.categoria === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2Fc2c24d2c61be44c58d8307f0bb9149f7)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: "500px",
          padding: "100px 32px 80px 32px",
        }}
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary/15 to-transparent rounded-full filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight mb-6">
            <span style={{ color: "rgba(255, 255, 255, 1)", textShadow: "1px 1px 3px rgba(0, 0, 0, 1)" }}>
              Blog
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 max-w-3xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.95)", textShadow: "1px 1px 3px rgba(0, 0, 0, 1)" }}>
            Artículos y análisis sobre finanzas digitales e inversión
          </p>
        </div>
      </section>

      {/* Blog Articles Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container max-w-6xl mx-auto">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg"
                      : "bg-secondary/30 border border-border/40 text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {article.imagen && (
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                      <img
                        src={article.imagen}
                        alt={article.titulo}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {article.categoria && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3 w-fit">
                        {article.categoria}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                      {article.titulo}
                    </h3>

                    {article.resumen && (
                      <p className="text-foreground/70 mb-4 line-clamp-2">
                        {article.resumen}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4 mt-auto">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.autor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(article.fechaCreacion).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/nosotros/blog/${article.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70 mb-4">
                No hay artículos disponibles en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
