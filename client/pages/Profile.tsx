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
  Wallet,
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

  const [investmentProfile, setInvestmentProfile] = useState({
    objetivos: "",
    toleranciaRiesgo: "",
    experiencia: "",
    capitalDisponible: "",
  });

  const [verificacion, setVerificacion] = useState({
    documentoIdentidad: "No verificado",
    verificacionFacial: "No verificado",
    verificacionBancaria: "No verificado",
  });

  const [cuentaBancaria, setCuentaBancaria] = useState({
    nombreBanco: "",
    numeroCuenta: "",
    tipoCuenta: "",
    nombreTitular: "",
    codigoSwift: "",
  });

  const handlePersonaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmpresaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvestmentProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCuentaBancaria((prev) => ({
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
    localStorage.setItem("investmentProfile", JSON.stringify(investmentProfile));
    localStorage.setItem("bankInfo", JSON.stringify(cuentaBancaria));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userCompanyName");
    localStorage.removeItem("userProfileType");
    localStorage.removeItem("userProfileData");
    navigate("/");
  };

  const displayName = userProfileType === "persona" ? personaData.nombre : empresaData.nombreEmpresa;

  const menuItems = [
    { id: "cuenta", label: "Información de la Cuenta", icon: <User className="w-5 h-5" /> },
    { id: "inversion", label: "Perfil de Inversión", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "verificacion", label: "Verificación de Usuario", icon: <CheckCircle className="w-5 h-5" /> },
    { id: "bancaria", label: "Cuenta Bancaria", icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="container max-w-6xl mx-auto relative z-10">
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

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border/40 p-6 sticky top-24 space-y-2">
                <h3 className="text-lg font-bold text-foreground mb-6">Menú</h3>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 font-medium text-sm ${
                      activeSection === item.id
                        ? "bg-primary text-white"
                        : "text-foreground/70 hover:bg-secondary"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-border/40 p-8 space-y-6">
                {/* Información de la Cuenta */}
                {activeSection === "cuenta" && (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">
                      {userProfileType === "persona" ? "Información Personal" : "Información de la Empresa"}
                    </h2>

                    {userProfileType === "persona" ? (
                      <div className="space-y-6">
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
                      </div>
                    ) : (
                      <div className="space-y-6">
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
                          <div className="sm:col-span-2">
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
                      </div>
                    )}
                  </>
                )}

                {/* Perfil de Inversión */}
                {activeSection === "inversion" && (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">Perfil de Inversión</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Objetivos de Inversión
                        </label>
                        <select
                          name="objetivos"
                          value={investmentProfile.objetivos}
                          onChange={handleInvestmentChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        >
                          <option value="">Selecciona tus objetivos</option>
                          <option value="crecimiento">Crecimiento a largo plazo</option>
                          <option value="ingresos">Generación de ingresos</option>
                          <option value="preservacion">Preservación de capital</option>
                          <option value="especulacion">Especulación</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Tolerancia al Riesgo
                        </label>
                        <select
                          name="toleranciaRiesgo"
                          value={investmentProfile.toleranciaRiesgo}
                          onChange={handleInvestmentChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        >
                          <option value="">Selecciona tu tolerancia</option>
                          <option value="baja">Baja</option>
                          <option value="moderada">Moderada</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Experiencia en Inversión
                        </label>
                        <select
                          name="experiencia"
                          value={investmentProfile.experiencia}
                          onChange={handleInvestmentChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        >
                          <option value="">Selecciona tu experiencia</option>
                          <option value="principiante">Principiante</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Capital Disponible
                        </label>
                        <input
                          type="text"
                          name="capitalDisponible"
                          value={investmentProfile.capitalDisponible}
                          onChange={handleInvestmentChange}
                          disabled={!isEditing}
                          placeholder="Ej: $50,000"
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Verificación de Usuario */}
                {activeSection === "verificacion" && (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">Verificación de Usuario</h2>
                    <div className="space-y-4">
                      <div className="p-4 border border-border/40 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-foreground">Documento de Identidad</h3>
                            <p className="text-sm text-foreground/60">Verifica tu documento de identidad</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-orange-500">{verificacion.documentoIdentidad}</span>
                      </div>
                      <div className="p-4 border border-border/40 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-foreground/30" />
                          <div>
                            <h3 className="font-semibold text-foreground">Verificación Facial</h3>
                            <p className="text-sm text-foreground/60">Completa tu verificación biométrica</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-red-500">{verificacion.verificacionFacial}</span>
                      </div>
                      <div className="p-4 border border-border/40 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-foreground/30" />
                          <div>
                            <h3 className="font-semibold text-foreground">Verificación Bancaria</h3>
                            <p className="text-sm text-foreground/60">Verifica tu cuenta bancaria</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-red-500">{verificacion.verificacionBancaria}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Cuenta Bancaria */}
                {activeSection === "bancaria" && (
                  <>
                    <h2 className="text-2xl font-bold text-foreground">Cuenta Bancaria</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nombre del Banco
                        </label>
                        <input
                          type="text"
                          name="nombreBanco"
                          value={cuentaBancaria.nombreBanco}
                          onChange={handleBankChange}
                          disabled={!isEditing}
                          placeholder="Ej: Banco de Chile"
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Número de Cuenta
                        </label>
                        <input
                          type="text"
                          name="numeroCuenta"
                          value={cuentaBancaria.numeroCuenta}
                          onChange={handleBankChange}
                          disabled={!isEditing}
                          placeholder="Ej: 1234567890"
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Tipo de Cuenta
                        </label>
                        <select
                          name="tipoCuenta"
                          value={cuentaBancaria.tipoCuenta}
                          onChange={handleBankChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        >
                          <option value="">Selecciona tipo de cuenta</option>
                          <option value="corriente">Cuenta Corriente</option>
                          <option value="ahorro">Cuenta de Ahorro</option>
                          <option value="cheque">Cuenta Cheque</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          name="nombreTitular"
                          value={cuentaBancaria.nombreTitular}
                          onChange={handleBankChange}
                          disabled={!isEditing}
                          placeholder="Ej: Juan Pérez"
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Código SWIFT / BIC
                        </label>
                        <input
                          type="text"
                          name="codigoSwift"
                          value={cuentaBancaria.codigoSwift}
                          onChange={handleBankChange}
                          disabled={!isEditing}
                          placeholder="Ej: CHBCCL2S"
                          className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50 disabled:text-foreground/60"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
