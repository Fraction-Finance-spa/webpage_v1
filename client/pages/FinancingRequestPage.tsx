import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { companiesQueries, instrumentsQueries, financingRequestsQueries } from "@/lib/supabase-queries";
import type { Company, FinancialInstrument } from "@/lib/types/database";

export default function FinancingRequestPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [instruments, setInstruments] = useState<FinancialInstrument[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [instrumentsLoading, setInstrumentsLoading] = useState(true);

  const [formData, setFormData] = useState({
    company_id: "",
    instrument_id: "",
    title: "",
    description: "",
    amount_requested: "",
    interest_rate: "",
    duration_months: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const companiesData = await companiesQueries.getAll();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setCompaniesLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const instrumentsData = await instrumentsQueries.getAll();
        setInstruments(instrumentsData);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      } finally {
        setInstrumentsLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.company_id ||
      !formData.instrument_id ||
      !formData.title ||
      !formData.amount_requested
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await financingRequestsQueries.create({
        company_id: formData.company_id,
        instrument_id: formData.instrument_id,
        title: formData.title,
        description: formData.description,
        amount_requested: parseFloat(formData.amount_requested),
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : undefined,
        duration_months: formData.duration_months
          ? parseInt(formData.duration_months)
          : undefined,
        status: "pending",
      });

      toast({
        title: "Éxito",
        description: "Tu solicitud de financiamiento ha sido creada correctamente",
      });

      setFormData({
        company_id: "",
        instrument_id: "",
        title: "",
        description: "",
        amount_requested: "",
        interest_rate: "",
        duration_months: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la solicitud",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Debe iniciar sesión</h1>
          <p className="text-gray-600">Para crear una solicitud de financiamiento debe estar registrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Nueva Solicitud de Financiamiento</CardTitle>
              <CardDescription>
                Completa el formulario para solicitar financiamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Empresa *</label>
                    <Select
                      value={formData.company_id}
                      onValueChange={(value) => handleSelectChange("company_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companiesLoading ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Instrumento Financiero *
                    </label>
                    <Select
                      value={formData.instrument_id}
                      onValueChange={(value) => handleSelectChange("instrument_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un instrumento" />
                      </SelectTrigger>
                      <SelectContent>
                        {instrumentsLoading ? (
                          <SelectItem value="loading" disabled>
                            Cargando...
                          </SelectItem>
                        ) : (
                          instruments.map((instrument) => (
                            <SelectItem key={instrument.id} value={instrument.id}>
                              {instrument.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Título de la Solicitud *</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Financiamiento para expansión"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Cuéntanos más sobre tu solicitud..."
                    className="min-h-40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Monto Solicitado *</label>
                    <Input
                      type="number"
                      name="amount_requested"
                      value={formData.amount_requested}
                      onChange={handleChange}
                      placeholder="100000"
                      step="1000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tasa de Interés (%)</label>
                    <Input
                      type="number"
                      name="interest_rate"
                      value={formData.interest_rate}
                      onChange={handleChange}
                      placeholder="5.5"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duración (meses)</label>
                    <Input
                      type="number"
                      name="duration_months"
                      value={formData.duration_months}
                      onChange={handleChange}
                      placeholder="12"
                      step="1"
                      min="1"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Creando solicitud..." : "Crear Solicitud"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
