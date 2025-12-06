import Layout from "@/components/Layout";
import { Cookie } from "lucide-react";
import { useState, useEffect } from "react";
import { policiesQueries } from "@/lib/supabase-queries";
import type { Policy } from "@/lib/types/database";

export default function CookiePolicy() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const data = await policiesQueries.getBySlug("politica-cookies");
        setPolicy(data);
      } catch (error) {
        console.error("Error fetching cookie policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const defaultContent = `
    <h2>Política de Cookies</h2>
    <p>Fraction Finance utiliza cookies para mejorar tu experiencia en nuestro sitio web. Esta política explica cómo usamos cookies y tecnologías similares.</p>

    <h3>1. ¿Qué Son las Cookies?</h3>
    <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia de usuario.</p>

    <h3>2. Tipos de Cookies que Usamos</h3>
    <h4>Cookies Esenciales</h4>
    <p>Son necesarias para el funcionamiento básico de nuestro sitio web, como autenticación y seguridad.</p>

    <h4>Cookies de Rendimiento</h4>
    <p>Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio para mejorar la experiencia.</p>

    <h4>Cookies de Marketing</h4>
    <p>Se utilizan para rastrear la efectividad de campañas de marketing y publicidad personalizada.</p>

    <h3>3. Control de Cookies</h3>
    <p>Puedes controlar y eliminar cookies a través de la configuración de tu navegador. Sin embargo, esto puede afectar la funcionalidad de nuestro sitio.</p>

    <h3>4. Cambios a esta Política</h3>
    <p>Podemos actualizar esta Política de Cookies en cualquier momento. Te recomendamos revisar esta página regularmente.</p>
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
              <Cookie className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Política de Cookies
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
