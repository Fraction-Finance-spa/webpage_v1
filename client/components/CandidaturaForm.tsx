import { useState } from "react";
import { X } from "lucide-react";

export interface Candidatura {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  cvFileName: string;
  cvData: string;
  fechaEnvio: string;
}

interface CandidaturaFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidaturaForm({ isOpen, onClose }: CandidaturaFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB.");
        return;
      }
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Solo se aceptan archivos PDF o Word (.pdf, .doc, .docx)");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !file) {
      alert("Por favor completa todos los campos requeridos e incluye un CV.");
      return;
    }

    setLoading(true);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = () => {
        const candidatura: Candidatura = {
          id: Date.now().toString(),
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          cvFileName: file.name,
          cvData: reader.result as string,
          fechaEnvio: new Date().toISOString(),
        };

        // Store in localStorage
        const existingCandidaturas = JSON.parse(
          localStorage.getItem("candidaturas") || "[]"
        );
        existingCandidaturas.push(candidatura);
        localStorage.setItem("candidaturas", JSON.stringify(existingCandidaturas));

        setSuccess(true);
        setLoading(false);

        // Reset form
        setTimeout(() => {
          setFormData({ nombre: "", email: "", telefono: "" });
          setFile(null);
          setSuccess(false);
          onClose();
        }, 2000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al enviar la candidatura. Por favor intenta de nuevo.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border/40 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Enviar Candidatura</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                ¡Candidatura Enviada!
              </h3>
              <p className="text-foreground/70">
                Gracias por tu interés. Nos pondremos en contacto pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+56 9 1234 5678"
                  className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  CV / Currículo <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="file-input"
                    required
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    {file ? (
                      <div className="space-y-2">
                        <svg
                          className="w-8 h-8 text-green-600 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="font-semibold text-foreground">
                          {file.name}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <svg
                          className="w-8 h-8 text-primary mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="text-foreground font-semibold">
                          Haz clic para cargar
                        </p>
                        <p className="text-sm text-foreground/60">
                          PDF o Word (máx. 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-200 text-foreground rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar Candidatura"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
