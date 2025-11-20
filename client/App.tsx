import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import FinancingForm from "./pages/FinancingForm";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import AboutCompany from "./pages/AboutCompany";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/auth" />;
};

const ProtectedRouteEmpresa = ({ element }: { element: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const profileType = localStorage.getItem("userProfileType");

  if (!isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  if (profileType !== "empresa") {
    return <Navigate to="/" />;
  }

  return element;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/signup" element={<Navigate to="/auth" />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

            {/* Productos */}
            <Route path="/productos/financiamiento" element={<ProtectedRouteEmpresa element={<FinancingForm />} />} />
            <Route path="/productos/inversiones" element={<Placeholder />} />

            {/* Ecosistema */}
            <Route path="/ecosistema" element={<Placeholder />} />

            {/* Nosotros */}
            <Route path="/nosotros/empresa" element={<AboutCompany />} />
            <Route path="/nosotros/modelo" element={<Placeholder />} />
            <Route path="/nosotros/educacion" element={<Placeholder />} />
            <Route path="/nosotros/blog" element={<Placeholder />} />
            <Route path="/nosotros/careers" element={<Careers />} />
            <Route path="/nosotros/contacto" element={<Contact />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
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
