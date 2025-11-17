import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md">
          <div className="inline-block mb-6 p-4 bg-destructive/10 rounded-2xl">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>

          <h1 className="text-6xl font-bold mb-2">404</h1>
          <p className="text-2xl font-bold mb-4">Página no encontrada</p>

          <p className="text-foreground/60 text-lg mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
