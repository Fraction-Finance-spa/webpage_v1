import Layout from "@/components/Layout";
import { TrendingUp } from "lucide-react";

export default function MercadoSecundario() {
  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-6xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl text-foreground mb-4">Mercado Secundario de Activos</h1>
            <p className="text-xl text-foreground/70">
              Compra y vende activos digitales en el mercado secundario
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-border/40 p-12 text-center">
              <div className="flex justify-center mb-6">
                <TrendingUp className="w-16 h-16 text-primary/50" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">En Desarrollo</h2>
              <p className="text-foreground/70 mb-6">
                El mercado secundario de activos digitales está en desarrollo. Pronto podrás comprar y vender activos en nuestra plataforma.
              </p>
              <p className="text-sm text-foreground/60">
                Por favor, vuelve más tarde para acceder a esta funcionalidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
