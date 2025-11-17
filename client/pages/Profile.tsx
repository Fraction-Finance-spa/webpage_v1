import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  LogOut,
  FileText,
  Zap,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "Usuario";
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: "+34 600 000 000",
    location: "Madrid, España",
    company: "Mi Empresa",
    bio: "Emprendedor apasionado por la innovación",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("userName", formData.name);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="container max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg border border-border/40 p-8 sm:p-12 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{formData.name}</h1>
                <p className="text-foreground/70 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {formData.email}
                </p>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    Editar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-border/40 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Información Personal</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-border/40 rounded-lg disabled:bg-blue-50 disabled:text-foreground/60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Mi Actividad
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-border/40">
                    <p className="text-sm text-foreground/60 mb-1">
                      Financiamientos Activos
                    </p>
                    <p className="text-3xl font-bold text-primary">3</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-border/40">
                    <p className="text-sm text-foreground/60 mb-1">
                      Capital Recibido
                    </p>
                    <p className="text-3xl font-bold text-primary">$250K</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-border/40">
                    <p className="text-sm text-foreground/60 mb-1">
                      Inversiones Realizadas
                    </p>
                    <p className="text-3xl font-bold text-primary">5</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Acciones
                </h3>
                <div className="space-y-3">
                  <a
                    href="/productos/financiamiento"
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm text-center block"
                  >
                    Nueva Solicitud
                  </a>
                  <button className="w-full px-4 py-3 bg-secondary text-primary rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm border border-primary/20">
                    Ver Oportunidades
                  </button>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
