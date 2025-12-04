import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import FinancingForm from "./pages/FinancingForm";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Inversiones from "./pages/Inversiones";
import MercadoSecundario from "./pages/MercadoSecundario";

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
    return <Navigate to="/auth" />;
  }

  return element;
};

export default function AppDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Productos - Dashboard Access Only */}
            <Route path="/productos/financiamiento" element={<ProtectedRouteEmpresa element={<FinancingForm />} />} />
            <Route path="/productos/inversiones" element={<ProtectedRoute element={<Inversiones />} />} />
            <Route path="/productos/mercado-secundario" element={<ProtectedRoute element={<MercadoSecundario />} />} />

            {/* User Profile */}
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />

            {/* Redirect root to profile */}
            <Route path="/" element={<Navigate to="/profile" />} />

            {/* Catch-all - redirect to profile */}
            <Route path="*" element={<Navigate to="/profile" />} />
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

root.render(<AppDashboard />);
