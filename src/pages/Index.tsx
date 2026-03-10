import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import AboutSection from "@/components/AboutSection";
import ValuesSection from "@/components/ValuesSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import NewsletterSection from "@/components/NewsletterSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";

const Index = () => {
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

          {/* Find My Scent CTA */}
          <div className="text-center mt-12">
            <p className="font-sans text-sm text-muted-foreground mb-4">Not sure what suits you?</p>
            <Link
              to="/find-my-scent"
              className="inline-block px-10 py-4 border border-primary text-primary font-sans text-sm tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              Find My Scent
            </Link>
          </div>
        </div>
      </section>

      <FeaturedCollection />
      <AboutSection />
      <ValuesSection />
      <ProblemSolutionSection />
      <TestimonialsSection />
      <NewsletterSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
