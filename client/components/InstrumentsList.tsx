import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { instrumentsQueries } from "@/lib/supabase-queries";
import type { FinancialInstrument } from "@/lib/types/database";

interface InstrumentsListProps {
  limit?: number;
  type?: string;
}

export default function InstrumentsList({ limit = 6, type }: InstrumentsListProps) {
  const [instruments, setInstruments] = useState<FinancialInstrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        setLoading(true);
        const data = await instrumentsQueries.getAll();
        const filtered = type ? data.filter((i) => i.type === type) : data;
        setInstruments(filtered.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching instruments");
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [limit, type]);

  if (loading) {
    return <div className="text-center py-12">Cargando instrumentos...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  if (instruments.length === 0) {
    return <div className="text-center py-12">No hay instrumentos disponibles</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {instruments.map((instrument) => (
        <Card key={instrument.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="line-clamp-2">{instrument.name}</CardTitle>
            {instrument.category && (
              <CardDescription>{instrument.category}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {instrument.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{instrument.description}</p>
            )}

            <div className="space-y-2 text-sm">
              {instrument.type && (
                <div>
                  <span className="font-medium">Tipo:</span> {instrument.type}
                </div>
              )}

              {instrument.min_investment && (
                <div>
                  <span className="font-medium">Inversión Mínima:</span> ${instrument.min_investment.toLocaleString()}
                </div>
              )}

              {instrument.expected_return_percentage && (
                <div>
                  <span className="font-medium">Retorno Esperado:</span>{" "}
                  {instrument.expected_return_percentage}%
                </div>
              )}

              {instrument.duration_months && (
                <div>
                  <span className="font-medium">Duración:</span> {instrument.duration_months} meses
                </div>
              )}

              {instrument.risk_level && (
                <div>
                  <span className="font-medium">Riesgo:</span>
                  <Badge
                    variant="outline"
                    className="ml-2"
                  >
                    {instrument.risk_level}
                  </Badge>
                </div>
              )}
            </div>

            <Link to="/productos/inversiones">
              <Button className="w-full" variant="default">
                Invertir Ahora
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
