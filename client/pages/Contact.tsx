import { useState } from "react";
import Layout from "@/components/Layout";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const asuntoOptions = [
    { value: "general", label: "Consulta General" },
    { value: "soporte", label: "Soporte Técnico" },
    { value: "prensa", label: "Prensa y Medios" },
    { value: "otros", label: "Otros" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.asunto) {
      newErrors.asunto = "Selecciona un asunto";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
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
              ¡Mensaje Enviado!
            </h1>
            <p className="text-lg text-foreground/70 mb-4">
              Gracias por tu mensaje. Nos pondremos en contacto pronto.
            </p>
            <p className="text-foreground/60 mb-8">
              Recibirás una respuesta en tu email <strong>{formData.email}</strong> en las próximas 24 horas.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-6xl mx-auto" style={{ paddingTop: "60px" }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Contacto</h1>
            <p className="text-xl text-foreground/70">
              Estamos aquí para ayudarte. Envíanos tu mensaje y te responderemos lo antes posible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-border/40 p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-foreground/70 text-sm">contacto@fractionfinance.cl</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-border/40 p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                      <p className="text-foreground/70 text-sm">
                        Antonio Bellet N° 130, Oficina 1201, Providencia, Santiago, Chile
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-border/40 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        className={`w-full px-4 py-3 border ${
                          errors.nombre ? "border-red-500" : "border-border/40"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      />
                      {errors.nombre && (
                        <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className={`w-full px-4 py-3 border ${
                          errors.email ? "border-red-500" : "border-border/40"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Asunto *
                    </label>
                    <select
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.asunto ? "border-red-500" : "border-border/40"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    >
                      <option value="">Selecciona un asunto</option>
                      {asuntoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.asunto && (
                      <p className="text-red-600 text-sm mt-1">{errors.asunto}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Cuéntanos tu consulta o mensaje"
                      rows={6}
                      className={`w-full px-4 py-3 border ${
                        errors.mensaje ? "border-red-500" : "border-border/40"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none`}
                    />
                    {errors.mensaje && (
                      <p className="text-red-600 text-sm mt-1">{errors.mensaje}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
