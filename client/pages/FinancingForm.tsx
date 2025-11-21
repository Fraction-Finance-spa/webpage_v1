import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowRight, AlertCircle, CheckCircle, TrendingUp, Zap, Target } from "lucide-react";
import { addFinancingRequest } from "@/lib/financingRequestManager";

interface FormData {
  companyName: string;
  rutEmpresa: string;
  industry: string;
  foundedYear: string;
  employeeCount: string;
  monthlyRevenue: string;
  financingAmount: string;
  financingPurpose: string;
  businessStage: string;
  financingType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  terms: boolean;
}

interface SimulationResults {
  requestedAmount: number;
  estimatedApprovalChance: number;
  suggestedAmount: number;
  estimatedDuration: string;
  interestRate: number;
  riskLevel: string;
  recommendation: string;
}

export default function FinancingForm() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail") || "";

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    rutEmpresa: "",
    industry: "",
    foundedYear: "",
    employeeCount: "",
    monthlyRevenue: "",
    financingAmount: "",
    financingPurpose: "",
    businessStage: "",
    financingType: "",
    firstName: "",
    lastName: "",
    email: userEmail,
    phone: "",
    terms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Nombre de empresa requerido";
    if (!formData.rutEmpresa.trim())
      newErrors.rutEmpresa = "RUT de empresa requerido";
    if (!formData.industry) newErrors.industry = "Industria requerida";
    if (!formData.foundedYear) newErrors.foundedYear = "Año de fundación requerido";
    if (!formData.employeeCount) newErrors.employeeCount = "Número de empleados requerido";
    if (!formData.monthlyRevenue)
      newErrors.monthlyRevenue = "Ingresos mensuales requeridos";
    if (!formData.financingAmount)
      newErrors.financingAmount = "Monto de financiamiento requerido";
    if (!formData.financingType)
      newErrors.financingType = "Tipo de financiamiento requerido";
    if (!formData.financingPurpose)
      newErrors.financingPurpose = "Propósito del financiamiento requerido";
    if (!formData.businessStage) newErrors.businessStage = "Etapa de negocio requerida";
    if (!formData.firstName.trim()) newErrors.firstName = "Nombre requerido";
    if (!formData.lastName.trim()) newErrors.lastName = "Apellido requerido";
    if (!formData.email.trim()) newErrors.email = "Email requerido";
    if (!formData.phone.trim()) newErrors.phone = "Teléfono requerido";
    if (!formData.terms) newErrors.terms = "Debe aceptar los términos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const calculateSimulation = (): SimulationResults => {
    const requestedAmount = parseFloat(formData.financingAmount);

    // Factor de viabilidad basado en edad de la empresa
    const yearsInBusiness = new Date().getFullYear() - parseInt(formData.foundedYear);
    const ageScore = Math.min(yearsInBusiness / 10, 1);

    // Factor de ingresos mensuales
    const revenueMap: Record<string, number> = {
      "0-10k": 2000,
      "10k-50k": 30000,
      "50k-100k": 75000,
      "100k-500k": 300000,
      "500k+": 1000000,
    };
    const monthlyRevenue = revenueMap[formData.monthlyRevenue] || 30000;
    const debtRatio = requestedAmount / (monthlyRevenue * 12);
    const debtScore = Math.max(1 - debtRatio / 2, 0);

    // Factor de etapa del negocio
    const stageScores: Record<string, number> = {
      "startup": 0.6,
      "growth": 0.8,
      "established": 0.95,
      "scale": 1.0,
    };
    const stageScore = stageScores[formData.businessStage] || 0.7;

    // Factor de empleados
    const employeeMap: Record<string, number> = {
      "1-5": 0.6,
      "6-20": 0.75,
      "21-50": 0.85,
      "51-100": 0.93,
      "100+": 1.0,
    };
    const employeeScore = employeeMap[formData.employeeCount] || 0.6;

    // Cálculo de probabilidad de aprobación
    const approvalChance = Math.round((ageScore * 0.2 + debtScore * 0.3 + stageScore * 0.25 + employeeScore * 0.25) * 100);

    // Monto sugerido
    const suggestedAmount = Math.round(requestedAmount * (approvalChance / 100));

    // Tasa de interés basada en riesgo
    let interestRate = 8;
    if (approvalChance >= 80) interestRate = 5;
    else if (approvalChance >= 60) interestRate = 7;
    else if (approvalChance >= 40) interestRate = 10;

    // Nivel de riesgo
    let riskLevel = "Alto";
    if (approvalChance >= 80) riskLevel = "Bajo";
    else if (approvalChance >= 60) riskLevel = "Medio";

    // Recomendación
    let recommendation = "Necesitas fortalecer tu solicitud. Considera aumentar ingresos o reducir el monto.";
    if (approvalChance >= 80) recommendation = "Excelente perfil. Tu solicitud tiene alta probabilidad de aprobación.";
    else if (approvalChance >= 60) recommendation = "Buen perfil. Tu solicitud puede ser aprobada con condiciones ajustadas.";

    return {
      requestedAmount,
      estimatedApprovalChance: approvalChance,
      suggestedAmount,
      estimatedDuration: "5-7 días hábiles",
      interestRate,
      riskLevel,
      recommendation,
    };
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isLoggedIn) {
      alert("Por favor inicia sesión para continuar");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const results = calculateSimulation();
      setSimulationResults(results);
      setShowSimulation(true);
      setLoading(false);
    }, 1500);
  };

  const handleConfirmSubmission = () => {
    if (!simulationResults) return;

    setLoading(true);
    setTimeout(() => {
      addFinancingRequest({
        companyName: formData.companyName,
        rutEmpresa: formData.rutEmpresa,
        industry: formData.industry,
        foundedYear: formData.foundedYear,
        employeeCount: formData.employeeCount,
        monthlyRevenue: formData.monthlyRevenue,
        financingAmount: formData.financingAmount,
        financingPurpose: formData.financingPurpose,
        businessStage: formData.businessStage,
        financingType: formData.financingType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-md text-center">
            <div className="inline-block mb-6 p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              ¡Solicitud Enviada!
            </h1>
            <p className="text-lg text-foreground/70 mb-4">
              Gracias por tu solicitud de financiamiento. Nos pondremos en contacto en las próximas 48 horas.
            </p>
            <p className="text-foreground/60 mb-8">
              Se envió una confirmación a <strong>{formData.email}</strong>
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

  if (showSimulation && simulationResults) {
    return (
      <Layout>
        <div className="bg-blue-50 px-8 pb-12" style={{ paddingTop: "120px" }}>
          <div className="container max-w-4xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setShowSimulation(false)}
                className="text-primary hover:underline text-sm font-semibold mb-4"
              >
                ← Volver al formulario
              </button>
            </div>

            <div className="bg-white rounded-lg p-8 sm:p-12 border border-border/40">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Simulación de Financiamiento
              </h1>
              <p className="text-xl text-foreground/70 mb-8">
                Resumen de tu evaluación preliminar
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-foreground/60">Probabilidad de Aprobación</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">
                    {simulationResults.estimatedApprovalChance}%
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-foreground/60">Monto Sugerido</p>
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                    ${simulationResults.suggestedAmount.toLocaleString()}
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-foreground/60">Tasa de Interés Estimada</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-700">
                    {simulationResults.interestRate}% APY
                  </p>
                </div>
              </div>

              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Recomendación
                </h3>
                <p className="text-foreground/70">
                  {simulationResults.recommendation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                  <p className="text-xs text-foreground/60 mb-1">Monto Solicitado</p>
                  <p className="text-xl font-bold text-foreground">
                    ${simulationResults.requestedAmount.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                  <p className="text-xs text-foreground/60 mb-1">Tiempo Estimado de Respuesta</p>
                  <p className="text-xl font-bold text-foreground">
                    {simulationResults.estimatedDuration}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                  <p className="text-xs text-foreground/60 mb-1">Nivel de Riesgo</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    simulationResults.riskLevel === "Bajo"
                      ? "bg-green-100 text-green-700"
                      : simulationResults.riskLevel === "Medio"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}>
                    {simulationResults.riskLevel}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-border/40">
                  <p className="text-xs text-foreground/60 mb-1">Empresa</p>
                  <p className="text-xl font-bold text-foreground">
                    {formData.companyName}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-foreground/70">
                  Esta es una simulación preliminar basada en los datos proporcionados. El resultado final dependerá de una evaluación comercial completa realizada por nuestro equipo de expertos.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSimulation(false)}
                  className="flex-1 px-6 py-3 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors font-semibold"
                >
                  Editar Información
                </button>
                <button
                  onClick={handleConfirmSubmission}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Continuar y Enviar Solicitud"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-blue-50 px-8 pb-12" style={{ paddingTop: "120px" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Solicitud de Financiamiento
            </h1>
            <p className="text-xl text-foreground/70">
              Completa el formulario para obtener una evaluación instantánea de tu solicitud
            </p>
          </div>

          {!isLoggedIn && (
            <div className="mb-8 p-4 bg-blue-100 border border-blue-300 rounded-lg flex gap-4">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-2">
                  Debes iniciar sesión
                </p>
                <p className="text-foreground/70 text-sm">
                  Por favor{" "}
                  <a href="/auth" className="text-primary hover:underline font-semibold">
                    inicia sesión
                  </a>{" "}
                  o{" "}
                  <a href="/auth" className="text-primary hover:underline font-semibold">
                    regístrate
                  </a>{" "}
                  para continuar.
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSimulate}
            className="bg-white rounded-lg p-8 sm:p-12 border border-border/40"
          >
            {/* Información de la Empresa */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Información de la Empresa
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.companyName ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Ej: Tech Innovators Inc"
                  />
                  {errors.companyName && (
                    <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    RUT Empresa *
                  </label>
                  <input
                    type="text"
                    name="rutEmpresa"
                    value={formData.rutEmpresa}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.rutEmpresa ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Ej: 12.345.678-9"
                  />
                  {errors.rutEmpresa && (
                    <p className="text-red-600 text-sm mt-1">{errors.rutEmpresa}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Industria *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.industry ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona una industria</option>
                    <option value="tech">Tecnología</option>
                    <option value="retail">Retail</option>
                    <option value="healthcare">Salud</option>
                    <option value="fintech">Fintech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="other">Otra</option>
                  </select>
                  {errors.industry && (
                    <p className="text-red-600 text-sm mt-1">{errors.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Año de Fundación *
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.foundedYear ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="2020"
                  />
                  {errors.foundedYear && (
                    <p className="text-red-600 text-sm mt-1">{errors.foundedYear}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Número de Empleados *
                  </label>
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.employeeCount ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona rango</option>
                    <option value="1-5">1-5</option>
                    <option value="6-20">6-20</option>
                    <option value="21-50">21-50</option>
                    <option value="51-100">51-100</option>
                    <option value="100+">100+</option>
                  </select>
                  {errors.employeeCount && (
                    <p className="text-red-600 text-sm mt-1">{errors.employeeCount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Ingresos Mensuales *
                  </label>
                  <select
                    name="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.monthlyRevenue ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona rango</option>
                    <option value="0-10k">$0 - $10K</option>
                    <option value="10k-50k">$10K - $50K</option>
                    <option value="50k-100k">$50K - $100K</option>
                    <option value="100k-500k">$100K - $500K</option>
                    <option value="500k+">$500K+</option>
                  </select>
                  {errors.monthlyRevenue && (
                    <p className="text-red-600 text-sm mt-1">{errors.monthlyRevenue}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Etapa del Negocio *
                  </label>
                  <select
                    name="businessStage"
                    value={formData.businessStage}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.businessStage ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona etapa</option>
                    <option value="startup">Startup</option>
                    <option value="growth">En Crecimiento</option>
                    <option value="established">Establecida</option>
                    <option value="scale">Escalando</option>
                  </select>
                  {errors.businessStage && (
                    <p className="text-red-600 text-sm mt-1">{errors.businessStage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detalles de Financiamiento */}
            <div className="mb-12 pb-12 border-b border-border/40">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Detalles de Financiamiento
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tipo de Financiamiento *
                  </label>
                  <select
                    name="financingType"
                    value={formData.financingType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.financingType ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona tipo</option>
                    <option value="capital-trabajo">Capital de Trabajo</option>
                    <option value="bonos-corporativos">Bonos Corporativos</option>
                    <option value="deuda-privada">Deuda Privada</option>
                    <option value="fondos-inversion">Fondos de Inversión</option>
                  </select>
                  {errors.financingType && (
                    <p className="text-red-600 text-sm mt-1">{errors.financingType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Monto de Financiamiento Solicitado ($) *
                  </label>
                  <input
                    type="number"
                    name="financingAmount"
                    value={formData.financingAmount}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.financingAmount ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Ej: 50000"
                    min="0"
                  />
                  {errors.financingAmount && (
                    <p className="text-red-600 text-sm mt-1">{errors.financingAmount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    <p>Propósito del Financiamiento *</p>
                  </label>
                  <select
                    name="financingPurpose"
                    value={formData.financingPurpose}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.financingPurpose ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona propósito</option>
                    <option value="expansion">Expansión</option>
                    <option value="marketing">Marketing</option>
                    <option value="product">Desarrollo de Producto</option>
                    <option value="inventory">Inventario</option>
                    <option value="operations">Operaciones</option>
                    <option value="other">Otro</option>
                  </select>
                  {errors.financingPurpose && (
                    <p className="text-red-600 text-sm mt-1">{errors.financingPurpose}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Información de Contacto
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.firstName ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Juan"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.lastName ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="Pérez"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
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
                    disabled={isLoggedIn}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-blue-50`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.phone ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                    placeholder="+569 0000 0000"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-border/40 focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm text-foreground/70">
                  Acepto los{" "}
                  <a href="/terminos-servicio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    Términos de Servicio
                  </a>{" "}
                  y la{" "}
                  <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    Política de Privacidad
                  </a>{" "}
                  *
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-600 text-sm mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isLoggedIn}
              className="w-full px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Simulando..." : "Simular Financiamiento"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
