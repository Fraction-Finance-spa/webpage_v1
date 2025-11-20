import { useState } from "react";
import Layout from "@/components/Layout";
import { Shield, Send, CheckCircle } from "lucide-react";

export default function DenunciasChannel() {
  const [formData, setFormData] = useState({
    anonimo: true,
    nombre: "",
    email: "",
    detalles: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save to localStorage
    const denuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
    denuncias.push({
      id: Date.now().toString(),
      ...formData,
      fecha: new Date().toISOString(),
      estado: "Nuevo",
    });
    localStorage.setItem("denuncias", JSON.stringify(denuncias));

    setLoading(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ anonimo: true, nombre: "", email: "", detalles: "" });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-blue-50">
          <div className="max-w-md text-center">
            <div className="inline-block mb-6 p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              ¡Denuncia Recibida!
            </h1>
            <p className="text-lg text-foreground/70 mb-4">
              Gracias por reportar esta conducta. Trataremos tu denuncia de forma confidencial.
            </p>
            <p className="text-foreground/60">
              Tu denuncia ha sido registrada y será revisada por nuestro equipo de cumplimiento.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 p-3 bg-red-100 rounded-lg">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Canal de Denuncias
            </h1>
            <p className="text-lg text-foreground/70 max-w-lg mx-auto leading-relaxed">
              Este es un canal seguro y confidencial para denunciar cualquier conducta
              indebida, ilegal o poco ética relacionada con nuestra empresa.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Anonymous Option */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="anonimo"
                    name="anonimo"
                    checked={formData.anonimo}
                    onChange={handleChange}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label htmlFor="anonimo" className="cursor-pointer flex-1">
                    <p className="font-semibold text-foreground">
                      Deseo enviar esta denuncia de forma anónima
                    </p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Tu identidad será protegida y confidencial
                    </p>
                  </label>
                </div>

                {/* Nombre Field */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nombre {!formData.anonimo && ""}
                    <span className="text-foreground/60 font-normal"> (Opcional)</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email de Contacto
                    <span className="text-foreground/60 font-normal"> (Opcional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-foreground/60 mt-2">
                    Proporciona un email si deseas recibir seguimiento de tu denuncia
                  </p>
                </div>

                {/* Detalles Field */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Detalles de la Denuncia <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="detalles"
                    value={formData.detalles}
                    onChange={handleChange}
                    placeholder="Describe con detalle la conducta indebida, incluyendo fechas, personas involucradas y cualquier evidencia relevante"
                    rows={8}
                    required
                    className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.detalles.trim()}
                  className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Denuncia
                    </>
                  )}
                </button>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-foreground/70">
                    <strong>Importante:</strong> Todas las denuncias serán tratadas de forma confidencial
                    y investigadas de acuerdo con nuestras políticas internas. No se permitirán represalias
                    contra personas que actúen de buena fe.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
