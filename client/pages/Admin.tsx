import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { RichTextEditor, RichTextEditor as PolicyRichTextEditor } from "@/components/RichTextEditor";
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from "@/lib/teamManager";
import { getJobs, addJob, updateJob, deleteJob, type Job } from "@/lib/jobsManager";
import { type Candidatura } from "@/components/CandidaturaForm";
import { getArticles, addArticle, updateArticle, deleteArticle, type BlogArticle } from "@/lib/blogManager";
import { getEducacionCards, addEducacionCard, updateEducacionCard, deleteEducacionCard, type EducacionCard } from "@/lib/educacionManager";
import { getSmartContracts, deleteSmartContract, type SmartContract } from "@/lib/smartContractManager";
import { getSTOs, addSTO, updateSTO, deleteSTO, checkSTOAvailableForAsset, updateTokenosSoldCount, type STO } from "@/lib/stoManager";
import { getMarketStats, getTotalPendingAssetsValue, getPendingListingsCount } from "@/lib/mercadoSecundarioManager";
import { getFinancingRequests, updateRequestStatus, deleteFinancingRequest, updateEvaluacionComercial, type FinancingRequest, type EvaluacionComercial } from "@/lib/financingRequestManager";
import SmartContractWizardSection from "@/components/SmartContractWizardSection";
import STOWizardSection from "@/components/STOWizardSection";
import {
  LayoutDashboard,
  Coins,
  FileText,
  BookOpen,
  Users,
  Clock,
  Mail,
  Briefcase,
  Users2,
  Building2,
  Shield,
  AlertCircle,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Search,
  LogOut,
  MessageSquare,
  Eye,
  Zap,
  TrendingUp,
  DollarSign,
} from "lucide-react";

type AdminSection =
  | "dashboard"
  | "activos"
  | "smart-contract-wizard"
  | "sto"
  | "sto-wizard"
  | "blog"
  | "educacion"
  | "usuarios"
  | "mensajes"
  | "empleos"
  | "equipo"
  | "socios"
  | "politicas"
  | "denuncias"
  | "reclamos"
  | "solicitudes-financiamiento";

interface Denuncia {
  id: string;
  nombre: string;
  email: string;
  detalles: string;
  anonimo: boolean;
  fecha: string;
  estado: string;
}

