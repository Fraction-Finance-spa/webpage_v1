import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSubdomain, SUBDOMAIN_ROUTES } from "@/lib/subdomain";

/**
 * SafeSubdomainRouter - handles subdomain routing without using useAuth
 * Auth checks will be handled by ProtectedRoute components on the page level
 */
export function SafeSubdomainRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const subdomain = getSubdomain();
    
    if (subdomain && SUBDOMAIN_ROUTES[subdomain]) {
      const targetRoute = SUBDOMAIN_ROUTES[subdomain];
      
      // If current location is not the target route, redirect to it
      if (location.pathname !== targetRoute) {
        navigate(targetRoute);
      }
    }
  }, [navigate, location.pathname]);

  return null;
}
