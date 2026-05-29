import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import logo from '@/assets/Logo_vale.png';

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
              <p className="text-sm text-muted-foreground">info@valentinaandolfi.it</p>
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
              <Link to="/percorsi" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Percorsi
              </Link>
              <Link to="/approccio" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Approccio
              </Link>
              <Link to="/contatti" className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
                Contatti
              </Link>
            </nav>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Informazioni</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Milano e Online</p>
              <p>Studio Velasca, Piazza Velasca 6 &ndash; Milano</p>
              <p>Centro Persona, Via degli Aceri 2 &ndash; Buccinasco</p>
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
          <p className="text-xs text-muted-foreground max-w-3xl mx-auto">
            Iscritta all'Ordine degli Psicologi della Lombardia n. 17065 &middot; P.IVA 11786230968 &middot; Le prestazioni psicologiche sono detraibili fiscalmente al 19%.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
