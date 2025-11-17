import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import FinancingForm from "./pages/FinancingForm";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

          {/* Productos */}
          <Route path="/productos/financiamiento" element={<Placeholder />} />
          <Route path="/productos/inversiones" element={<Placeholder />} />

          {/* Ecosistema */}
          <Route path="/ecosistema" element={<Placeholder />} />

          {/* Nosotros */}
          <Route path="/nosotros/empresa" element={<Placeholder />} />
          <Route path="/nosotros/modelo" element={<Placeholder />} />
          <Route path="/nosotros/educacion" element={<Placeholder />} />
          <Route path="/nosotros/blog" element={<Placeholder />} />
          <Route path="/nosotros/careers" element={<Placeholder />} />
          <Route path="/nosotros/contacto" element={<Placeholder />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = (globalThis as any).__APP_ROOT__ || createRoot(rootElement);
  (globalThis as any).__APP_ROOT__ = root;
  root.render(<App />);
}
