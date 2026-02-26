import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import AboutSection from "@/components/AboutSection";
import NewsletterSection from "@/components/NewsletterSection";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* For Him / For Her Links */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/catalog/men"
              className="group relative overflow-hidden bg-secondary h-64 flex items-center justify-center border border-border hover:border-primary transition-colors duration-500"
            >
              <div className="text-center">
                <p className="font-sans text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">Collection</p>
                <h3 className="font-display text-3xl font-light text-foreground group-hover:text-primary transition-colors">For Him</h3>
              </div>
            </Link>
            <Link
              to="/catalog/women"
              className="group relative overflow-hidden bg-secondary h-64 flex items-center justify-center border border-border hover:border-primary transition-colors duration-500"
            >
              <div className="text-center">
                <p className="font-sans text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">Collection</p>
                <h3 className="font-display text-3xl font-light text-foreground group-hover:text-primary transition-colors">For Her</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FeaturedCollection />
      <AboutSection />
      <NewsletterSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
