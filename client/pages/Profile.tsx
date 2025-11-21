import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getUserInvestments, getTotalInvestedAmount, getAverageYield } from "@/lib/investmentManager";
import { formatCLP } from "@/lib/utils";
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

interface TestAnswers {
  [key: number]: number;
}

interface ProfileResult {
  type: string;
  description: string;
  characteristics: string[];
}

export default function Profile() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const userFirstName = localStorage.getItem("userFirstName") || "";
  const userLastName = localStorage.getItem("userLastName") || "";
  const userName = userFirstName;
  const userProfileType = (localStorage.getItem("userProfileType") || "persona") as "persona" | "empresa";

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<"portafolio" | "cuenta" | "inversion" | "verificacion" | "bancaria">("portafolio");
  const [showTest, setShowTest] = useState(false);
  const [testAnswers, setTestAnswers] = useState<TestAnswers>({});
  const [testResult, setTestResult] = useState<ProfileResult | null>(null);
  
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
    tipoInversionista: "",
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

  const [portfolio, setPortfolio] = useState({
    saldoTotal: 0,
    inversionesActivas: 0,
    rentabilidadPromedio: 0,
    inversiones: [] as any[],
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    const investments = getUserInvestments(userEmail);
    const totalAmount = getTotalInvestedAmount(userEmail);
    const avgYield = getAverageYield(userEmail);

    setPortfolio({
      saldoTotal: totalAmount,
      inversionesActivas: investments.filter(inv => inv.estado === "Activo").length,
      rentabilidadPromedio: avgYield,
      inversiones: investments,
    });
  }, []);

  const testQuestions = [
    {
      id: 1,
      question: "Horizonte de inversión: ¿Cuánto tiempo planeas mantener tu inversión?",
      options: [
        { text: "Menos de 1 año", weight: 1 },
        { text: "1 a 3 años", weight: 2 },
        { text: "3 a 5 años", weight: 3 },
        { text: "Más de 5 años", weight: 4 },
      ],
    },
    {
      id: 2,
      question: "Objetivo principal de inversión: ¿Qué esperas lograr con tus inversiones?",
      options: [
        { text: "Mantener el valor de mi dinero (preservación)", weight: 1 },
        { text: "Generar ingresos periódicos", weight: 2 },
        { text: "Hacer crecer mi capital en el mediano plazo", weight: 3 },
        { text: "Maximizar rentabilidad en el largo plazo", weight: 4 },
      ],
    },
    {
      id: 3,
      question: "Liquidez: ¿Qué tan importante es poder retirar tu dinero en cualquier momento?",
      options: [
        { text: "Muy importante (quiero disponibilidad inmediata)", weight: 1 },
        { text: "Moderadamente importante", weight: 2 },
        { text: "Poco importante, puedo dejarlo bloqueado varios años", weight: 4 },
      ],
    },
    {
      id: 4,
      question: "Experiencia y conocimientos financieros: ¿Cómo evaluarías tu experiencia?",
      options: [
        { text: "Nula (solo ahorro tradicional)", weight: 1 },
        { text: "Básica (depósitos, fondos mutuos simples)", weight: 2 },
        { text: "Media (acciones, ETFs, bonos)", weight: 3 },
        { text: "Avanzada (trading, criptomonedas, derivados, RWA)", weight: 4 },
      ],
    },
    {
      id: 5,
      question: "Reacción ante pérdidas: Si tu inversión baja un 20% en 3 meses, ¿qué harías?",
      options: [
        { text: "Vendería inmediatamente para evitar más pérdidas", weight: 1 },
        { text: "Esperaría hasta que se recupere", weight: 2 },
        { text: "Mantendría y evaluaría nuevas oportunidades", weight: 3 },
        { text: "Compraría más porque veo oportunidad", weight: 4 },
      ],
    },
    {
      id: 6,
      question: "Ingreso y situación financiera: ¿Qué proporción de tus ingresos destinas a invertir?",
      options: [
        { text: "Menos del 10%", weight: 1 },
        { text: "Entre 10% y 25%", weight: 2 },
        { text: "Entre 25% y 50%", weight: 3 },
        { text: "Más del 50%", weight: 4 },
      ],
    },
    {
      id: 7,
      question: "Tolerancia al riesgo: ¿Cuál de estas frases refleja mejor tu visión?",
      options: [
        { text: "Prefiero baja rentabilidad con seguridad", weight: 1 },
        { text: "Acepto cierta volatilidad por mejor rendimiento", weight: 2 },
        { text: "Busco buenas oportunidades aunque impliquen riesgo", weight: 3 },
        { text: "Estoy dispuesto a arriesgar mucho por alta rentabilidad", weight: 4 },
      ],
    },
    {
      id: 8,
      question: "Distribución hipotética: Si inviertes 10,000 USDC, ¿cómo lo distribuirías?",
      options: [
        { text: "90% en activos estables, 10% en riesgosos", weight: 1 },
        { text: "70% en estables, 30% en riesgosos", weight: 2 },
        { text: "50% en estables, 50% en riesgosos", weight: 3 },
        { text: "20% en estables, 80% en riesgosos", weight: 4 },
      ],
    },
    {
      id: 9,
      question: "Estilo de inversión preferido",
      options: [
        { text: "Conservador: priorizo seguridad y liquidez", weight: 1 },
        { text: "Moderado: equilibrio entre crecimiento y seguridad", weight: 2 },
        { text: "Dinámico: acepto volatilidad por más retorno", weight: 3 },
        { text: "Agresivo: busco máximo crecimiento a largo plazo", weight: 4 },
      ],
    },
  ];

  const calculateProfileType = (answers: TestAnswers): ProfileResult => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const averageScore = totalScore / Object.keys(answers).length;

    if (averageScore <= 1.5) {
      return {
        type: "Conservador",
        description: "Priorizo seguridad y liquidez en mis inversiones",
        characteristics: [
          "Bajo riesgo de pérdida de capital",
          "Acceso rápido a liquidez",
          "Retornos moderados y predecibles",
          "Ideal para inversiones de corto plazo",
        ],
      };
    } else if (averageScore <= 2.5) {
      return {
        type: "Moderado",
        description: "Busco equilibrio entre crecimiento y seguridad",
        characteristics: [
          "Riesgo moderado controlado",
          "Horizonte de mediano plazo (3-5 años)",
          "Diversificación de activos",
          "Balance entre estabilidad y crecimiento",
        ],
      };
    } else if (averageScore <= 3.5) {
      return {
        type: "Dinámico",
        description: "Acepto volatilidad por más retorno potencial",
        characteristics: [
          "Disposición a asumir riesgo moderado-alto",
          "Horizonte a largo plazo (5+ años)",
          "Participación en activos alternativos",
          "Potencial de crecimiento significativo",
        ],
      };
    } else {
      return {
        type: "Agresivo",
        description: "Busco máximo crecimiento a largo plazo",
        characteristics: [
          "Alto riesgo, alto retorno potencial",
          "Horizonte muy largo plazo (7+ años)",
          "Acceso a activos RWA y alternativos",
          "Disposición a mantener volatilidad",
        ],
      };
    }
  };

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

  const handleTestAnswer = (questionId: number, weight: number) => {
    setTestAnswers((prev) => ({
      ...prev,
      [questionId]: weight,
    }));
  };

  const handleSubmitTest = () => {
    if (Object.keys(testAnswers).length !== testQuestions.length) {
      alert("Por favor responde todas las preguntas");
      return;
    }

    const result = calculateProfileType(testAnswers);
    setTestResult(result);
    setInvestmentProfile((prev) => ({
      ...prev,
      tipoInversionista: result.type,
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
    { id: "portafolio", label: "Portafolio de Inversión", icon: <BarChart3 className="w-5 h-5" /> },
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
        <div className="container max-w-6xl mx-auto relative z-10" style={{ padding: "50px 32px 0" }}>
          {/* Profile Header */}
          <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
          </div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1">
              <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl sticky top-24">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6 space-y-2 flex flex-col h-full">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-6">Menú</h3>
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id as any);
                          setShowTest(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 font-medium text-sm ${
                          activeSection === item.id && !showTest
                            ? "bg-primary text-white"
                            : "text-foreground/70 hover:bg-secondary"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-auto pt-6 border-t border-border/20">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2 justify-center text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 space-y-6">
                  {/* Portafolio de Inversión */}
                  {activeSection === "portafolio" && (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-8">Portafolio de Inversión</h2>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold text-foreground/70">Saldo Total</h3>
                              <Wallet className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">
                              {formatCLP(portfolio.inversiones.reduce((sum, inv) => sum + inv.montoInvertido, 0))}
                            </p>
                            <p className="text-xs text-foreground/60 mt-2">CLP</p>
                          </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold text-foreground/70">Inversiones Activas</h3>
                              <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">{portfolio.inversiones.length}</p>
                            <p className="text-xs text-foreground/60 mt-2">Instrumentos activos</p>
                          </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold text-foreground/70">Rentabilidad Promedio</h3>
                              <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-3xl font-bold text-foreground">
                              {portfolio.rentabilidadPromedio.toFixed(2)}%
                            </p>
                            <p className="text-xs text-foreground/60 mt-2">YTD</p>
                          </div>
                        </div>
                      </div>

                      {/* Investment List */}
                      <h3 className="text-xl font-bold text-foreground mb-4">Tus Inversiones</h3>
                      {portfolio.inversiones.length === 0 ? (
                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative p-12 text-center">
                            <div className="mb-4 flex justify-center">
                              <TrendingUp className="w-12 h-12 text-foreground/30" />
                            </div>
                            <p className="text-foreground/70 mb-4">Aún no tienes inversiones activas</p>
                            <p className="text-sm text-foreground/60">Explora nuestras oportunidades de inversión en la sección de Inversiones</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {portfolio.inversiones.map((inversion) => (
                            <div key={inversion.id} className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/20 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="relative p-6">
                                {/* Header with Offer Name and Status */}
                                <div className="flex items-start justify-between mb-6 pb-4 border-b border-border/20">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                                      <CreditCard className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-lg text-foreground mb-2">{inversion.stoNombre}</h4>
                                      <div className="flex items-center gap-3">
                                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                          {inversion.estado}
                                        </div>
                                        {inversion.categoria && (
                                          <span className="text-xs text-foreground/60 font-medium">
                                            {inversion.categoria} {inversion.subcategoria && `• ${inversion.subcategoria}`}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Investment Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                  {/* Monto Invertido */}
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200/50">
                                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">Monto Invertido</p>
                                    <p className="text-xl font-bold text-foreground">{formatCLP(inversion.montoInvertido)}</p>
                                  </div>

                                  {/* Cantidad de Tokens */}
                                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200/50">
                                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">Cantidad de Tokens</p>
                                    <p className="text-xl font-bold text-foreground">{inversion.cantidadToken.toLocaleString()}</p>
                                  </div>

                                  {/* Valor por Token */}
                                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200/50">
                                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">Valor por Token</p>
                                    <p className="text-xl font-bold text-foreground">{formatCLP(inversion.valorPorToken)}</p>
                                  </div>

                                  {/* Plazo */}
                                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200/50">
                                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">Plazo</p>
                                    <p className="text-xl font-bold text-foreground">{inversion.plazo}</p>
                                  </div>

                                  {/* Rentabilidad */}
                                  <div className="p-4 bg-green-50 rounded-lg border border-green-200/50">
                                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">Rentabilidad</p>
                                    <div>
                                      <p className="text-xl font-bold text-green-600">{inversion.rentabilidadActual.toFixed(2)}%</p>
                                      <p className="text-xs text-foreground/60 mt-1">de {inversion.tasaEsperada.toFixed(2)}% esperado</p>
                                    </div>
                                  </div>

                                  {/* Tipo */}
                                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200/50">
                                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">Tipo de Activo</p>
                                    <p className="text-xl font-bold text-foreground">{inversion.tipo}</p>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="pt-4 border-t border-border/20">
                                  <p className="text-sm text-foreground/60 mb-2">Progreso del período</p>
                                  <div className="w-full bg-foreground/10 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${inversion.progreso}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-foreground/60 mt-1">{inversion.progreso}% completado</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Información de la Cuenta */}
                  {activeSection === "cuenta" && !showTest && (
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
                  {activeSection === "inversion" && !showTest && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Perfil de Inversión</h2>
                        <button
                          onClick={() => {
                            setShowTest(true);
                            setTestAnswers({});
                            setTestResult(null);
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
                        >
                          Realizar Test
                        </button>
                      </div>

                      {investmentProfile.tipoInversionista && (
                        <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            Tu Perfil: {investmentProfile.tipoInversionista}
                          </h3>
                          {testResult && (
                            <>
                              <p className="text-foreground/70 mb-4">{testResult.description}</p>
                              <div className="space-y-2">
                                <p className="font-semibold text-foreground text-sm">Características:</p>
                                <ul className="space-y-1">
                                  {testResult.characteristics.map((char, idx) => (
                                    <li key={idx} className="text-sm text-foreground/70 flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                      {char}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      )}

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

                  {/* Test Questionnaire */}
                  {showTest && activeSection === "inversion" && (
                    <>
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Test de Perfil de Inversión</h2>
                        <p className="text-foreground/70">
                          Responde a las siguientes preguntas para determinar tu perfil de inversionista. Esto nos ayuda a recomendarte las mejores oportunidades.
                        </p>
                      </div>

                      <div className="space-y-8">
                        {testQuestions.map((question, idx) => (
                          <div key={question.id} className="border-b border-border/20 pb-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                              {idx + 1}. {question.question}
                            </h3>
                            <div className="space-y-3">
                              {question.options.map((option, optionIdx) => (
                                <label key={optionIdx} className="flex items-center gap-3 cursor-pointer group">
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option.weight}
                                    checked={testAnswers[question.id] === option.weight}
                                    onChange={() => handleTestAnswer(question.id, option.weight)}
                                    className="w-5 h-5 cursor-pointer"
                                  />
                                  <span className="text-foreground/70 group-hover:text-foreground transition-colors">
                                    {option.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex gap-4">
                        <button
                          onClick={() => setShowTest(false)}
                          className="flex-1 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSubmitTest}
                          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                          Ver Resultado
                        </button>
                      </div>
                    </>
                  )}

                  {/* Verificación de Usuario */}
                  {activeSection === "verificacion" && !showTest && (
                    <>
                      <h2 className="text-2xl font-bold text-foreground">Verificación de Usuario</h2>
                      <div className="space-y-4">
                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-lg p-4 border border-border/40">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-6 h-6 text-primary" />
                              <div>
                                <h3 className="font-semibold text-foreground">Documento de Identidad</h3>
                                <p className="text-sm text-foreground/60">Verifica tu documento de identidad</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-orange-500">{verificacion.documentoIdentidad}</span>
                          </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-lg p-4 border border-border/40">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-6 h-6 text-foreground/30" />
                              <div>
                                <h3 className="font-semibold text-foreground">Verificación Facial</h3>
                                <p className="text-sm text-foreground/60">Completa tu verificación biométrica</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-red-500">{verificacion.verificacionFacial}</span>
                          </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-lg p-4 border border-border/40">
                          <div className="flex items-center justify-between">
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
                      </div>
                    </>
                  )}

                  {/* Cuenta Bancaria */}
                  {activeSection === "bancaria" && !showTest && (
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
