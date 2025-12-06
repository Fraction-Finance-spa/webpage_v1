import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobsQueries } from "@/lib/supabase-queries";

interface JobsListProps {
  limit?: number;
  featured?: boolean;
}

export default function JobsList({ limit = 6, featured = false }: JobsListProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsQueries.getAll();
        setJobs(data.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  if (loading) {
    return <div className="text-center py-12">Cargando empleos...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  if (jobs.length === 0) {
    return <div className="text-center py-12">No hay empleos disponibles</div>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.companies?.name}</CardDescription>
              </div>
              {job.job_type && (
                <Badge variant="outline">{job.job_type}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {job.location && <p className="text-sm text-gray-600">📍 {job.location}</p>}
            
            {job.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
            )}

            <div className="flex justify-between items-center pt-4">
              {job.salary_min || job.salary_max ? (
                <div className="text-sm font-medium">
                  ${job.salary_min?.toLocaleString() || "0"} - $
                  {job.salary_max?.toLocaleString() || "0"}
                </div>
              ) : null}
              <Link to={`/nosotros/careers?job=${job.id}`}>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
