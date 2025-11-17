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
  submenu?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Productos",
    submenu: [
      { label: "Financiamiento", path: "/productos/financiamiento" },
      { label: "Inversiones", path: "/productos/inversiones" },
    ],
  },
  { label: "Ecosistema", path: "/ecosistema" },
  {
    label: "Nosotros",
    submenu: [
      { label: "Nuestra Empresa", path: "/nosotros/empresa" },
      { label: "Modelo de Negocio", path: "/nosotros/modelo" },
      { label: "Educación Financiera", path: "/nosotros/educacion" },
      { label: "Blog", path: "/nosotros/blog" },
      { label: "Trabaja con Nosotros", path: "/nosotros/careers" },
      { label: "Contacto", path: "/nosotros/contacto" },
    ],
  },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border/60">
        <nav className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">FF</span>
            </div>
            <span className="font-bold text-xl text-foreground">
              Fraction Finance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button className="text-foreground/70 hover:text-primary transition-colors py-2 font-medium flex items-center gap-1">
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute left-0 mt-0 w-56 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.label}
                          to={subitem.path || "#"}
                          className="block px-4 py-3 text-foreground/70 hover:text-primary hover:bg-secondary first:rounded-t-lg last:rounded-b-lg transition-colors text-sm"
                        >
                          {subitem.label}
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
                  {userEmail}
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
                >
                  Ingresar
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
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
                              onClick={() => setMobileMenuOpen(false)}
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
