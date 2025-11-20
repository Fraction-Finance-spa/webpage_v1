import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, type TeamMember } from "@/lib/teamManager";
import { getJobs, addJob, updateJob, deleteJob, type Job } from "@/lib/jobsManager";
import { type Candidatura } from "@/components/CandidaturaForm";
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
} from "lucide-react";

type AdminSection = 
  | "dashboard" 
  | "activos" 
  | "sto" 
  | "blog" 
  | "educacion" 
  | "usuarios" 
  | "waitlist" 
  | "mensajes" 
  | "empleos" 
  | "equipo" 
  | "socios" 
  | "politicas" 
  | "denuncias";

export default function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState({
    nombre: "",
    rol: "",
    departamento: "",
    bio: "",
  });

  useEffect(() => {
    setTeamMembers(getTeamMembers());
  }, []);

  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamMember) {
      updateTeamMember(editingTeamMember.id, teamForm);
    } else {
      addTeamMember(teamForm);
    }
    setTeamMembers(getTeamMembers());
    setTeamForm({ nombre: "", rol: "", departamento: "", bio: "" });
    setEditingTeamMember(null);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamForm({
      nombre: member.nombre,
      rol: member.rol,
      departamento: member.departamento,
      bio: member.bio || "",
    });
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este miembro del equipo?")) {
      deleteTeamMember(id);
      setTeamMembers(getTeamMembers());
    }
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
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
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
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
    if (confirm("¿Está seguro que desea eliminar esta candidatura?")) {
      const filtered = candidaturas.filter((c) => c.id !== id);
      setCandidaturas(filtered);
      localStorage.setItem("candidaturas", JSON.stringify(filtered));
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Panel", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "activos", label: "Activos Digitales", icon: <Coins className="w-5 h-5" /> },
    { id: "sto", label: "Oferta de Financiamiento (STOs)", icon: <FileText className="w-5 h-5" /> },
    { id: "blog", label: "Blog", icon: <Briefcase className="w-5 h-5" /> },
    { id: "educacion", label: "Educación", icon: <BookOpen className="w-5 h-5" /> },
    { id: "usuarios", label: "Usuarios", icon: <Users className="w-5 h-5" /> },
    { id: "waitlist", label: "Lista de Espera", icon: <Clock className="w-5 h-5" /> },
    { id: "mensajes", label: "Mensajes de Contacto", icon: <Mail className="w-5 h-5" /> },
    { id: "empleos", label: "Empleos", icon: <Briefcase className="w-5 h-5" /> },
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
    waitlist: [
      { id: 1, email: "waiting1@example.com", fecha: "2024-01-15", interes: "Financiamiento" },
      { id: 2, email: "waiting2@example.com", fecha: "2024-01-14", interes: "Inversiones" },
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
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Total Usuarios</p>
                    <p className="text-3xl font-bold text-foreground">1,234</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">STOs Activos</p>
                    <p className="text-3xl font-bold text-foreground">12</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Activos Digitales</p>
                    <p className="text-3xl font-bold text-foreground">45</p>
                  </div>
                  <Coins className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-border/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Mensajes Pendientes</p>
                    <p className="text-3xl font-bold text-foreground">23</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-border/40 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Estadísticas Recientes
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Usuarios registrados esta semana</p>
                  <p className="font-bold text-foreground">+45</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">STOs completados</p>
                  <p className="font-bold text-foreground">3</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Mensajes recibidos</p>
                  <p className="font-bold text-foreground">127</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "activos":
      case "sto":
      case "blog":
      case "educacion":
      case "usuarios":
      case "waitlist":
      case "mensajes":
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

      case "equipo":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Equipo</h2>
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">
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
                        setTeamForm({ nombre: "", rol: "", departamento: "", bio: "" });
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

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
            </div>

            <div className="bg-white rounded-lg border border-border/40 p-8">
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
                      }}
                      className="px-6 py-2 bg-gray-300 text-foreground rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

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
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Políticas</h2>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Agregar Política
            </button>
            <div className="space-y-4">
              {[
                { titulo: "Términos de Servicio", ultima: "2024-01-10", estado: "Vigente" },
                { titulo: "Política de Privacidad", ultima: "2024-01-05", estado: "Vigente" },
                { titulo: "Código de Conducta", ultima: "2023-12-20", estado: "Vigente" },
              ].map((policy, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-border/40 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{policy.titulo}</h3>
                    <p className="text-sm text-foreground/60">Última actualización: {policy.ultima}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {policy.estado}
                    </span>
                    <Edit className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "denuncias":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Denuncias y Reclamos</h2>
            <div className="bg-white rounded-lg border border-border/40 p-6">
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Buscar denuncias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, titulo: "Denuncia de Fraude", usuario: "User123", fecha: "2024-01-15", prioridad: "Alta", estado: "Pendiente" },
                  { id: 2, titulo: "Comportamiento Inapropiado", usuario: "User456", fecha: "2024-01-14", prioridad: "Media", estado: "En Revisión" },
                  { id: 3, titulo: "Error en Transacción", usuario: "User789", fecha: "2024-01-13", prioridad: "Alta", estado: "Resuelto" },
                ].map((denuncia) => (
                  <div key={denuncia.id} className="bg-white rounded-lg border border-border/40 p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                    <div>
                      <h3 className="font-semibold text-foreground">{denuncia.titulo}</h3>
                      <p className="text-sm text-foreground/60">
                        Usuario: {denuncia.usuario} • {denuncia.fecha}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        denuncia.prioridad === "Alta" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {denuncia.prioridad}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        denuncia.estado === "Resuelto" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {denuncia.estado}
                      </span>
                    </div>
                  </div>
                ))}
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
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-blue-50">
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
