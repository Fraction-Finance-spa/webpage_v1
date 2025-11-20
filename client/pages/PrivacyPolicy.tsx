import Layout from "@/components/Layout";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const content =
    localStorage.getItem("politica_privacidad") ||
    `
    <h2>Política de Privacidad</h2>
    <p>En Fraction Finance, nos comprometemos a proteger tu privacidad y garantizar que tengas una experiencia positiva en nuestro sitio web.</p>
    
    <h3>1. Información que Recopilamos</h3>
    <p>Recopilamos información que nos proporcionas voluntariamente, como tu nombre, correo electrónico y información de contacto cuando completas formularios o te registras en nuestro sitio.</p>
    
    <h3>2. Cómo Usamos tu Información</h3>
    <p>Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones y comunicarnos contigo.</p>
    
    <h3>3. Protección de Datos</h3>
    <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado.</p>
    
    <h3>4. Derechos del Usuario</h3>
    <p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento contactándonos directamente.</p>
    
    <h3>5. Cambios a esta Política</h3>
    <p>Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación.</p>
  `;

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12" style={{ paddingTop: "50px" }}>
            <div className="inline-block mb-4 p-3 bg-blue-100 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-foreground/70 max-w-lg mx-auto leading-relaxed">
              Última actualización: {new Date().toLocaleDateString('es-CL')}
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
