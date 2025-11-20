export interface Job {
  id: string;
  titulo: string;
  departamento: string;
  ubicacion: string;
  tipo: string;
  descripcion: string;
  requisitos?: string[];
  beneficios?: string[];
  estado: "Abierto" | "Cerrado" | "En Revisión";
  fechaPublicacion?: string;
}

const STORAGE_KEY = "jobs";

const defaultJobs: Job[] = [
  {
    id: "1",
    titulo: "Senior Full Stack Developer",
    departamento: "Tecnología",
    ubicacion: "Santiago, Chile",
    tipo: "Tiempo Completo",
    descripcion: "Buscamos un desarrollador full stack experimentado para unirse a nuestro equipo de tecnología. Trabajarás en la arquitectura y desarrollo de nuestra plataforma de tokenización.",
    requisitos: [
      "5+ años de experiencia en desarrollo web",
      "Experiencia con React y Node.js",
      "Conocimiento de blockchain y criptomonedas",
      "Inglés fluido"
    ],
    beneficios: [
      "Salario competitivo",
      "Opciones de acciones",
      "Trabajo remoto flexible",
      "Seguro de salud"
    ],
    estado: "Abierto",
    fechaPublicacion: new Date().toISOString(),
  },
  {
    id: "2",
    titulo: "Especialista en Finanzas Digitales",
    departamento: "Finanzas",
    ubicacion: "Santiago, Chile",
    tipo: "Tiempo Completo",
    descripcion: "Únete a nuestro equipo de finanzas como especialista en activos digitales. Serás responsable de gestionar y analizar oportunidades de inversión.",
    requisitos: [
      "Licenciatura en Finanzas o carrera afín",
      "3+ años de experiencia en mercados financieros",
      "Conocimiento de activos digitales",
      "Habilidades analíticas excepcionales"
    ],
    beneficios: [
      "Paquete de compensación atractivo",
      "Bonus anual",
      "Plan de desarrollo profesional",
      "Ambiente colaborativo"
    ],
    estado: "Abierto",
    fechaPublicacion: new Date().toISOString(),
  },
];

export function getJobs(): Job[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading jobs:", error);
  }
  return defaultJobs;
}

export function saveJobs(jobs: Job[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error("Error saving jobs:", error);
  }
}

export function addJob(job: Omit<Job, "id">): Job {
  const jobs = getJobs();
  const newJob: Job = {
    ...job,
    id: Date.now().toString(),
  };
  jobs.push(newJob);
  saveJobs(jobs);
  return newJob;
}

export function updateJob(id: string, updates: Partial<Job>): Job | null {
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    saveJobs(jobs);
    return jobs[index];
  }
  return null;
}

export function deleteJob(id: string): boolean {
  const jobs = getJobs();
  const filtered = jobs.filter((j) => j.id !== id);
  if (filtered.length < jobs.length) {
    saveJobs(filtered);
    return true;
  }
  return false;
}

export function getOpenJobs(): Job[] {
  return getJobs().filter((job) => job.estado === "Abierto");
}
