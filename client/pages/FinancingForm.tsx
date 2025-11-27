import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowRight, AlertCircle, CheckCircle, TrendingUp, Zap } from "lucide-react";
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
  financingSubtype: string;
  financingTerm: string;
  financingTermCustom: string;
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
  monthlyInterestRate: number;
  plazo: number;
  clpAmount: number;
  financingCostPercentage: number;
  benefitCostPercentage: number;
  benefitRate: number;
  financedAmount: number;
  commissionAmount: number;
  benefitRateAmount: number;
  totalFinancingAmount: number;
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
    financingSubtype: "",
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
  const [simulationInputs, setSimulationInputs] = useState({
    clpAmount: 0,
    plazo: 30,
    monthlyInterestRate: 1.5,
    benefitRate: 3.75,
  });

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

  const calculateSimulation = (inputs?: typeof simulationInputs): SimulationResults => {
    const currentInputs = inputs || simulationInputs;
    const requestedAmount = Number(formData.financingAmount) || 0;

    const foundedYear = Number(formData.foundedYear);
    const yearsInBusiness = isFinite(foundedYear) && foundedYear > 0 ? new Date().getFullYear() - foundedYear : 0;
    const ageScore = Math.min(yearsInBusiness / 10, 1);

    const revenueMap: Record<string, number> = {
      "0-10k": 5000000,
      "10k-50k": 30000000,
      "50k-100k": 75000000,
      "100k-500k": 300000000,
      "500k-1000k": 750000000,
      "1000k-5000k": 3000000000,
      "5000k+": 7500000000,
    };
    const monthlyRevenue = revenueMap[formData.monthlyRevenue] || 30000;
    const debtRatio = requestedAmount / (monthlyRevenue * 12);
    const debtScore = Math.max(1 - debtRatio / 2, 0);

    const stageScores: Record<string, number> = {
      "startup": 0.6,
      "growth": 0.8,
      "established": 0.95,
      "scale": 1.0,
      "large": 1.0,
    };
    const stageScore = stageScores[formData.businessStage] || 0.7;

    const employeeMap: Record<string, number> = {
      "1-5": 0.6,
      "6-20": 0.75,
      "21-50": 0.85,
      "51-100": 0.93,
      "100+": 1.0,
    };
    const employeeScore = employeeMap[formData.employeeCount] || 0.6;

    const approvalChance = Math.round((ageScore * 0.2 + debtScore * 0.3 + stageScore * 0.25 + employeeScore * 0.25) * 100);

    const suggestedAmount = Math.round(requestedAmount * (approvalChance / 100));

    let interestRate = 8;
    if (approvalChance >= 80) interestRate = 5;
    else if (approvalChance >= 60) interestRate = 7;
    else if (approvalChance >= 40) interestRate = 10;

    let riskLevel = "Alto";
    if (approvalChance >= 80) riskLevel = "Bajo";
    else if (approvalChance >= 60) riskLevel = "Medio";

    let recommendation = "Necesitas fortalecer tu solicitud. Considera aumentar ingresos o reducir el monto.";
    if (approvalChance >= 80) recommendation = "Excelente perfil. Tu solicitud tiene alta probabilidad de aprobación.";
    else if (approvalChance >= 60) recommendation = "Buen perfil. Tu solicitud puede ser aprobada con condiciones ajustadas.";

    // Calculate financing cost based on monthly interest rate
    const financingCostPercentage = currentInputs.monthlyInterestRate;

    // Calculate benefit cost based on risk level (3-5%)
    let benefitCostPercentage = 3;
    if (riskLevel === "Medio") benefitCostPercentage = 4;
    else if (riskLevel === "Alto") benefitCostPercentage = 5;

    // Financed amount uses the CLP amount from simulation inputs, or defaults to the requested amount
    const clpAmountValue = currentInputs.clpAmount > 0 ? currentInputs.clpAmount : requestedAmount;

    // Calculate commission: (amount × monthly interest rate × number of months) / 100
    // Number of months = plazo / 30
    const numberOfMonths = currentInputs.plazo / 30;
    const commissionAmount = Math.round(
      (clpAmountValue * currentInputs.monthlyInterestRate * numberOfMonths) / 100
    );

    // Calculate benefit rate amount: amount × benefit rate / 100
    const benefitRateAmount = Math.round(
      (clpAmountValue * currentInputs.benefitRate) / 100
    );

    // Net financing amount: base amount - commission - benefit rate
    const netFinancingAmount = clpAmountValue - commissionAmount - benefitRateAmount;

    // Suggested amount: always 80% of total financing amount (net)
    const calculatedSuggestedAmount = Math.round(netFinancingAmount * 0.8);

    return {
      requestedAmount,
      estimatedApprovalChance: approvalChance,
      suggestedAmount: calculatedSuggestedAmount,
      estimatedDuration: "5-7 días hábiles",
      interestRate,
      riskLevel,
      recommendation,
      monthlyInterestRate: currentInputs.monthlyInterestRate,
      plazo: currentInputs.plazo,
      clpAmount: clpAmountValue,
      financingCostPercentage,
      benefitCostPercentage,
      benefitRate: currentInputs.benefitRate,
      financedAmount: clpAmountValue,
      commissionAmount,
      benefitRateAmount,
      totalFinancingAmount: netFinancingAmount,
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
      // Initialize simulation inputs with the financing amount if not already set
      const initialClpAmount = parseFloat(formData.financingAmount);
      const currentInputs = simulationInputs.clpAmount === 0
        ? {
            ...simulationInputs,
            clpAmount: initialClpAmount,
          }
        : simulationInputs;

      // Calculate with the initialized inputs
      const results = calculateSimulation(currentInputs);
      setSimulationInputs(currentInputs);
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
        financingSubtype: formData.financingSubtype,
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
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (showSimulation && simulationResults) {
    const handleSimulationInputChange = (field: string, value: any) => {
      const newInputs = {
        ...simulationInputs,
        [field]: value,
      };
      setSimulationInputs(newInputs);
      // Recalculate simulation with new values
      const newResults = calculateSimulation(newInputs);
      setSimulationResults(newResults);
    };

    return (
      <Layout>
        <div className="bg-blue-50 px-8 pb-12" style={{ paddingTop: "120px" }}>
          <div className="container max-w-5xl mx-auto">
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
                Simula tu primer financiamiento
              </h1>
              <p className="text-xl text-foreground/70 mb-8">
                Resumen de tu evaluación preliminar
              </p>

              {/* Simulation Input Section */}
              <div className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Configurar Simulación
                </h2>

                {/* CLP Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Monto de que quieres adelantar CLP $
                  </label>
                  <input
                    type="number"
                    value={simulationInputs.clpAmount}
                    onChange={(e) =>
                      handleSimulationInputChange("clpAmount", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="100000000"
                    min="0"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Ingresa el monto que deseas financiar
                  </p>
                </div>

                {/* Plazo Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Plazo de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 30, label: "30 días" },
                      { value: 60, label: "60 días" },
                      { value: 90, label: "90 días" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleSimulationInputChange("plazo", option.value)
                        }
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          simulationInputs.plazo === option.value
                            ? "bg-primary text-white"
                            : "bg-white border border-border/40 text-foreground hover:border-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tasa de Interés Mensual: {simulationInputs.monthlyInterestRate.toFixed(2)}%
                  </label>
                  <p className="text-xs text-foreground/60 mb-3">Rango: 0.5% a 3%</p>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={simulationInputs.monthlyInterestRate}
                    onChange={(e) =>
                      handleSimulationInputChange(
                        "monthlyInterestRate",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-foreground/60 mt-2">
                    <span>0.5%</span>
                    <span>3%</span>
                  </div>
                </div>

                {/* Benefit Rate Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tasa de Beneficio Aportante: {simulationInputs.benefitRate.toFixed(2)}%
                  </label>
                  <p className="text-xs text-foreground/60 mb-3">Rango: 2.5% a 5%</p>
                  <input
                    type="range"
                    min="2.5"
                    max="5"
                    step="0.1"
                    value={simulationInputs.benefitRate}
                    onChange={(e) =>
                      handleSimulationInputChange(
                        "benefitRate",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-foreground/60 mt-2">
                    <span>2.5%</span>
                    <span>5%</span>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  Resumen de Financiamiento
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Financing Calculation Breakdown */}
                  <div className="lg:col-span-2">
                    {/* Calculation Flow */}
                    <div className="space-y-4">
                      {/* Base Amount */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                        <div>
                          <p className="text-base font-semibold text-foreground/70">Monto a Financiar</p>
                          <p className="text-xs text-foreground/50 mt-1">Cantidad solicitada</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          <span className="text-black">$</span>
                          <span className="text-black">{simulationResults.clpAmount.toLocaleString()}</span>
                        </p>
                      </div>

                      {/* Minus Commission */}
                      <div className="flex items-center justify-center">
                        <div className="text-2xl font-bold text-foreground/30">−</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                        <div>
                          <p className="text-base font-semibold text-foreground/70">Comisión</p>
                          <p className="text-xs text-foreground/50 mt-1">{simulationResults.monthlyInterestRate.toFixed(2)}% × {simulationResults.plazo} días</p>
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                          ${simulationResults.commissionAmount.toLocaleString()}
                        </p>
                      </div>

                      {/* Minus Benefit Rate */}
                      <div className="flex items-center justify-center">
                        <div className="text-2xl font-bold text-foreground/30">−</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                        <div>
                          <p className="text-base font-semibold text-foreground/70">Tasas Beneficio</p>
                          <p className="text-xs text-foreground/50 mt-1">{simulationResults.benefitRate.toFixed(2)}% aportante</p>
                        </div>
                        <p className="text-2xl font-bold text-red-600">
                          ${simulationResults.benefitRateAmount.toLocaleString()}
                        </p>
                      </div>

                      {/* Equals Total */}
                      <div className="flex items-center justify-center pt-2">
                        <div className="w-full h-0.5 bg-foreground/20"></div>
                      </div>

                      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300 shadow-md">
                        <div>
                          <p className="text-sm font-bold text-foreground/70">Total a Financiar</p>
                          <p className="text-xs text-foreground/50 mt-1">Monto neto a desembolsar</p>
                        </div>
                        <p className="text-3xl font-bold text-green-700">
                          ${simulationResults.totalFinancingAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Key Metrics */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="p-5 bg-white rounded-lg border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-foreground/60 uppercase mb-3">Nivel de Riesgo</p>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                        simulationResults.riskLevel === "Bajo"
                          ? "bg-green-100 text-green-700"
                          : simulationResults.riskLevel === "Medio"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          simulationResults.riskLevel === "Bajo"
                            ? "bg-green-700"
                            : simulationResults.riskLevel === "Medio"
                              ? "bg-yellow-700"
                              : "bg-red-700"
                        }`}></span>
                        {simulationResults.riskLevel}
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-lg border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-foreground/60 uppercase mb-3">Plazo</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-bold text-foreground">
                          {simulationResults.plazo}
                        </p>
                        <p className="text-sm text-foreground/60">días</p>
                      </div>
                    </div>

                    <div className="p-5 bg-white rounded-lg border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-foreground/60 uppercase mb-3">Tasa APY</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-bold text-foreground">
                          {simulationResults.interestRate}
                        </p>
                        <p className="text-sm text-foreground/60">%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <p className="text-base text-foreground/60">Probabilidad de Aprobación</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">
                      {simulationResults.estimatedApprovalChance}%
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      <p className="text-base text-foreground/60">Monto Sugerido (80%)</p>
                    </div>
                    <p className="text-3xl font-bold text-green-700">
                      ${simulationResults.suggestedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation Section */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Recomendación
                </h3>
                <p className="text-foreground/70">
                  {simulationResults.recommendation}
                </p>
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
                    <option value="manufacturing">Manufactura</option>
                    <option value="agriculture">Agricultura</option>
                    <option value="construction">Construcción</option>
                    <option value="logistics">Logística</option>
                    <option value="tourism">Turismo</option>
                    <option value="education">Educación</option>
                    <option value="real-estate">Inmobiliaria</option>
                    <option value="finance">Finanzas</option>
                    <option value="media">Medios y Comunicación</option>
                    <option value="energy">Energía</option>
                    <option value="utilities">Utilidades</option>
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
                    <option value="0-10k">CLP $0 - CLP $10.000.000</option>
                    <option value="10k-50k">CLP $10.000.000 - CLP $50.000.000</option>
                    <option value="50k-100k">CLP $50.000.000 - CLP $100.000.000</option>
                    <option value="100k-500k">CLP $100.000.000 - CLP $500.000.000</option>
                    <option value="500k-1000k">CLP $500.000.000 - CLP $1.000.000.000</option>
                    <option value="1000k-5000k">CLP $1.000.000.000 - CLP $5.000.000.000</option>
                    <option value="5000k+">CLP $5.000.000.000+</option>
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
                    <option value="large">Gran Empresa</option>
                  </select>
                  {errors.businessStage && (
                    <p className="text-red-600 text-sm mt-1">{errors.businessStage}</p>
                  )}
                </div>
              </div>
            </div>

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

              {formData.financingType && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Subtipo de Financiamiento *
                  </label>
                  <select
                    name="financingSubtype"
                    value={formData.financingSubtype}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.financingSubtype ? "border-red-500" : "border-border/40"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30`}
                  >
                    <option value="">Selecciona subtipo</option>
                    {formData.financingType === "capital-trabajo" && (
                      <>
                        <option value="anticipo-factura">Anticipo de Factura (Factoring)</option>
                        <option value="anticipo-proveedor">Anticipo a Proveedor (Confirming)</option>
                      </>
                    )}
                    {formData.financingType === "bonos-corporativos" && (
                      <>
                        <option value="bonos-privados">Bonos Privados Empresas</option>
                        <option value="bonos-verdes">Bonos Verdes Privados</option>
                      </>
                    )}
                    {formData.financingType === "deuda-privada" && (
                      <>
                        <option value="credito-corto">Crédito Corto Plazo</option>
                        <option value="credito-largo">Crédito Largo Plazo</option>
                        <option value="credito-garantia">Créditos con Garantía</option>
                      </>
                    )}
                  </select>
                  {errors.financingSubtype && (
                    <p className="text-red-600 text-sm mt-1">{errors.financingSubtype}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Propósito del Financiamiento *
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
                    <p>Teléfono *</p>
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

            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-border/40 focus:ring-2 focus:ring-primary/30"
                />
                <span style={{ display: "flex", flexDirection: "row", overflow: "auto" }} className="text-sm text-foreground/70">
                  Acepto los{" "}
                  <a href="/terminos-servicio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    <p>Términos de Servicio</p>
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
