import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getArticles, type BlogArticle } from "@/lib/blogManager";
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from "lucide-react";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const articles = getArticles();
      const found = articles.find((a) => a.id === id);
      setArticle(found || null);
      setLoading(false);
    }
  }, [id]);

  const getArticleUrl = () => {
    return `${window.location.origin}/nosotros/blog/${id}`;
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar link:", err);
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = getArticleUrl();
    const text = article?.titulo || "Mira este artículo";
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-foreground/60">Cargando artículo...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/nosotros/blog")}
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Artículos y Noticias
            </button>
            <div className="bg-white rounded-lg border border-border/40 p-12 text-center">
              <p className="text-lg text-foreground/70 mb-4">
                Artículo no encontrado
              </p>
              <p className="text-foreground/50 mb-6">
                Lo sentimos, el artículo que buscas no existe.
              </p>
              <button
                onClick={() => navigate("/nosotros/blog")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Ir a Artículos y Noticias
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/nosotros/blog")}
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </button>

          {/* Article Container */}
          <article className="bg-white rounded-lg border border-border/40 overflow-hidden shadow-lg">
            {/* Featured Image */}
            {article.imagen ? (
              <div className="w-full h-96 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={article.imagen}
                  alt={article.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-primary/40">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border/40">
                {article.categoria && (
                  <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    {article.categoria}
                  </span>
                )}
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.fechaPublicacion || article.fechaCreacion}>
                    {new Date(article.fechaPublicacion || article.fechaCreacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {/* Copy Link Button */}
                  <button
                    onClick={copyLinkToClipboard}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
                    title="Copiar link"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-600 font-semibold">¡Copiado!</span>
                      </>
                    ) : (
                      <Link2 className="w-5 h-5 text-foreground/60 hover:text-primary" />
                    )}
                  </button>

                  {/* Share Menu Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Compartir"
                    >
                      <Share2 className="w-5 h-5 text-foreground/60 hover:text-primary" />
                    </button>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-border/40 rounded-lg shadow-lg z-10 p-2 min-w-max">
                        <button
                          onClick={() => shareOnSocial("facebook")}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded transition-colors text-sm font-semibold text-foreground w-full text-left"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </button>
                        <button
                          onClick={() => shareOnSocial("twitter")}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded transition-colors text-sm font-semibold text-foreground w-full text-left"
                        >
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </button>
                        <button
                          onClick={() => shareOnSocial("linkedin")}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded transition-colors text-sm font-semibold text-foreground w-full text-left"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </button>
                        <button
                          onClick={() => shareOnSocial("whatsapp")}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded transition-colors text-sm font-semibold text-foreground w-full text-left"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {article.titulo}
              </h1>

              {/* Summary/Excerpt */}
              {article.resumen && (
                <p className="text-xl text-foreground/70 mb-8 font-light italic">
                  {article.resumen}
                </p>
              )}

              {/* Article Content */}
              <div className="prose prose-sm max-w-none mb-12">
                <div
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.contenido }}
                />
              </div>

              {/* Article Footer */}
              <div className="pt-8 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-foreground/60">
                    <p>
                      Última actualización:{" "}
                      <time dateTime={article.fechaActualizacion}>
                        {new Date(article.fechaActualizacion).toLocaleDateString("es-ES")}
                      </time>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Más Artículos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getArticles()
                .filter((a) => a.id !== article.id && a.estado === "Publicado")
                .slice(0, 2)
                .map((relatedArticle) => (
                  <button
                    key={relatedArticle.id}
                    onClick={() => navigate(`/nosotros/blog/${relatedArticle.id}`)}
                    className="text-left group"
                  >
                    <div className="bg-white rounded-lg border border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      {relatedArticle.imagen ? (
                        <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                          <img
                            src={relatedArticle.imagen}
                            alt={relatedArticle.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <div className="text-primary/40">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        {relatedArticle.categoria && (
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
                            {relatedArticle.categoria}
                          </span>
                        )}
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {relatedArticle.titulo}
                        </h3>
                        <p className="text-xs text-foreground/60 mt-2">
                          {new Date(relatedArticle.fechaPublicacion || relatedArticle.fechaCreacion).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Back to Blog Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/nosotros/blog")}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Artículos y Noticias
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
