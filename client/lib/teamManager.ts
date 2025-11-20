export interface TeamMember {
  id: string;
  nombre: string;
  rol: string;
  departamento: string;
  bio?: string;
}

const STORAGE_KEY = "team_members";

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    nombre: "Exequiel Aravena",
    rol: "Cofundador",
    departamento: "Directiva",
    bio: "Líder estratégico con visión en tecnología financiera y mercados de capitales.",
  },
  {
    id: "2",
    nombre: "Ricardo Cañas",
    rol: "Cofundador",
    departamento: "Directiva",
    bio: "Especialista en desarrollo tecnológico y arquitectura de soluciones blockchain.",
  },
];

export function getTeamMembers(): TeamMember[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading team members:", error);
  }
  return defaultTeamMembers;
}

export function saveTeamMembers(members: TeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (error) {
    console.error("Error saving team members:", error);
  }
}

export function addTeamMember(member: Omit<TeamMember, "id">): TeamMember {
  const members = getTeamMembers();
  const newMember: TeamMember = {
    ...member,
    id: Date.now().toString(),
  };
  members.push(newMember);
  saveTeamMembers(members);
  return newMember;
}

export function updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
  const members = getTeamMembers();
  const index = members.findIndex((m) => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...updates };
    saveTeamMembers(members);
    return members[index];
  }
  return null;
}

export function deleteTeamMember(id: string): boolean {
  const members = getTeamMembers();
  const filtered = members.filter((m) => m.id !== id);
  if (filtered.length < members.length) {
    saveTeamMembers(filtered);
    return true;
  }
  return false;
}
