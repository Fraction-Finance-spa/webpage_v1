import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { articlesQueries } from "@/lib/supabase-queries";
import type { Article } from "@/lib/types/database";

interface ArticlesListProps {
  limit?: number;
  category?: string;
}

export default function ArticlesList({ limit = 6, category }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesQueries.getAll();
        const filtered = category ? data.filter((a) => a.category === category) : data;
        setArticles(filtered.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit, category]);

  if (loading) {
    return <div className="text-center py-12">Cargando artículos...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div className="text-center py-12">No hay artículos disponibles</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow">
          {article.featured_image_url && (
            <div className="w-full h-48 bg-gray-200 overflow-hidden rounded-t-lg">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
            <CardDescription>
              {article.author && <span>Por {article.author}</span>}
              {article.published_at && (
                <span> • {new Date(article.published_at).toLocaleDateString()}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {article.excerpt && <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>}
            {article.category && (
              <div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {article.category}
                </span>
              </div>
            )}
            <Link to={`/nosotros/blog/${article.slug}`}>
              <Button variant="outline" className="w-full">
                Leer Más
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
