/**
 * Get the current subdomain from the hostname
 * Examples:
 * - financiamiento.app.local -> "financiamiento"
 * - localhost -> null
 * - localhost:3000 -> null
 */
export function getSubdomain(): string | null {
  if (typeof window === "undefined") return null;

  const host = window.location.hostname;
  
  // Skip localhost and IP addresses
  if (host === "localhost" || host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return null;
  }

  const parts = host.split(".");
  
  // If we have more than 2 parts (e.g., sub.example.com), get the first part
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}

export const SUBDOMAIN_ROUTES: Record<string, string> = {
  "financiamiento": "/productos/financiamiento",
  "alternativas": "/productos/inversiones",
  "mercado": "/productos/mercado-secundario",
  "mercado-secundario": "/productos/mercado-secundario",
  "perfil": "/profile",
  "admin": "/admin",
};

/**
 * Check if user is authenticated, redirect to login if not
 */
export function checkAuthAndRedirect(isAuthenticated: boolean, navigate: (path: string) => void) {
  if (!isAuthenticated) {
    navigate("/auth");
    return false;
  }
  return true;
}
