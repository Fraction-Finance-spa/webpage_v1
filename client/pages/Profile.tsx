import { useState } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  User,
  Mail,
  Edit,
  Save,
  LogOut,
  FileText,
  Zap,
  Lock,
  BarChart3,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Bank,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const userFirstName = localStorage.getItem("userFirstName") || "";
  const userLastName = localStorage.getItem("userLastName") || "";
  const userName = userFirstName;
  const userProfileType = (localStorage.getItem("userProfileType") || "persona") as "persona" | "empresa";

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<"cuenta" | "inversion" | "verificacion" | "bancaria">("cuenta");
  
  // Persona form data
  const [personaData, setPersonaData] = useState({
    nombre: userFirstName,
    apellidos: userLastName,
    fechaNacimiento: "",
    nacionalidad: "",
    rutPasaporte: "",
    direccion: "",
    paisResidencia: "",
    email: userEmail,
    telefonoContacto: "",
  });

  // Empresa form data
  const [empresaData, setEmpresaData] = useState({
    nombreEmpresa: userName,
    razonSocial: "",
    paisConstitucion: "",
    rut: "",
    actividad: "",
    fechaConstitucion: "",
    direccionLegal: "",
    direccionComercial: "",
    informacionContacto: "",
    nombreContacto: "",
    telefonoContacto: "",
    emailCorporativo: userEmail,
  });

  const handlePersonaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (userProfileType === "persona") {
      localStorage.setItem("userProfileData", JSON.stringify(personaData));
    } else {
      localStorage.setItem("userProfileData", JSON.stringify(empresaData));
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userProfileType");
    localStorage.removeItem("userProfileData");
    navigate("/");
  };

  const displayName = userProfileType === "persona" ? personaData.nombre : empresaData.nombreEmpresa;

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="container max-w-4xl mx-auto relative z-10">
          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{displayName}</h1>
                <p className="text-foreground/70 mb-2">
                  Tipo de Perfil: <span className="font-semibold capitalize">{userProfileType}</span>
                </p>
                <p className="text-foreground/70 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userProfileType === "persona" ? personaData.email : empresaData.emailCorporativo}
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
                {userProfileType === "persona" ? (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">Información Personal</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={personaData.nombre}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Apellidos
                        </label>
                        <input
                          type="text"
                          name="apellidos"
                          value={personaData.apellidos}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Fecha de Nacimiento
                        </label>
                        <input
                          type="date"
                          name="fechaNacimiento"
                          value={personaData.fechaNacimiento}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nacionalidad
                        </label>
                        <input
                          type="text"
                          name="nacionalidad"
                          value={personaData.nacionalidad}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          RUT / Número de Pasaporte
                        </label>
                        <input
                          type="text"
                          name="rutPasaporte"
                          value={personaData.rutPasaporte}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          País de Residencia
                        </label>
                        <input
                          type="text"
                          name="paisResidencia"
                          value={personaData.paisResidencia}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          name="direccion"
                          value={personaData.direccion}
                          onChange={handlePersonaChange}
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
                          value={personaData.email}
                          disabled
                          className="w-full px-4 py-3 border border-border/40 rounded-lg disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="tel"
                          name="telefonoContacto"
                          value={personaData.telefonoContacto}
                          onChange={handlePersonaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">Información de la Empresa</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nombre de la Empresa
                        </label>
                        <input
                          type="text"
                          name="nombreEmpresa"
                          value={empresaData.nombreEmpresa}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Razón Social
                        </label>
                        <input
                          type="text"
                          name="razonSocial"
                          value={empresaData.razonSocial}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          País de Constitución
                        </label>
                        <input
                          type="text"
                          name="paisConstitucion"
                          value={empresaData.paisConstitucion}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          RUT
                        </label>
                        <input
                          type="text"
                          name="rut"
                          value={empresaData.rut}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Actividad
                        </label>
                        <input
                          type="text"
                          name="actividad"
                          value={empresaData.actividad}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Fecha de Constitución
                        </label>
                        <input
                          type="date"
                          name="fechaConstitucion"
                          value={empresaData.fechaConstitucion}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Dirección Legal
                        </label>
                        <input
                          type="text"
                          name="direccionLegal"
                          value={empresaData.direccionLegal}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Dirección Comercial
                        </label>
                        <input
                          type="text"
                          name="direccionComercial"
                          value={empresaData.direccionComercial}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Información de Contacto
                        </label>
                        <input
                          type="text"
                          name="informacionContacto"
                          value={empresaData.informacionContacto}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nombre Completo del Contacto
                        </label>
                        <input
                          type="text"
                          name="nombreContacto"
                          value={empresaData.nombreContacto}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="tel"
                          name="telefonoContacto"
                          value={empresaData.telefonoContacto}
                          onChange={handleEmpresaChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Email Corporativo
                        </label>
                        <input
                          type="email"
                          name="emailCorporativo"
                          value={empresaData.emailCorporativo}
                          disabled
                          className="w-full px-4 py-3 border border-border/40 rounded-lg disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Mi Portafolio
                </h3>
                <div className="space-y-4 text-foreground/70">
                  <p className="text-sm">Gestiona tus activos tokenizados y mantén el control de tu cartera en tiempo real.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Seguridad de grado bancario
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Acceso 24/7 a tus activos
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Reportes en tiempo real
                    </li>
                  </ul>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Acciones
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm">
                    Nueva Solicitud
                  </button>
                  <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold text-sm">
                    Ver Oportunidades
                  </button>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
