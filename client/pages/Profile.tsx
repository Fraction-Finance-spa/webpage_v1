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
  Heart,
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
    bio: "Emprendedor apasionado por la innovación y el financiamiento colaborativo",
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
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-morphism rounded-2xl p-8 sm:p-12 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{formData.name}</h1>
                <p className="text-foreground/60 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {formData.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
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

            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  handleSave();
                }}
                className="text-sm text-primary hover:text-primary/80"
              >
                o haz clic en Guardar
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Form */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold">Información Personal</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors disabled:opacity-50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Mi Actividad</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground/60 text-sm mb-1">
                      Financiamientos Activos
                    </p>
                    <p className="text-3xl font-bold text-primary">3</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm mb-1">
                      Capital Recibido
                    </p>
                    <p className="text-3xl font-bold text-accent">$250K</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm mb-1">
                      Inversiones Realizadas
                    </p>
                    <p className="text-3xl font-bold text-secondary">5</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass-morphism rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm">
                    Solicitar Financiamiento
                  </button>
                  <button className="w-full px-4 py-3 bg-border/30 text-foreground rounded-lg hover:bg-border/50 transition-colors font-semibold text-sm flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Ver Oportunidades
                  </button>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
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
