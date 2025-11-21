import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, DollarSign, TrendingUp, Building2, Zap, BookOpen, Newspaper, Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path?: string;
  description?: string;
  icon?: React.ReactNode;
  submenu?: NavItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  "Financiamiento": <DollarSign className="w-4 h-4" />,
  "Inversiones": <TrendingUp className="w-4 h-4" />,
  "Nuestra Empresa": <Building2 className="w-4 h-4" />,
  "Modelo de Negocio": <Zap className="w-4 h-4" />,
  "Educación Financiera": <BookOpen className="w-4 h-4" />,
  "Artículos y Noticias": <Newspaper className="w-4 h-4" />,
  "Trabaja con Nosotros": <Users className="w-4 h-4" />,
  "Contacto": <Mail className="w-4 h-4" />,
};

const navItems: NavItem[] = [
  {
    label: "Productos",
    submenu: [
      { label: "Financiamiento", path: "/productos/financiamiento", description: "Obtén financiamiento rápido y accesible para tu negocio", icon: iconMap["Financiamiento"] },
      { label: "Inversiones", path: "/productos/inversiones", description: "Oportunidades de inversión con alto rendimiento", icon: iconMap["Inversiones"] },
    ],
  },
  { label: "Ecosistema", path: "/ecosistema" },
  {
    label: "Nosotros",
    submenu: [
      { label: "Nuestra Empresa", path: "/nosotros/empresa", description: "Conoce nuestra historia y misión", icon: iconMap["Nuestra Empresa"] },
      { label: "Modelo de Negocio", path: "/nosotros/modelo", description: "Cómo funcionamos y generamos valor", icon: iconMap["Modelo de Negocio"] },
      { label: "Educación Financiera", path: "/nosotros/educacion", description: "Recursos y herramientas para aprender", icon: iconMap["Educación Financiera"] },
      { label: "Artículos y Noticias", path: "/nosotros/blog", description: "Artículos y análisis del mercado", icon: iconMap["Artículos y Noticias"] },
      { label: "Trabaja con Nosotros", path: "/nosotros/careers", description: "Únete a nuestro equipo", icon: iconMap["Trabaja con Nosotros"] },
      { label: "Contacto", path: "/nosotros/contacto", description: "Ponte en contacto con nosotros", icon: iconMap["Contacto"] },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");
  const userProfileType = localStorage.getItem("userProfileType");
  const userFirstName = localStorage.getItem("userFirstName") || "";
  const userLastName = localStorage.getItem("userLastName") || "";
  const userCompanyName = localStorage.getItem("userCompanyName") || "";

  const displayName = userProfileType === "empresa"
    ? userCompanyName
    : userFirstName + (userLastName ? " " + userLastName : "");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userCompanyName");
    localStorage.removeItem("userProfileType");
    window.location.href = "/";
  };

  const handleFinanciamientoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = "/auth";
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative" style={{ backgroundColor: "rgba(0, 45, 255, 0.02)" }}>
      {/* Page Background Design */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/30"></div>

        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-primary/8 to-transparent rounded-full filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-gradient-to-tl from-blue-400/10 to-transparent rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 70, 255, 0.05) 25%, rgba(0, 70, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 70, 255, 0.05) 75%, rgba(0, 70, 255, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 70, 255, 0.05) 25%, rgba(0, 70, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 70, 255, 0.05) 75%, rgba(0, 70, 255, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-radial-gradient" style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 255, 255, 0.5) 100%)'
        }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md">
        <nav className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-0 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F44950e1356bb408aac1613e5c84b6bbd%2F177c19b2c22f4a9287a59c7d5e1960cc?format=webp&width=800"
              alt="Fraction Finance Logo"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button className="text-foreground/70 hover:text-primary transition-colors py-2 font-medium flex items-center gap-1">
                      <div style={{ color: "rgba(0, 0, 0, 1)", fontSize: "16px" }}>
                        {item.label}
                      </div>
                      <ChevronDown className="w-4 h-4" style={{ color: "rgba(0, 0, 0, 1)" }} />
                    </button>
                    <div className="absolute left-0 mt-0 w-64 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.submenu.map((subitem, idx) => (
                        <Link
                          key={subitem.label}
                          to={subitem.path || "#"}
                          onClick={subitem.label === "Financiamiento" ? handleFinanciamientoClick : undefined}
                          className={cn(
                            "block px-4 py-3 hover:bg-secondary transition-colors",
                            idx === 0 && "rounded-t-lg",
                            idx === item.submenu.length - 1 && "rounded-b-lg"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-foreground/70 hover:text-primary font-medium text-sm flex items-center gap-2 flex-1">
                              {subitem.icon}
                              {subitem.label}
                            </div>
                          </div>
                          {subitem.description && (
                            <div className="text-foreground/60 text-sm">
                              {subitem.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className={cn(
                      "text-foreground/70 hover:text-primary transition-colors py-2 font-medium",
                      location.pathname === item.path && "text-primary"
                    )}
                    style={item.label === "Ecosistema" ? { color: "rgba(0, 0, 0, 1)", fontSize: "16px" } : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right side: Auth and Mobile Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="hidden sm:inline text-foreground/70 hover:text-primary transition-colors text-sm font-medium"
                >
                  {displayName || userEmail}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-foreground/70 hover:text-primary transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-foreground/70 hover:text-primary transition-colors font-medium"
                  style={{ color: "rgba(0, 0, 0, 1)", fontSize: "16px" }}
                >
                  Ingresar
                </Link>
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
                  style={{ fontSize: "16px" }}
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-border/60">
            <div className="container max-w-7xl mx-auto px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenSubmenu(
                            openSubmenu === item.label ? null : item.label
                          )
                        }
                        className="w-full text-left px-4 py-2 text-foreground/70 hover:text-primary font-medium flex justify-between items-center"
                      >
                        {item.label}
                        <span
                          className={cn(
                            "transition-transform",
                            openSubmenu === item.label && "rotate-180"
                          )}
                        >
                          ▼
                        </span>
                      </button>
                      {openSubmenu === item.label && (
                        <div className="pl-4 space-y-2 border-l border-border/40">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.label}
                              to={subitem.path || "#"}
                              className="block px-4 py-3 text-foreground/60 hover:text-primary transition-colors"
                              onClick={(e) => {
                                setMobileMenuOpen(false);
                                if (subitem.label === "Financiamiento") {
                                  handleFinanciamientoClick(e);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1 font-medium text-sm">
                                {subitem.icon}
                                {subitem.label}
                              </div>
                              {subitem.description && (
                                <div className="text-foreground/50 text-xs ml-7">
                                  {subitem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path || "#"}
                      className="block px-4 py-2 text-foreground/70 hover:text-primary font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-border/40 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-foreground/70 hover:text-primary text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {displayName || userEmail}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-foreground/70 hover:text-primary transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Salir
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="block text-center px-4 py-2 text-foreground/70 hover:text-primary text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ingresar
                    </Link>
                    <Link
                      to="/auth"
                      className="block text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white mt-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Logo Section */}
            <div>
              <div className="mb-4">
                <h3 className="font-bold text-2xl mb-2">Fraction Finance</h3>
                <div className="w-12 h-1 bg-primary rounded-full"></div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Facilitamos las inversiones en fondos tokenizados.
              </p>
            </div>

            {/* Empresa Section */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Empresa</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/nosotros/empresa"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros/modelo"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Modelo de Negocio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros/educacion"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Educación Financiera
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros/blog"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Artículos y Noticias
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros/careers"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Empleos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros/contacto"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/politica-privacidad"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terminos-servicio"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/politica-cookies"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/canal-denuncias"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Canal de Denuncias
                  </Link>
                </li>
                <li>
                  <Link
                    to="/canal-reclamos"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Canal de Reclamos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto Section */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:contacto@fractionfinance.cl"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    contacto@fractionfinance.cl
                  </a>
                </li>
              </ul>
            </div>

            {/* Administración Section */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Administración</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/admin"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Panel de Administración
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>&copy; 2024 Fraction Finance. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
