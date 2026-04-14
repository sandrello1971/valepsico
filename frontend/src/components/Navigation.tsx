import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Chi sono', path: '/chi-sono' },
    { name: 'Servizi', path: '/servizi' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contatti', path: '/contatti' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded ${
      isActive 
        ? 'text-foreground font-bold border-b-2 border-foreground' 
        : 'text-foreground hover:text-foreground hover:font-bold hover:border-b-2 hover:border-foreground/50'
    }`;

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Salta al contenuto principale
      </a>
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50" aria-label="Navigazione principale">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded">
              <img src={logo} alt="Valentina Rita Andolfi Logo" className="h-16 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight font-sans">VALENTINA RITA ANDOLFI</span>
                <span className="text-sm text-muted-foreground font-medium font-sans">Psicologa - PhD - Psicoterapeuta</span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={getLinkClass}
                  end={item.path === '/'}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={isOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div id="mobile-nav" className="md:hidden pb-4 animate-fade-in" role="navigation" aria-label="Menu mobile">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => 
                      `px-4 py-3 rounded-lg font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isActive 
                          ? 'bg-foreground/10 text-foreground font-bold' 
                          : 'text-foreground hover:bg-muted hover:text-foreground hover:font-bold'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                    end={item.path === '/'}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
