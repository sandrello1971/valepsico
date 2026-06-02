import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from '@/components/ScrollToTop';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
// Homepage caricata subito per il primo paint più veloce; le altre route in lazy.
import Index from "./pages/Index";
const ChiSono = lazy(() => import("./pages/ChiSono"));
const Servizi = lazy(() => import("./pages/Servizi"));
const Approccio = lazy(() => import("./pages/Approccio"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const Contatti = lazy(() => import("./pages/Contatti"));
const Prenota = lazy(() => import("./pages/Prenota"));
const PrenotaConferma = lazy(() => import("./pages/PrenotaConferma"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main id="main-content" className="flex-1">
            <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chi-sono" element={<ChiSono />} />
                <Route path="/servizi" element={<Servizi />} />
                <Route path="/percorsi" element={<Servizi />} />
                <Route path="/approccio" element={<Approccio />} />

                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/contatti" element={<Contatti />} />
                <Route path="/prenota" element={<Prenota />} />
                <Route path="/prenota/conferma" element={<PrenotaConferma />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CookieBanner />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
