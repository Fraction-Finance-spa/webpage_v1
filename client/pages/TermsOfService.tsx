import Layout from "@/components/Layout";
import { FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { policiesQueries } from "@/lib/supabase-queries";
import type { Policy } from "@/lib/types/database";

export default function TermsOfService() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const data = await policiesQueries.getBySlug("terminos-servicio");
        setPolicy(data);
      } catch (error) {
        console.error("Error fetching terms of service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const defaultContent = `
    <h2>Términos de Servicio</h2>
    <p>Bienvenido a Fraction Finance. Estos Términos de Servicio rigen tu acceso y uso de nuestro sitio web y servicios.</p>

    <h3>1. Aceptación de Términos</h3>
    <p>Al acceder y usar Fraction Finance, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguno de los términos, por favor no uses nuestros servicios.</p>

    <h3>2. Licencia de Uso</h3>
    <p>Te otorgamos una licencia limitada, no exclusiva y revocable para acceder y usar nuestro sitio web para fines personales y no comerciales.</p>

    <h3>3. Conducta del Usuario</h3>
    <p>Te comprometes a no utilizar nuestro sitio de manera que:</p>
    <ul>
      <li>Viole cualquier ley o regulación aplicable</li>
      <li>Infrinja los derechos de terceros</li>
      <li>Contenga material ilegal o dañino</li>
      <li>Intente obtener acceso no autorizado a nuestros sistemas</li>
    </ul>

    <h3>4. Limitación de Responsabilidad</h3>
    <p>Fraction Finance no será responsable por daños indirectos, incidentales o consecuentes derivados de tu uso de nuestros servicios.</p>

    <h3>5. Cambios a los Términos</h3>
    <p>Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Tu uso continuado del sitio constituye aceptación de los cambios.</p>
  `;

  const content = policy?.content || defaultContent;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/70">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const lastUpdate = policy?.updated_at ? new Date(policy.updated_at).toLocaleDateString('es-CL') : new Date().toLocaleDateString('es-CL');

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12" style={{ paddingTop: "50px" }}>
            <div className="inline-block mb-4 p-3 bg-blue-100 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Términos de Servicio
            </h1>
            <p className="text-lg text-foreground/70 max-w-lg mx-auto leading-relaxed">
              Última actualización: {lastUpdate}
            </p>
          </div>

          {/* Content Card */}
          <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 md:p-12">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
