import { useState } from "react";
import Layout from "@/components/Layout";
import { MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ReclamosChannel() {
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
    const reclamos = JSON.parse(localStorage.getItem("reclamos") || "[]");
    reclamos.push({
      id: Date.now().toString(),
      ...formData,
      fecha: new Date().toISOString(),
      estado: "Nuevo",
    });
    localStorage.setItem("reclamos", JSON.stringify(reclamos));

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
              ¡Reclamo Recibido!
            </h1>
            <p className="text-lg text-foreground/70 mb-4">
              Gracias por compartir tu feedback. Tu opinión es valiosa para nosotros.
            </p>
            <p className="text-foreground/60">
              Tu reclamo ha sido registrado y será revisado por nuestro equipo de atención al cliente.
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
          <div className="text-center mb-12" style={{ paddingTop: "50px" }}>
            <div className="inline-block mb-4 p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Canal de Reclamos
            </h1>
            <p className="text-lg text-foreground/70 max-w-lg mx-auto leading-relaxed">
              Tu opinión es importante. Utiliza este canal para enviar reclamos o sugerencias
              sobre nuestros servicios.
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
                      Deseo enviar este reclamo de forma anónima
                    </p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Tu privacidad será respetada
                    </p>
                  </label>
                </div>

                {/* Nombre Field */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nombre
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
                    Email
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
                    Proporciona un email si deseas recibir respuesta sobre tu reclamo
                  </p>
                </div>

                {/* Detalles Field */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Detalles del Reclamo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="detalles"
                    value={formData.detalles}
                    onChange={handleChange}
                    placeholder="Describe tu reclamo o sugerencia con el mayor detalle posible. Incluye qué servicio afecta, cuándo sucedió y cómo podríamos mejorar."
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
                      Enviar Reclamo
                    </>
                  )}
                </button>

                {/* Disclaimer */}
                <div className="p-4 bg-blue-50 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground/70">
                    <strong>Tu feedback nos ayuda a mejorar.</strong> Nos comprometemos a revisar
                    todos los reclamos y sugerencias en un plazo de 5 días hábiles. Agradecemos
                    tu disposición a ayudarnos a ser mejores.
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
