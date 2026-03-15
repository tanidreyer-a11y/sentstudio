import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import SignatureFragranceSection from "@/components/SignatureFragranceSection";
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
      <section className="bg-background py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Link
              to="/catalog/men"
              className="group relative flex h-64 items-center justify-center overflow-hidden border border-border bg-secondary transition-colors duration-500 hover:border-primary"
            >
              <div className="text-center">
                <p className="mb-2 font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">Collection</p>
                <h3 className="font-display text-3xl font-light text-foreground transition-colors group-hover:text-primary">For Him</h3>
              </div>
            </Link>
            <Link
              to="/catalog/women"
              className="group relative flex h-64 items-center justify-center overflow-hidden border border-border bg-secondary transition-colors duration-500 hover:border-primary"
            >
              <div className="text-center">
                <p className="mb-2 font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">Collection</p>
                <h3 className="font-display text-3xl font-light text-foreground transition-colors group-hover:text-primary">For Her</h3>
              </div>
            </Link>
          </div>

          {/* Find My Scent CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 font-sans text-sm text-muted-foreground">Not sure what suits you?</p>
            <Link
              to="/find-my-scent"
              className="inline-block border border-primary px-10 py-4 font-sans text-sm uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              Find My Scent
            </Link>
          </div>
        </div>
      </section>

      <FeaturedCollection />
      <SignatureFragranceSection />
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
