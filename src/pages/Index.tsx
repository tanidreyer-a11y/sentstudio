import Header from "@/components/Header";
import exclusiveBg from "@/assets/exclusive-bg.png";
import HeroSection from "@/components/HeroSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import SignatureFragranceSection from "@/components/SignatureFragranceSection";
import AboutSection from "@/components/AboutSection";
import WhyScentStudio from "@/components/WhyScentStudio";
import NewsletterSection from "@/components/NewsletterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SiteFooter from "@/components/SiteFooter";
import LiveTrafficSignal from "@/components/LiveTrafficSignal";
import JournalPreview from "@/components/JournalPreview";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import collectionMen from "@/assets/collection-men.jpeg";
import collectionWomen from "@/assets/collection-women.jpeg";

const Index = () => {
  const navigate = useNavigate();
  const [hintOpen, setHintOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleCategoryClick = (e: React.MouseEvent, path: string) => {
    if (sessionStorage.getItem("findMyScentHintSeen")) return; // let Link navigate normally
    e.preventDefault();
    sessionStorage.setItem("findMyScentHintSeen", "1");
    setPendingPath(path);
    setHintOpen(true);
  };

  const continueToPath = () => {
    setHintOpen(false);
    if (pendingPath) navigate(pendingPath);
  };

  const goToFindMyScent = () => {
    setHintOpen(false);
    navigate("/find-my-scent");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Legal Disclaimer Banner */}
      <div className="bg-secondary border-y border-border">
        <div className="container mx-auto px-6 py-3 text-center">
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground">
            All fragrances are inspired alternatives — not original designer products
          </p>
        </div>
      </div>

      {/* For Him / For Her Links */}
      <section id="shop-collection" className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
            <Link
              to="/catalog/men"
              onClick={(e) => handleCategoryClick(e, "/catalog/men")}
              className="group relative flex h-56 items-center justify-center overflow-hidden border border-border transition-colors duration-500 hover:border-primary sm:h-64"
            >
              <img
                src={collectionMen}
                alt="Men's fragrance collection"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/50 transition-colors duration-500 group-hover:bg-background/40" />
              <div className="relative text-center">
                <p className="mb-1.5 font-sans text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground sm:mb-2 sm:text-xs">Collection</p>
                <h3 className="font-display text-2xl font-light text-foreground transition-colors group-hover:text-primary sm:text-3xl">For Him</h3>
              </div>
            </Link>
            <Link
              to="/catalog/women"
              onClick={(e) => handleCategoryClick(e, "/catalog/women")}
              className="group relative flex h-56 items-center justify-center overflow-hidden border border-border transition-colors duration-500 hover:border-primary sm:h-64"
            >
              <img
                src={collectionWomen}
                alt="Women's fragrance collection"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/50 transition-colors duration-500 group-hover:bg-background/40" />
              <div className="relative text-center">
                <p className="mb-1.5 font-sans text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground sm:mb-2 sm:text-xs">Collection</p>
                <h3 className="font-display text-2xl font-light text-foreground transition-colors group-hover:text-primary sm:text-3xl">For Her</h3>
              </div>
            </Link>
          </div>

          {/* Exclusive Collection Entry */}
          <div className="mt-6 md:mt-8">
            <Link
              to="/exclusive"
              onClick={(e) => handleCategoryClick(e, "/exclusive")}
              className="group relative flex h-40 items-center justify-center overflow-hidden border border-primary/30 transition-all duration-500 hover:border-primary sm:h-48"
            >
              <img
                src={exclusiveBg}
                alt="Exclusive collection"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/60 transition-colors duration-500 group-hover:bg-background/50" />
              <div className="relative text-center">
                <p className="mb-1.5 font-sans text-[0.6rem] uppercase tracking-[0.4em] text-primary sm:mb-2 sm:text-xs">Premium & Ultra Premium</p>
                <h3 className="font-display text-2xl font-light text-foreground transition-colors group-hover:text-primary sm:text-3xl">Exclusive Collection</h3>
                <p className="mt-2 font-sans text-xs text-muted-foreground">From R130 · For the discerning connoisseur</p>
              </div>
            </Link>
          </div>

          {/* Live Traffic */}
          <div className="mt-8 text-center md:mt-12">
            <LiveTrafficSignal />
          </div>
        </div>
      </section>

      <FeaturedCollection />
      <WhyScentStudio />
      <AboutSection />
      <SignatureFragranceSection />
      <TestimonialsSection />
      <NewsletterSection />
      <JournalPreview />
      <SiteFooter />

      <Dialog open={hintOpen} onOpenChange={setHintOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center font-display text-2xl font-light">
              Not sure which scent suits you?
            </DialogTitle>
            <DialogDescription className="text-center font-body text-sm leading-relaxed">
              Try our <span className="text-primary font-medium">Find My Scent</span> stylist —
              answer a few quick questions and we'll match you with your perfect fragrance in under 60 seconds.
              You'll find this helper anytime in the bottom-right corner.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
            <button
              onClick={goToFindMyScent}
              className="w-full rounded-md bg-primary px-4 py-2.5 font-sans text-xs uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Find My Scent
            </button>
            <button
              onClick={continueToPath}
              className="w-full rounded-md border border-border px-4 py-2.5 font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
