import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const pageTitles: Record<string, string> = {
    financiamiento: "Financiamiento",
    inversiones: "Inversiones",
    ecosistema: "Ecosistema",
    empresa: "Nuestra Empresa",
    modelo: "Modelo de Negocio",
    educacion: "Educación Financiera",
    blog: "Blog",
    careers: "Trabaja con Nosotros",
    contacto: "Contacto",
  };

  const lastSegment = pathSegments[pathSegments.length - 1];
  const pageTitle = pageTitles[lastSegment] || "Página";

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-md">
          <div className="inline-block mb-6 p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
            <FileQuestion className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            {pageTitle} (En construcción)
          </h1>

          <p className="text-xl text-foreground/70 mb-8">
            Esta página está siendo desarrollada. ¡Vuelve pronto para ver el contenido!
          </p>

          <div className="glass-morphism rounded-lg p-6 mb-8 text-left">
            <p className="text-foreground/60 text-sm">
              En Fraction Finance estamos constantemente mejorando nuestra plataforma para ofrecerte la mejor experiencia en financiamiento colaborativo.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </a>
        </div>
      </div>
    </Layout>
  );
}
