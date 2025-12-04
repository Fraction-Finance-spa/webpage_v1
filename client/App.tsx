import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import FinancingForm from "./pages/FinancingForm";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import AboutCompany from "./pages/AboutCompany";
import BusinessModel from "./pages/BusinessModel";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import ArticleDetail from "./pages/ArticleDetail";
import Placeholder from "./pages/Placeholder";
import Education from "./pages/Education";
import EducationDetail from "./pages/EducationDetail";
import Inversiones from "./pages/Inversiones";
import DenunciasChannel from "./pages/DenunciasChannel";
import ReclamosChannel from "./pages/ReclamosChannel";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import MercadoSecundario from "./pages/MercadoSecundario";
import Ecosistema from "./pages/Ecosistema";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/auth" />;
};

const ProtectedRouteEmpresa = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return element;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/auth" />} />
      <Route path="/register" element={<Navigate to="/auth" />} />
      <Route path="/signup" element={<Navigate to="/auth" />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

      {/* Productos */}
      <Route path="/productos/financiamiento" element={<ProtectedRouteEmpresa element={<FinancingForm />} />} />
      <Route path="/productos/inversiones" element={<ProtectedRouteEmpresa element={<Inversiones />} />} />
      <Route path="/productos/mercado-secundario" element={<ProtectedRouteEmpresa element={<MercadoSecundario />} />} />

      {/* Ecosistema */}
      <Route path="/ecosistema" element={<Ecosistema />} />

      {/* Nosotros */}
      <Route path="/nosotros/empresa" element={<AboutCompany />} />
      <Route path="/nosotros/modelo" element={<BusinessModel />} />
      <Route path="/nosotros/educacion" element={<Education />} />
      <Route path="/nosotros/educacion/:id" element={<EducationDetail />} />
      <Route path="/nosotros/blog" element={<Blog />} />
      <Route path="/nosotros/blog/:id" element={<ArticleDetail />} />
      <Route path="/nosotros/careers" element={<Careers />} />
      <Route path="/nosotros/contacto" element={<Contact />} />
      <Route path="/canal-denuncias" element={<DenunciasChannel />} />
      <Route path="/canal-reclamos" element={<ReclamosChannel />} />

      {/* Policies */}
      <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
      <Route path="/terminos-servicio" element={<TermsOfService />} />
      <Route path="/politica-cookies" element={<CookiePolicy />} />

      {/* Admin */}
      <Route path="/admin" element={<Admin />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root")!;
let root = (globalThis as any).__APP_ROOT__;

if (!root) {
  root = createRoot(rootElement);
  (globalThis as any).__APP_ROOT__ = root;
}

root.render(<App />);