interface Reclamo {
  id: string;
  nombre: string;
  email: string;
  detalles: string;
  anonimo: boolean;
  fecha: string;
  estado: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamForm, setTeamForm] = useState({
    nombre: "",
    rol: "",
    departamento: "",
    bio: "",
    foto: "",
  });
  const [teamPhoto, setTeamPhoto] = useState<File | null>(null);

  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);
  const [mensajesContacto, setMensajesContacto] = useState<any[]>([]);
  const [policies, setPolicies] = useState({
    privacidad: localStorage.getItem("politica_privacidad") || "",
    terminos: localStorage.getItem("politica_terminos") || "",
    cookies: localStorage.getItem("politica_cookies") || "",
  });
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  const [policyContent, setPolicyContent] = useState("");
  const [editingTokensSoldId, setEditingTokensSoldId] = useState<string | null>(null);
  const [editingTokensSoldValue, setEditingTokensSoldValue] = useState("");

  useEffect(() => {
    setTeamMembers(getTeamMembers());
    setDenuncias(JSON.parse(localStorage.getItem("denuncias") || "[]"));
    setReclamos(JSON.parse(localStorage.getItem("reclamos") || "[]"));
    setMensajesContacto(JSON.parse(localStorage.getItem("mensajesContacto") || "[]"));
  }, []);

  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTeamForm((prev) => ({
          ...prev,
          foto: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setTeamPhoto(file);
    }
  };

  const handleTeamFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamMember) {
      updateTeamMember(editingTeamMember.id, teamForm);
    } else {
      addTeamMember(teamForm);
    }
    setTeamMembers(getTeamMembers());
    setTeamForm({ nombre: "", rol: "", departamento: "", bio: "", foto: "" });
    setTeamPhoto(null);
    setEditingTeamMember(null);
    setShowTeamForm(false);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setShowTeamForm(true);
    setTeamForm({
      nombre: member.nombre,
      rol: member.rol,
      departamento: member.departamento,
      bio: member.bio || "",
      foto: member.foto || "",
    });
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este miembro del equipo?")) {
      deleteTeamMember(id);
      setTeamMembers(getTeamMembers());
    }
  };

  const handleUpdateDenunciaStatus = (id: string, nuevoEstado: string) => {
    const updated = denuncias.map((d) =>
      d.id === id ? { ...d, estado: nuevoEstado } : d
    );
    setDenuncias(updated);
    localStorage.setItem("denuncias", JSON.stringify(updated));
  };

  const handleDeleteDenuncia = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar esta denuncia?")) {
      const updated = denuncias.filter((d) => d.id !== id);
      setDenuncias(updated);
      localStorage.setItem("denuncias", JSON.stringify(updated));
    }
  };

  const handleUpdateReclamoStatus = (id: string, nuevoEstado: string) => {
    const updated = reclamos.map((r) =>
      r.id === id ? { ...r, estado: nuevoEstado } : r
    );
    setReclamos(updated);
    localStorage.setItem("reclamos", JSON.stringify(updated));
  };

  const handleDeleteReclamo = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este reclamo?")) {
      const updated = reclamos.filter((r) => r.id !== id);
      setReclamos(updated);
      localStorage.setItem("reclamos", JSON.stringify(updated));
    }
  };

  const handleUpdateMensajeStatus = (id: string, nuevoEstado: string) => {
    const updated = mensajesContacto.map((m) =>
      m.id === id ? { ...m, estado: nuevoEstado } : m
    );
    setMensajesContacto(updated);
    localStorage.setItem("mensajesContacto", JSON.stringify(updated));
  };

  const handleDeleteMensaje = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este mensaje?")) {
      const updated = mensajesContacto.filter((m) => m.id !== id);
      setMensajesContacto(updated);
      localStorage.setItem("mensajesContacto", JSON.stringify(updated));
    }
  };

  const handleUpdateTokenosSold = (stoId: string, tokensValue: string) => {
    updateTokenosSoldCount(stoId, tokensValue);
    setSTOs(getSTOs());
    setEditingTokensSoldId(null);
    setEditingTokensSoldValue("");
  };

  const handleEditPolicy = (policyKey: string) => {
    setEditingPolicy(policyKey);
    setPolicyContent(policies[policyKey as keyof typeof policies]);
  };

  const handleSavePolicy = () => {
    if (!editingPolicy) return;

    const key = `politica_${editingPolicy === "privacidad" ? "privacidad" : editingPolicy === "terminos" ? "terminos" : "cookies"}`;
    localStorage.setItem(key, policyContent);
    setPolicies((prev) => ({
      ...prev,
      [editingPolicy]: policyContent,
    }));
    setEditingPolicy(null);
    setPolicyContent("");
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    titulo: "",
    departamento: "",
    ubicacion: "",
    tipo: "",
    descripcion: "",
    requisitos: "",
    beneficios: "",
    estado: "Abierto" as const,
  });

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      ...jobForm,
      requisitos: jobForm.requisitos.split("\n").filter((r) => r.trim()),
      beneficios: jobForm.beneficios.split("\n").filter((b) => b.trim()),
    };

    if (editingJob) {
      updateJob(editingJob.id, newJob);
    } else {
      addJob(newJob);
    }
    setJobs(getJobs());
    setJobForm({
      titulo: "",
      departamento: "",
      ubicacion: "",
      tipo: "",
      descripcion: "",
      requisitos: "",
      beneficios: "",
      estado: "Abierto",
    });
    setEditingJob(null);
    setShowJobForm(false);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
    setJobForm({
      titulo: job.titulo,
      departamento: job.departamento,
      ubicacion: job.ubicacion,
      tipo: job.tipo,
      descripcion: job.descripcion,
      requisitos: job.requisitos?.join("\n") || "",
      beneficios: job.beneficios?.join("\n") || "",
      estado: job.estado,
    });
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar esta posición?")) {
      deleteJob(id);
      setJobs(getJobs());
    }
  };

  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("candidaturas");
    if (stored) {
      setCandidaturas(JSON.parse(stored));
    }
  }, []);

  const handleDownloadCV = (candidatura: Candidatura) => {
    const link = document.createElement("a");
    link.href = candidatura.cvData;
    link.download = candidatura.cvFileName;
    link.click();
  };

  const handleDeleteCandidatura = (id: string) => {
    if (confirm("��Está seguro que desea eliminar esta candidatura?")) {
      const filtered = candidaturas.filter((c) => c.id !== id);
      setCandidaturas(filtered);
      localStorage.setItem("candidaturas", JSON.stringify(filtered));
    }
  };

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleForm, setArticleForm] = useState({
    titulo: "",
    contenido: "",
    resumen: "",
    categoria: "",
    estado: "Borrador" as const,
    imagen: "",
    fechaPublicacion: new Date().toISOString().split('T')[0],
  });
  const [articleImage, setArticleImage] = useState<File | null>(null);

  const [educacionCards, setEducacionCards] = useState<EducacionCard[]>([]);
  const [editingEducacionCard, setEditingEducacionCard] = useState<EducacionCard | null>(null);
  const [showEducacionForm, setShowEducacionForm] = useState(false);
  const [educacionForm, setEducacionForm] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    instructor: "",
    duracion: "",
    nivel: "Básico" as const,
    estado: "Borrador" as const,
    imagen: "",
  });
  const [educacionImage, setEducacionImage] = useState<File | null>(null);

  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [stos, setSTOs] = useState<STO[]>([]);
  const [selectedSTOCategory, setSelectedSTOCategory] = useState<string>("Todas");
  const [selectedActivoCategory, setSelectedActivoCategory] = useState<string>("Todas");
  const [financingRequests, setFinancingRequests] = useState<FinancingRequest[]>([]);
  const [selectedFinancingStatus, setSelectedFinancingStatus] = useState<string>("Pendiente");
  const [financingNotes, setFinancingNotes] = useState<Record<string, string>>({});
  const [editingSTO, setEditingSTO] = useState<STO | null>(null);
  const [stoForm, setStoForm] = useState({
    activoDigitalId: "",
    nombreActivo: "",
    simboloActivo: "",
    estado: "Pendiente" as const,
    tipoSTO: "Equity" as const,
    numerosTokensVenta: "",
    precioPorToken: "",
    fechaInicio: "",
    fechaFin: "",
    montoMinimoRecaudacion: "",
    montoMaximoRecaudacion: "",
    montoMinimoInversion: "",
    montoMaximoInversion: "",
    descripcion: "",
  });

  useEffect(() => {
    setArticles(getArticles());
    setEducacionCards(getEducacionCards());
    setSmartContracts(getSmartContracts());
    setSTOs(getSTOs());
    setFinancingRequests(getFinancingRequests());
  }, []);

  const handleArticleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArticleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es demasiado grande. Máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setArticleForm((prev) => ({
          ...prev,
          imagen: event.target?.result as string,
        }));
        setArticleImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArticleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.titulo || !articleForm.contenido) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    const articleData = {
      ...articleForm,
      fechaPublicacion: articleForm.fechaPublicacion ? new Date(articleForm.fechaPublicacion).toISOString() : new Date().toISOString(),
    };

    if (editingArticle) {
      updateArticle(editingArticle.id, articleData);
    } else {
      addArticle(articleData);
    }
    setArticles(getArticles());
    setArticleForm({
      titulo: "",
      contenido: "",
      resumen: "",
      categoria: "",
      estado: "Borrador",
      imagen: "",
      fechaPublicacion: new Date().toISOString().split('T')[0],
    });
    setArticleImage(null);
    setEditingArticle(null);
    setShowArticleForm(false);
  };

  const handleEditArticle = (article: BlogArticle) => {
    setEditingArticle(article);
    setShowArticleForm(true);
    setArticleForm({
      titulo: article.titulo,
      contenido: article.contenido,
      resumen: article.resumen || "",
      categoria: article.categoria || "",
      estado: article.estado,
      imagen: article.imagen || "",
      fechaPublicacion: article.fechaPublicacion ? article.fechaPublicacion.split('T')[0] : new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este artículo?")) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const handleEducacionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEducacionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducacionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEducacionForm((prev) => ({
          ...prev,
          imagen: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setEducacionImage(file);
    }
  };

  const handleEducacionFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!educacionForm.titulo || !educacionForm.descripcion || !educacionForm.contenido || !educacionForm.instructor) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    const educacionData = {
      ...educacionForm,
      nivel: educacionForm.nivel as "Básico" | "Intermedio" | "Avanzado",
    };

    if (editingEducacionCard) {
      updateEducacionCard(editingEducacionCard.id, educacionData);
    } else {
      addEducacionCard(educacionData);
    }
    setEducacionCards(getEducacionCards());
    setEducacionForm({
      titulo: "",
      descripcion: "",
      contenido: "",
      instructor: "",
      duracion: "",
      nivel: "Básico",
      estado: "Borrador",
      imagen: "",
    });
    setEducacionImage(null);
    setEditingEducacionCard(null);
    setShowEducacionForm(false);
  };

  const handleEditEducacionCard = (card: EducacionCard) => {
    setEditingEducacionCard(card);
    setShowEducacionForm(true);
    setEducacionForm({
      titulo: card.titulo,
      descripcion: card.descripcion,
      contenido: card.contenido,
      instructor: card.instructor,
      duracion: card.duracion || "",
      nivel: card.nivel || "Básico",
      estado: card.estado,
      imagen: card.imagen || "",
    });
  };

  const handleDeleteEducacionCard = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este curso?")) {
      deleteEducacionCard(id);
      setEducacionCards(getEducacionCards());
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Panel", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "activos", label: "Activos Digitales", icon: <Coins className="w-5 h-5" /> },
    { id: "sto", label: "STOs", icon: <FileText className="w-5 h-5" /> },
    { id: "solicitudes-financiamiento", label: "Solicitudes de Financiamiento", icon: <DollarSign className="w-5 h-5" /> },
    { id: "blog", label: "Artículos y Noticias", icon: <Briefcase className="w-5 h-5" /> },
    { id: "educacion", label: "Educación", icon: <BookOpen className="w-5 h-5" /> },
    { id: "usuarios", label: "Usuarios", icon: <Users className="w-5 h-5" /> },
    { id: "mensajes", label: "Mensajes de Contacto", icon: <Mail className="w-5 h-5" /> },
    { id: "empleos", label: "Empleos", icon: <Briefcase className="w-5 h-5" /> },
    { id: "candidaturas", label: "Candidaturas", icon: <FileText className="w-5 h-5" /> },
    { id: "equipo", label: "Equipo", icon: <Users2 className="w-5 h-5" /> },
    { id: "socios", label: "Socios del Ecosistema", icon: <Building2 className="w-5 h-5" /> },
    { id: "politicas", label: "Políticas", icon: <Shield className="w-5 h-5" /> },
    { id: "denuncias", label: "Denuncias y Reclamos", icon: <AlertCircle className="w-5 h-5" /> },
  ] as const;

  const handleLogout = () => {
    navigate("/");
  };

  // Sample data for different sections
  const [items, setItems] = useState({
    activos: [
      { id: 1, nombre: "Bitcoin Token", cantidad: 100, estado: "Activo" },
      { id: 2, nombre: "Ethereum Token", cantidad: 50, estado: "Activo" },
    ],
    sto: [
      { id: 1, nombre: "STO Proyecto A", monto: "$1,000,000", estado: "En Oferta" },
      { id: 2, nombre: "STO Proyecto B", monto: "$500,000", estado: "Completado" },
    ],
    blog: [
      { id: 1, titulo: "Cómo invertir en STOs", autor: "Admin", fecha: "2024-01-15", estado: "Publicado" },
      { id: 2, titulo: "Guía de Activos Digitales", autor: "Admin", fecha: "2024-01-14", estado: "Borrador" },
    ],
    educacion: [
      { id: 1, titulo: "Introducción a Blockchain", instructor: "Carlos", estudiantes: 120, estado: "Activo" },
      { id: 2, titulo: "DeFi Avanzado", instructor: "María", estudiantes: 45, estado: "Activo" },
    ],
    usuarios: [
      { id: 1, nombre: "Juan Pérez", email: "juan@example.com", tipo: "Persona", estado: "Activo" },
      { id: 2, nombre: "Tech Corp", email: "contact@techcorp.com", tipo: "Empresa", estado: "Activo" },
    ],
    mensajes: [
      { id: 1, nombre: "Carlos", email: "carlos@example.com", asunto: "Consulta sobre STOs", leido: false },
      { id: 2, nombre: "Ana", email: "ana@example.com", asunto: "Solicitud de Información", leido: true },
    ],
    equipo: [
      { id: 1, nombre: "Carlos González", rol: "CEO", departamento: "Directiva" },
      { id: 2, nombre: "María López", rol: "CTO", departamento: "Tech" },
    ],
    socios: [
      { id: 1, nombre: "Blockchain Partners", categoria: "Tecnología", estado: "Activo" },
      { id: 2, nombre: "Finance Solutions", categoria: "Finanzas", estado: "Activo" },
    ],
  });

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        const totalUsers = candidaturas.length;
        const activeStos = stos.filter((s) => s.estado === "Activo" || s.estado === "Pendiente").length;
        const totalAssets = smartContracts.length;
        const pendingMessages = mensajesContacto.length;
        const completedStos = stos.filter((s) => s.estado === "Cerrado").length;

        // Calculate total traded amount from secondary market
        const marketStats = getMarketStats();
        const totalTraded = marketStats.totalVolumeTraded;

        // Calculate total target value from all STO financing offers (máximo a conseguir)
        const totalAssetTarget = stos.reduce((sum, sto) => {
          const amount = parseFloat(sto.montoMinimoRecaudacion || "0");
          return sum + amount;
        }, 0);

        // Calculate total pending assets count (ofertas no vendidas)
        const totalPendingAssets = getPendingListingsCount();

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">STOs Activos</p>
                    <p className="text-3xl font-bold text-foreground">{activeStos}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Activos Digitales</p>
                    <p className="text-3xl font-bold text-foreground">{totalAssets}</p>
                  </div>
                  <Coins className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Mensajes Pendientes</p>
                    <p className="text-3xl font-bold text-foreground">{pendingMessages}</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Total Transado</p>
                    <p className="text-3xl font-bold text-foreground">${totalTraded.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Valor Total de Activos</p>
                    <p className="text-3xl font-bold text-foreground">${totalAssetTarget.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Total Activos Pendientes</p>
                    <p className="text-3xl font-bold text-foreground">{totalPendingAssets}</p>
                  </div>
                  <Clock className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Estadísticas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">STOs Completados</p>
                  <p className="font-bold text-foreground">{completedStos}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Mensajes Totales</p>
                  <p className="font-bold text-foreground">{pendingMessages}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Equipo</p>
                  <p className="font-bold text-foreground">{teamMembers.length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Posiciones de Empleo</p>
                  <p className="font-bold text-foreground">{jobs.length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Candidaturas</p>
                  <p className="font-bold text-foreground">{totalUsers}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Cursos de Educación</p>
                  <p className="font-bold text-foreground">{educacionCards.length}</p>
                </div>
                <div className="border-t border-border/20 pt-4 mt-4 flex items-center justify-between">
                  <p className="text-foreground/70">Total Transado</p>
                  <p className="font-bold text-foreground">${totalTraded.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Valor Total de Activos</p>
                  <p className="font-bold text-foreground">${totalAssetTarget.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Total Activos Pendientes</p>
                  <p className="font-bold text-foreground">{totalPendingAssets}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "smart-contract-wizard":
        return <SmartContractWizardSection setActiveSection={setActiveSection} onContractCreated={() => setSmartContracts(getSmartContracts())} />;

      case "activos":
        const filteredSmartContracts = selectedActivoCategory === "Todas"
          ? smartContracts
          : smartContracts.filter((contract) => contract.categoria === selectedActivoCategory);

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Activos Digitales</h2>
              <button
                onClick={() => setActiveSection("smart-contract-wizard")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Zap className="w-5 h-5" />
                Crear Smart Contract
              </button>
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-6">
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Buscar activos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {["Todas", "Capital de trabajo", "Bonos Corporativos", "Deuda Privada"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedActivoCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      selectedActivoCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {smartContracts && smartContracts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Nombre / Símbolo</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Dirección del Contrato</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Blockchain</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Categoría</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Fecha de Creación</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Estado</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSmartContracts.map((contract) => (
                        <tr key={contract.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{contract.nombre}</p>
                              <p className="text-xs text-foreground/60">{contract.simbolo}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground/60 font-mono text-xs max-w-xs overflow-hidden text-ellipsis">
                            {contract.direccion}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {contract.blockchain}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              {contract.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground/60">
                            {new Date(contract.fechaCreacion).toLocaleDateString("es-ES")}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                contract.estado === "Activo"
                                  ? "bg-green-100 text-green-700"
                                  : contract.estado === "Pausado"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {contract.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const contractInfo = `Nombre: ${contract.nombre}\nSímbolo: ${contract.simbolo}\nDirección: ${contract.direccion}\nBlockchain: ${contract.blockchain}\nCategoría: ${contract.categoria}\nEstado: ${contract.estado}\nFecha: ${new Date(contract.fechaCreacion).toLocaleDateString("es-ES")}`;
                                  alert(contractInfo);
                                }}
                                className="p-2 hover:bg-secondary rounded transition-colors"
                                title="Ver detalles">
                                <Eye className="w-4 h-4 text-foreground/60 hover:text-primary" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de que deseas eliminar ${contract.nombre}?`)) {
                                    deleteSmartContract(contract.id);
                                    setSmartContracts(getSmartContracts());
                                  }
                                }}
                                className="p-2 hover:bg-secondary rounded transition-colors"
                                title="Eliminar contrato">
                                <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Coins className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                  <p className="text-foreground/60 mb-4">No hay activos digitales creados aún.</p>
                  <button
                    onClick={() => setActiveSection("smart-contract-wizard")}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    <Zap className="w-4 h-4" />
                    Crear tu primer activo
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "sto-wizard":
        return (
          <STOWizardSection
            setActiveSection={setActiveSection}
            onSTOCreated={() => setSTOs(getSTOs())}
            smartContracts={smartContracts}
            editingSTO={editingSTO}
          />
        );

      case "sto":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">STOs</h2>
              <button
                onClick={() => {
                  setEditingSTO(null);
                  setActiveSection("sto-wizard");
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Crear Nuevo STO
              </button>
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">

              <div className="border-t border-border/40 pt-6 mt-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Ofertas Creadas</h3>

                {/* Category Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {["Todas", "Capital de trabajo", "Bonos Corporativos", "Deuda Privada"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedSTOCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        selectedSTOCategory === category
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-foreground hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {stos.length === 0 ? (
                  <p className="text-foreground/60 text-sm">No hay ofertas creadas aún.</p>
                ) : (
                  <div className="space-y-4">
                    {stos
                      .filter(
                        (sto) =>
                          selectedSTOCategory === "Todas" ||
                          smartContracts.find((c) => c.id === sto.activoDigitalId)?.categoria === selectedSTOCategory
                      )
                      .map((sto) => {
                      const contract = smartContracts.find((sc) => sc.id === sto.activoDigitalId);
                      return (
                        <div key={sto.id} className="bg-white border border-border/40 rounded-lg overflow-hidden hover:shadow-md transition-all">
                          <div className="p-4 bg-gradient-to-r from-primary/5 to-blue-50/50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-bold text-foreground">
                                  {sto.nombreActivo} ({sto.simboloActivo})
                                </h4>
                                <p className="text-xs text-foreground/60 mt-1">
                                  Tipo: {sto.tipoSTO} • Tokens: {sto.numerosTokensVenta} • Precio: ${sto.precioPorToken} USDC
                                </p>
                              </div>
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${
                                  sto.estado === "Activo"
                                    ? "bg-green-100 text-green-700"
                                    : sto.estado === "Pendiente"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : sto.estado === "Cerrado"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {sto.estado}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                              <div>
                                <p className="text-foreground/60">Período</p>
                                <p className="font-semibold text-foreground">
                                  {new Date(sto.fechaInicio).toLocaleDateString("es-ES")} - {new Date(sto.fechaFin).toLocaleDateString("es-ES")}
                                </p>
                              </div>
                              <div>
                                <p className="text-foreground/60">Meta Mínima</p>
                                <p className="font-semibold text-foreground">${sto.montoMinimoRecaudacion} USDC</p>
                              </div>
                              <div>
                                <p className="text-foreground/60">Meta Máxima</p>
                                <p className="font-semibold text-foreground">${sto.montoMaximoRecaudacion} USDC</p>
                              </div>
                              <div>
                                <p className="text-foreground/60">Rango de Inversión</p>
                                <p className="font-semibold text-foreground">
                                  ${sto.montoMinimoInversion} - ${sto.montoMaximoInversion}
                                </p>
                              </div>
                            </div>

                            {sto.descripcion && (
                              <p className="text-xs text-foreground/70 mb-3 p-2 bg-white/50 rounded">
                                {sto.descripcion}
                              </p>
                            )}

                            {/* Tokens Sold Progress */}
                            <div className="mt-3 p-2 bg-white/50 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-semibold text-foreground">Tokens Vendidos</p>
                                {editingTokensSoldId === sto.id ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="number"
                                      value={editingTokensSoldValue}
                                      onChange={(e) => setEditingTokensSoldValue(e.target.value)}
                                      max={sto.numerosTokensVenta}
                                      className="w-16 px-1 py-0.5 text-xs border border-border/40 rounded"
                                    />
                                    <button
                                      onClick={() => handleUpdateTokenosSold(sto.id, editingTokensSoldValue)}
                                      className="px-2 py-0.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => setEditingTokensSoldId(null)}
                                      className="px-2 py-0.5 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditingTokensSoldId(sto.id);
                                      setEditingTokensSoldValue(sto.tokenosVendidos || "0");
                                    }}
                                    className="text-xs text-foreground/60 hover:text-primary cursor-pointer"
                                  >
                                    {Math.round((parseFloat(sto.tokenosVendidos || "0") / parseFloat(sto.numerosTokensVenta || "1")) * 100)}% ({sto.tokenosVendidos || "0"} / {sto.numerosTokensVenta})
                                  </button>
                                )}
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                                  style={{ width: `${Math.min((parseFloat(sto.tokenosVendidos || "0") / parseFloat(sto.numerosTokensVenta || "1")) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {contract && contract.documentos && contract.documentos.length > 0 && (
                            <div className="px-4 py-3 bg-blue-50/50 border-t border-border/40">
                              <p className="text-xs font-semibold text-foreground mb-2">Documentos Adjuntos:</p>
                              <div className="flex flex-wrap gap-2">
                                {contract.documentos.map((doc) => (
                                  <a
                                    key={doc.id}
                                    href={doc.url}
                                    download={doc.nombre}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-border/40 rounded text-xs text-primary hover:bg-primary/5 transition-colors"
                                    title={doc.nombre}
                                  >
                                    <FileText className="w-3 h-3" />
                                    {doc.nombre.substring(0, 20)}...
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="px-4 py-3 bg-gray-50 border-t border-border/40 flex gap-2">
                            <button
                              onClick={() => {
                                setEditingSTO(sto);
                                setActiveSection("sto-wizard");
                              }}
                              className="p-2 hover:bg-white rounded transition-colors"
                            >
                              <Edit className="w-4 h-4 text-foreground/60 hover:text-primary" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Está seguro de que desea eliminar esta oferta de ${sto.nombreActivo}?`)) {
                                  deleteSTO(sto.id);
                                  setSTOs(getSTOs());
                                }
                              }}
                              className="p-2 hover:bg-white rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "solicitudes-financiamiento":
        const filteredFinancingRequests = selectedFinancingStatus === "Todas"
          ? financingRequests
          : financingRequests.filter((req) => req.status === selectedFinancingStatus);

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Solicitudes de Financiamiento</h2>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold text-sm">
                {financingRequests.length} solicitud{financingRequests.length !== 1 ? "es" : ""}
              </span>
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-6">
              <div className="mb-6 flex flex-wrap gap-2">
                {["Todas", "Pendiente", "Aprobado", "Rechazado"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedFinancingStatus(status)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      selectedFinancingStatus === status
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {financingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                  <p className="text-foreground/60">No hay solicitudes de financiamiento registradas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFinancingRequests.map((request) => (
                    <div key={request.id} className="border border-border/40 rounded-lg overflow-hidden hover:shadow-md transition-all">
                      <div className="p-4 bg-gradient-to-r from-primary/5 to-blue-50/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground">
                              {request.companyName}
                            </h4>
                            <p className="text-xs text-foreground/60 mt-1">
                              RUT: {request.rutEmpresa} • Contacto: {request.firstName} {request.lastName}
                            </p>
                            <p className="text-xs text-foreground/60 mt-1">
                              Email: {request.email} • Teléfono: {request.phone}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ml-2 ${
                              request.status === "Aprobado"
                                ? "bg-green-100 text-green-700"
                                : request.status === "Rechazado"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                          <div>
                            <p className="text-foreground/60">Industria</p>
                            <p className="font-semibold text-foreground capitalize">{request.industry}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Etapa del Negocio</p>
                            <p className="font-semibold text-foreground capitalize">{request.businessStage}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Monto Solicitado</p>
                            <p className="font-semibold text-foreground">${parseFloat(request.financingAmount).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Tipo de Financiamiento</p>
                            <p className="font-semibold text-foreground capitalize">{request.financingType.replace("-", " ")}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Propósito</p>
                            <p className="font-semibold text-foreground capitalize">{request.financingPurpose}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Empleados</p>
                            <p className="font-semibold text-foreground">{request.employeeCount}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Ingresos Mensuales</p>
                            <p className="font-semibold text-foreground">{request.monthlyRevenue}</p>
                          </div>
                          <div>
                            <p className="text-foreground/60">Solicitada</p>
                            <p className="font-semibold text-foreground text-xs">
                              {new Date(request.createdAt).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white border-t border-border/40">
                        <p className="text-xs font-semibold text-foreground mb-2">Notas / Comentarios</p>
                        <textarea
                          value={financingNotes[request.id] || request.notes || ""}
                          onChange={(e) =>
                            setFinancingNotes((prev) => ({
                              ...prev,
                              [request.id]: e.target.value,
                            }))
                          }
                          placeholder="Añade notas o comentarios sobre esta solicitud..."
                          className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                          rows={2}
                        />
                      </div>

                      <div className="p-4 bg-gray-50 border-t border-border/40 flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            updateRequestStatus(request.id, "Aprobado", financingNotes[request.id] || "");
                            setFinancingRequests(getFinancingRequests());
                            setFinancingNotes((prev) => {
                              const newNotes = { ...prev };
                              delete newNotes[request.id];
                              return newNotes;
                            });
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded text-sm font-semibold hover:bg-green-600 transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => {
                            updateRequestStatus(request.id, "Rechazado", financingNotes[request.id] || "");
                            setFinancingRequests(getFinancingRequests());
                            setFinancingNotes((prev) => {
                              const newNotes = { ...prev };
                              delete newNotes[request.id];
                              return newNotes;
                            });
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                          Rechazar
                        </button>
                        {request.status !== "Pendiente" && (
                          <button
                            onClick={() => {
                              updateRequestStatus(request.id, "Pendiente", "");
                              setFinancingRequests(getFinancingRequests());
                              setFinancingNotes((prev) => {
                                const newNotes = { ...prev };
                                delete newNotes[request.id];
                                return newNotes;
                              });
                            }}
                            className="px-4 py-2 bg-gray-400 text-white rounded text-sm font-semibold hover:bg-gray-500 transition-colors"
                          >
                            Devolver a Pendiente
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
                              deleteFinancingRequest(request.id);
                              setFinancingRequests(getFinancingRequests());
                              setFinancingNotes((prev) => {
                                const newNotes = { ...prev };
                                delete newNotes[request.id];
                                return newNotes;
                              });
                            }
                          }}
                          className="px-4 py-2 bg-gray-300 text-foreground rounded text-sm font-semibold hover:bg-gray-400 transition-colors ml-auto"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "usuarios":
      case "mensajes":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Mensajes de Contacto ({mensajesContacto.length})</h2>
            <div className="bg-white rounded-lg border border-border/40 p-6">
              {mensajesContacto.length === 0 ? (
                <p className="text-foreground/60">No hay mensajes registrados</p>
              ) : (
                <div className="space-y-4">
                  {mensajesContacto.map((mensaje) => (
                    <div key={mensaje.id} className="border border-border/40 rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{mensaje.nombre}</h4>
                          <p className="text-sm text-foreground/60">
                            Email: {mensaje.email} • Asunto: {mensaje.asunto} ��� {new Date(mensaje.fecha).toLocaleDateString('es-CL')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={mensaje.estado}
                            onChange={(e) => handleUpdateMensajeStatus(mensaje.id, e.target.value)}
                            className="px-3 py-1 border border-border/40 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            <option value="Nuevo">Nuevo</option>
                            <option value="Leído">Leído</option>
                            <option value="Respondido">Respondido</option>
                            <option value="Cerrado">Cerrado</option>
                          </select>
                          <button
                            onClick={() => handleDeleteMensaje(mensaje.id)}
                            className="p-2 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                        <p className="text-sm text-foreground">{mensaje.mensaje}</p>
                      </div>
                      <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        mensaje.estado === "Nuevo" ? "bg-red-100 text-red-700" :
                        mensaje.estado === "Leído" ? "bg-yellow-100 text-yellow-700" :
                        mensaje.estado === "Respondido" ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {mensaje.estado}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "educacion":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Educación Financiera</h2>
              {!showEducacionForm && !editingEducacionCard && (
                <button
                  onClick={() => setShowEducacionForm(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Crear Nuevo Curso
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">
              {(showEducacionForm || editingEducacionCard) && (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {editingEducacionCard ? "Editar Curso" : "Crear Nuevo Curso"}
                  </h3>
                  <form onSubmit={handleEducacionFormSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Título</label>
                    <input
                      type="text"
                      name="titulo"
                      value={educacionForm.titulo}
                      onChange={handleEducacionFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={educacionForm.instructor}
                      onChange={handleEducacionFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Duración</label>
                    <input
                      type="text"
                      name="duracion"
                      value={educacionForm.duracion}
                      onChange={handleEducacionFormChange}
                      placeholder="Ej: 4 semanas"
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Nivel</label>
                    <select
                      name="nivel"
                      value={educacionForm.nivel}
                      onChange={handleEducacionFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={educacionForm.descripcion}
                    onChange={handleEducacionFormChange}
                    rows={2}
                    placeholder="Descripción breve del curso"
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Contenido</label>
                  <RichTextEditor
                    value={educacionForm.contenido}
                    onChange={(value) => setEducacionForm((prev) => ({ ...prev, contenido: value }))}
                    placeholder="Ingresa el contenido del curso..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Estado</label>
                  <select
                    name="estado"
                    value={educacionForm.estado}
                    onChange={handleEducacionFormChange}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Imagen (opcional)</label>
                  <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleEducacionImageChange}
                      accept="image/*"
                      className="hidden"
                      id="educacion-image-input"
                    />
                    <label htmlFor="educacion-image-input" className="cursor-pointer block">
                      {educacionForm.imagen ? (
                        <div className="space-y-2">
                          <img
                            src={educacionForm.imagen}
                            alt="Preview"
                            className="w-32 h-32 object-cover mx-auto rounded-lg"
                          />
                          <p className="text-sm text-foreground/60">Haz clic para cambiar imagen</p>
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
                          <p className="text-foreground font-semibold">Haz clic para cargar imagen</p>
                          <p className="text-sm text-foreground/60">JPG, PNG, WebP (máx. 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                  >
                    {editingEducacionCard ? "Actualizar" : "Crear"}
                  </button>
                  {editingEducacionCard && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEducacionCard(null);
                        setEducacionForm({
                          titulo: "",
                          descripcion: "",
                          contenido: "",
                          instructor: "",
                          duracion: "",
                          nivel: "Básico",
                          estado: "Borrador",
                          imagen: "",
                        });
                        setEducacionImage(null);
                        setShowEducacionForm(false);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                  {!editingEducacionCard && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowEducacionForm(false);
                        setEducacionForm({
                          titulo: "",
                          descripcion: "",
                          contenido: "",
                          instructor: "",
                          duracion: "",
                          nivel: "Básico",
                          estado: "Borrador",
                          imagen: "",
                        });
                        setEducacionImage(null);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
                </>
              )}

              <div className="border-t border-border/40 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Cursos</h3>
                <div className="space-y-3">
                  {educacionCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{card.titulo}</h4>
                        <p className="text-sm text-foreground/60">
                          {card.instructor} • {new Date(card.fechaCreacion).toLocaleDateString("es-ES")}
                        </p>
                        <div className="mt-1 flex gap-2">
                          {card.nivel && (
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              card.nivel === "Básico" ? "bg-green-100 text-green-700" :
                              card.nivel === "Intermedio" ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {card.nivel}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            card.estado === "Publicado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {card.estado}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEducacionCard(card)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-foreground/60 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteEducacionCard(card.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "socios":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">
                {menuItems.find((m) => m.id === activeSection)?.label}
              </h2>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Agregar Nuevo
              </button>
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-6">
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Nombre</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Información</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Estado</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(items[activeSection as keyof typeof items] || []).map((item: any) => (
                      <tr key={item.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">{item.nombre || item.titulo || item.email}</td>
                        <td className="px-4 py-3 text-sm text-foreground/60">
                          {item.cantidad && `${item.cantidad} unidades`}
                          {item.monto && item.monto}
                          {item.autor && `Por: ${item.autor}`}
                          {item.instructor && `Instructor: ${item.instructor}`}
                          {item.tipo && item.tipo}
                          {item.interes && item.interes}
                          {item.asunto && item.asunto}
                          {item.departamento && item.departamento}
                          {item.categoria && item.categoria}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.estado === "Activo" || item.estado === "Publicado" || item.estado === "En Oferta" || item.estado === "Abierto"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm space-x-2">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-foreground/60 hover:text-primary" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "candidaturas":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Candidaturas Recibidas</h2>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">
                {candidaturas.length} candidatura{candidaturas.length !== 1 ? "s" : ""}
              </span>
            </div>

            {candidaturas.length > 0 ? (
              <div className="space-y-3">
                {candidaturas.map((candidatura) => (
                  <div
                    key={candidatura.id}
                    className="bg-white rounded-lg border border-border/40 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {candidatura.nombre}
                        </h3>
                        <p className="text-sm text-foreground/60 mb-2">
                          {candidatura.email}
                        </p>
                        {candidatura.telefono && (
                          <p className="text-sm text-foreground/60 mb-2">
                            Teléfono: {candidatura.telefono}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                            CV: {candidatura.cvFileName}
                          </span>
                          <span className="text-xs text-foreground/50">
                            {new Date(candidatura.fechaEnvio).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadCV(candidatura)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Descargar CV"
                        >
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCandidatura(candidatura.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-border/40 p-12 text-center">
                <p className="text-lg text-foreground/70 mb-2">
                  No hay candidaturas aún
                </p>
                <p className="text-foreground/50">
                  Las candidaturas aparecerán aquí cuando los usuarios usen el formulario
                </p>
              </div>
            )}
          </div>
        );

      case "blog":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Artículos y Noticias</h2>
              {!showArticleForm && !editingArticle && (
                <button
                  onClick={() => setShowArticleForm(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Crear Nuevo Artículo
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">
              {(showArticleForm || editingArticle) && (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {editingArticle ? "Editar Artículo" : "Crear Nuevo Artículo"}
                  </h3>
                  <form onSubmit={handleArticleFormSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Título</label>
                    <input
                      type="text"
                      name="titulo"
                      value={articleForm.titulo}
                      onChange={handleArticleFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Fecha de Publicación</label>
                    <input
                      type="date"
                      name="fechaPublicacion"
                      value={articleForm.fechaPublicacion}
                      onChange={handleArticleFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Categoría</label>
                    <input
                      type="text"
                      name="categoria"
                      value={articleForm.categoria}
                      onChange={handleArticleFormChange}
                      placeholder="Ej: Inversión, Educación"
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Estado</label>
                    <select
                      name="estado"
                      value={articleForm.estado}
                      onChange={handleArticleFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Borrador">Borrador</option>
                      <option value="Publicado">Publicado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Resumen</label>
                  <textarea
                    name="resumen"
                    value={articleForm.resumen}
                    onChange={handleArticleFormChange}
                    rows={2}
                    placeholder="Resumen breve del artículo"
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Contenido</label>
                  <RichTextEditor
                    value={articleForm.contenido}
                    onChange={(value) => setArticleForm((prev) => ({ ...prev, contenido: value }))}
                    placeholder="Ingresa el contenido del artículo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Imagen (opcional)</label>
                  <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleArticleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="article-image-input"
                    />
                    <label htmlFor="article-image-input" className="cursor-pointer block">
                      {articleForm.imagen ? (
                        <div className="space-y-2">
                          <img
                            src={articleForm.imagen}
                            alt="Preview"
                            className="w-32 h-32 object-cover mx-auto rounded-lg"
                          />
                          <p className="text-sm text-foreground/60">Haz clic para cambiar imagen</p>
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
                          <p className="text-foreground font-semibold">Haz clic para cargar imagen</p>
                          <p className="text-sm text-foreground/60">JPG, PNG, WebP (máx. 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                  >
                    {editingArticle ? "Actualizar" : "Crear"}
                  </button>
                  {editingArticle && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArticle(null);
                        setArticleForm({
                          titulo: "",
                          contenido: "",
                          resumen: "",
                          categoria: "",
                          estado: "Borrador",
                          imagen: "",
                          fechaPublicacion: new Date().toISOString().split('T')[0],
                        });
                        setArticleImage(null);
                        setShowArticleForm(false);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                  {!editingArticle && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowArticleForm(false);
                        setArticleForm({
                          titulo: "",
                          contenido: "",
                          resumen: "",
                          categoria: "",
                          estado: "Borrador",
                          imagen: "",
                          fechaPublicacion: new Date().toISOString().split('T')[0],
                        });
                        setArticleImage(null);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
                </>
              )}

              <div className="border-t border-border/40 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Artículos</h3>
                <div className="space-y-3">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{article.titulo}</h4>
                        <p className="text-sm text-foreground/60">
                          {new Date(article.fechaPublicacion || article.fechaCreacion).toLocaleDateString("es-ES")}
                        </p>
                        <div className="mt-1 flex gap-2">
                          {article.categoria && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                              {article.categoria}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            article.estado === "Publicado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {article.estado}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-foreground/60 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "equipo":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Equipo</h2>
              {!showTeamForm && !editingTeamMember && (
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Miembro
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">
              {(showTeamForm || editingTeamMember) && (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {editingTeamMember ? "Editar Miembro del Equipo" : "Agregar Miembro del Equipo"}
                  </h3>
                  <form onSubmit={handleTeamFormSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={teamForm.nombre}
                      onChange={handleTeamFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Rol</label>
                    <input
                      type="text"
                      name="rol"
                      value={teamForm.rol}
                      onChange={handleTeamFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Departamento</label>
                    <input
                      type="text"
                      name="departamento"
                      value={teamForm.departamento}
                      onChange={handleTeamFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Biografía</label>
                  <textarea
                    name="bio"
                    value={teamForm.bio}
                    onChange={handleTeamFormChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Foto del Miembro (opcional)</label>
                  <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleTeamPhotoChange}
                      accept="image/*"
                      className="hidden"
                      id="team-photo-input"
                    />
                    <label htmlFor="team-photo-input" className="cursor-pointer block">
                      {teamForm.foto ? (
                        <div className="space-y-2">
                          <img
                            src={teamForm.foto}
                            alt="Preview"
                            className="w-32 h-32 object-cover mx-auto rounded-lg"
                          />
                          <p className="text-sm text-foreground/60">Haz clic para cambiar foto</p>
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
                          <p className="text-foreground font-semibold">Haz clic para cargar foto</p>
                          <p className="text-sm text-foreground/60">JPG, PNG, WebP (máx. 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                  >
                    {editingTeamMember ? "Actualizar" : "Agregar"}
                  </button>
                  {editingTeamMember && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeamMember(null);
                        setTeamForm({ nombre: "", rol: "", departamento: "", bio: "", foto: "" });
                        setTeamPhoto(null);
                        setShowTeamForm(false);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                  {!editingTeamMember && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeamForm(false);
                        setTeamForm({ nombre: "", rol: "", departamento: "", bio: "", foto: "" });
                        setTeamPhoto(null);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
                </>
              )}

              <div className="border-t border-border/40 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Miembros Actuales</h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold text-foreground">{member.nombre}</h4>
                        <p className="text-sm text-foreground/60">{member.rol} • {member.departamento}</p>
                        {member.bio && <p className="text-sm text-foreground/50 mt-1">{member.bio}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTeamMember(member)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-foreground/60 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "empleos":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Empleos</h2>
              {!showJobForm && !editingJob && (
                <button
                  onClick={() => setShowJobForm(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Crear Nueva Posición
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">
              {(showJobForm || editingJob) && (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-6">
                    {editingJob ? "Editar Posición" : "Crear Nueva Posición"}
                  </h3>
                  <form onSubmit={handleJobFormSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Título del Puesto</label>
                    <input
                      type="text"
                      name="titulo"
                      value={jobForm.titulo}
                      onChange={handleJobFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Departamento</label>
                    <input
                      type="text"
                      name="departamento"
                      value={jobForm.departamento}
                      onChange={handleJobFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Ubicación</label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={jobForm.ubicacion}
                      onChange={handleJobFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Tipo de Contrato</label>
                    <input
                      type="text"
                      name="tipo"
                      value={jobForm.tipo}
                      onChange={handleJobFormChange}
                      placeholder="Ej: Tiempo Completo"
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Estado</label>
                    <select
                      name="estado"
                      value={jobForm.estado}
                      onChange={handleJobFormChange}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Abierto">Abierto</option>
                      <option value="Cerrado">Cerrado</option>
                      <option value="En Revisión">En Revisión</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={jobForm.descripcion}
                    onChange={handleJobFormChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Requisitos (uno por línea)</label>
                  <textarea
                    name="requisitos"
                    value={jobForm.requisitos}
                    onChange={handleJobFormChange}
                    rows={4}
                    placeholder="Ej:&#10;5+ años de experiencia&#10;Conocimiento de React&#10;Inglés fluido"
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Beneficios (uno por línea)</label>
                  <textarea
                    name="beneficios"
                    value={jobForm.beneficios}
                    onChange={handleJobFormChange}
                    rows={4}
                    placeholder="Ej:&#10;Salario competitivo&#10;Opciones de acciones&#10;Trabajo remoto"
                    className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                  >
                    {editingJob ? "Actualizar" : "Crear"}
                  </button>
                  {editingJob && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJob(null);
                        setJobForm({
                          titulo: "",
                          departamento: "",
                          ubicacion: "",
                          tipo: "",
                          descripcion: "",
                          requisitos: "",
                          beneficios: "",
                          estado: "Abierto",
                        });
                        setShowJobForm(false);
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                  {!editingJob && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowJobForm(false);
                        setJobForm({
                          titulo: "",
                          departamento: "",
                          ubicacion: "",
                          tipo: "",
                          descripcion: "",
                          requisitos: "",
                          beneficios: "",
                          estado: "Abierto",
                        });
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
                </>
              )}

              <div className="border-t border-border/40 pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Posiciones Actuales</h3>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold text-foreground">{job.titulo}</h4>
                        <p className="text-sm text-foreground/60">{job.departamento} • {job.ubicacion}</p>
                        <div className="mt-1 flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            job.estado === "Abierto"
                              ? "bg-green-100 text-green-700"
                              : job.estado === "Cerrado"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {job.estado}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-foreground/60 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "politicas":
        if (editingPolicy) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">
                  Editar Política de {editingPolicy === "privacidad" ? "Privacidad" : editingPolicy === "terminos" ? "Términos" : "Cookies"}
                </h2>
                <button
                  onClick={() => setEditingPolicy(null)}
                  className="px-6 py-2 border border-border/40 text-foreground rounded-lg hover:bg-secondary transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6 space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Contenido de la Política
                  </label>
                  <PolicyRichTextEditor
                    value={policyContent}
                    onChange={setPolicyContent}
                    placeholder={`Ingresa el contenido de la política de ${editingPolicy === "privacidad" ? "privacidad" : editingPolicy === "terminos" ? "términos" : "cookies"}...`}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePolicy}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="flex-1 px-6 py-3 border border-border/40 text-foreground rounded-lg hover:bg-secondary transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Políticas</h2>
            <div className="space-y-4">
              {[
                { key: "privacidad", titulo: "Política de Privacidad", estado: "Vigente" },
                { key: "terminos", titulo: "Términos de Servicio", estado: "Vigente" },
                { key: "cookies", titulo: "Política de Cookies", estado: "Vigente" },
              ].map((policy) => (
                <div key={policy.key} className="bg-white rounded-lg border border-border/40 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{policy.titulo}</h3>
                    <p className="text-sm text-foreground/60">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {policy.estado}
                    </span>
                    <button
                      onClick={() => handleEditPolicy(policy.key)}
                      className="p-2 hover:bg-primary/10 rounded transition-colors"
                    >
                      <Edit className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "denuncias":
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground">Denuncias y Reclamos</h2>

            {/* Denuncias Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                Denuncias ({denuncias.length})
              </h3>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                {denuncias.length === 0 ? (
                  <p className="text-foreground/60">No hay denuncias registradas</p>
                ) : (
                  <div className="space-y-4">
                    {denuncias.map((denuncia) => (
                      <div key={denuncia.id} className="border border-border/40 rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {denuncia.anonimo ? "Denuncia Anónima" : denuncia.nombre || "Sin nombre"}
                            </h4>
                            <p className="text-sm text-foreground/60">
                              Email: {denuncia.email || "No proporcionado"} • {new Date(denuncia.fecha).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={denuncia.estado}
                              onChange={(e) => handleUpdateDenunciaStatus(denuncia.id, e.target.value)}
                              className="px-3 py-1 border border-border/40 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="Nuevo">Nuevo</option>
                              <option value="En Revisión">En Revisión</option>
                              <option value="Resuelto">Resuelto</option>
                              <option value="Cerrado">Cerrado</option>
                            </select>
                            <button
                              onClick={() => handleDeleteDenuncia(denuncia.id)}
                              className="p-2 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                          <p className="text-sm text-foreground">{denuncia.detalles}</p>
                        </div>
                        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          denuncia.estado === "Nuevo" ? "bg-red-100 text-red-700" :
                          denuncia.estado === "En Revisión" ? "bg-yellow-100 text-yellow-700" :
                          denuncia.estado === "Resuelto" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {denuncia.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reclamos Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                Reclamos ({reclamos.length})
              </h3>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                {reclamos.length === 0 ? (
                  <p className="text-foreground/60">No hay reclamos registrados</p>
                ) : (
                  <div className="space-y-4">
                    {reclamos.map((reclamo) => (
                      <div key={reclamo.id} className="border border-border/40 rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {reclamo.anonimo ? "Reclamo Anónimo" : reclamo.nombre || "Sin nombre"}
                            </h4>
                            <p className="text-sm text-foreground/60">
                              Email: {reclamo.email || "No proporcionado"} • {new Date(reclamo.fecha).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={reclamo.estado}
                              onChange={(e) => handleUpdateReclamoStatus(reclamo.id, e.target.value)}
                              className="px-3 py-1 border border-border/40 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="Nuevo">Nuevo</option>
                              <option value="En Revisión">En Revisión</option>
                              <option value="Resuelto">Resuelto</option>
                              <option value="Cerrado">Cerrado</option>
                            </select>
                            <button
                              onClick={() => handleDeleteReclamo(reclamo.id)}
                              className="p-2 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                          <p className="text-sm text-foreground">{reclamo.detalles}</p>
                        </div>
                        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          reclamo.estado === "Nuevo" ? "bg-blue-100 text-blue-700" :
                          reclamo.estado === "En Revisión" ? "bg-yellow-100 text-yellow-700" :
                          reclamo.estado === "Resuelto" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {reclamo.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ padding: "94px 32px 32px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border/40 p-6 sticky top-24 h-fit">
                <h3 className="text-lg font-bold text-foreground mb-6">Admin</h3>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-3 font-medium text-sm ${
                        activeSection === item.id
                          ? "bg-primary text-white"
                          : "text-foreground/70 hover:bg-secondary"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
                <button
                  onClick={handleLogout}
                  className="w-full mt-8 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Salir
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg border border-border/40 p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
