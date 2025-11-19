import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path?: string;
  description?: string;
  submenu?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Productos",
    submenu: [
      { label: "Financiamiento", path: "/productos/financiamiento", description: "Acceso a fondos tokenizados y flexibles" },
      { label: "Inversiones", path: "/productos/inversiones", description: "Oportunidades de inversión con alto rendimiento" },
    ],
  },
  { label: "Ecosistema", path: "/ecosistema" },
  {
    label: "Nosotros",
    submenu: [
      { label: "Nuestra Empresa", path: "/nosotros/empresa", description: "Conoce nuestra historia y misión" },
      { label: "Modelo de Negocio", path: "/nosotros/modelo", description: "Cómo funcionamos y generamos valor" },
      { label: "Educación Financiera", path: "/nosotros/educacion", description: "Recursos y herramientas para aprender" },
      { label: "Blog", path: "/nosotros/blog", description: "Artículos y análisis del mercado" },
      { label: "Trabaja con Nosotros", path: "/nosotros/careers", description: "Únete a nuestro equipo" },
      { label: "Contacto", path: "/nosotros/contacto", description: "Ponte en contacto con nosotros" },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const handleFinanciamientoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = "/signup";
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
        <nav className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
                      <div style={{ color: "rgba(0, 0, 0, 1)", fontSize: "20px" }}>
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
                          <div className="text-foreground/70 hover:text-primary font-medium text-sm">
                            {subitem.label}
                          </div>
                          {subitem.description && (
                            <div className="text-foreground/50 text-xs mt-1">
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
                    style={item.label === "Ecosistema" ? { color: "rgba(0, 0, 0, 1)", fontSize: "20px" } : undefined}
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
                  {userName || userEmail}
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
                  to="/login"
                  className="px-4 py-2 text-foreground/70 hover:text-primary transition-colors font-medium"
                  style={{ color: "rgba(0, 0, 0, 1)", fontSize: "16px" }}
                >
                  Ingresar
                </Link>
                <Link
                  to="/signup"
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
                              className="block px-4 py-2 text-foreground/60 hover:text-primary text-sm transition-colors"
                              onClick={(e) => {
                                setMobileMenuOpen(false);
                                if (subitem.label === "Financiamiento") {
                                  handleFinanciamientoClick(e);
                                }
                              }}
                            >
                              {subitem.label}
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
                      {userEmail}
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
                      to="/login"
                      className="block text-center px-4 py-2 text-foreground/70 hover:text-primary text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ingresar
                    </Link>
                    <Link
                      to="/signup"
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
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Fraction Finance</h3>
              <p className="text-white/70 text-sm">
                Impulsando el financiamiento colaborativo para empresas
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/productos/financiamiento"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Financiamiento
                  </Link>
                </li>
                <li>
                  <Link
                    to="/productos/inversiones"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Inversiones
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Nosotros</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/nosotros/empresa"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Nuestra Empresa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros/blog"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Blog
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
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

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
