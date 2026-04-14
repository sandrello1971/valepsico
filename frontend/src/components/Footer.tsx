import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-muted border-t" role="contentinfo">
      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="w-12 h-12 object-contain" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground">Valentina Rita Andolfi</h3>
                <p className="text-sm text-muted-foreground">Psicologa e Psicoterapeuta</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Contatti</h4>
              <p className="text-sm text-muted-foreground">info@valentinaritandolfi.it</p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="text-primary hover:text-accent transition-colors p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded" aria-label="Seguici su Facebook">
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a href="#" className="text-primary hover:text-accent transition-colors p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded" aria-label="Seguici su Instagram">
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Pages */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Pagine</h4>
            <nav aria-label="Link del footer" className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Home
              </Link>
              <Link to="/chi-sono" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Chi sono
              </Link>
              <Link to="/servizi" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Servizi
              </Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Blog
              </Link>
              <Link to="/contatti" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Contatti
              </Link>
            </nav>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Dove ricevo</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Milano &mdash; Studio Velasca, Piazza Velasca 6</p>
              <p>Buccinasco &mdash; Centro Persona, via degli Aceri 2</p>
              <p>Online, quando necessario</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-foreground">Contatti</h4>
              <div className="space-y-1 text-sm text-muted-foreground mt-2">
                <p>Tel / WhatsApp: 346 6051282</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center space-y-2">
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">|</span>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
              Cookie Policy
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Valentina Rita Andolfi. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
