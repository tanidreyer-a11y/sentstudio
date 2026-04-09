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
import LiveTrafficSignal from "@/components/LiveTrafficSignal";
import { Link } from "react-router-dom";
import collectionMen from "@/assets/collection-men.jpeg";
import collectionWomen from "@/assets/collection-women.jpeg";

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
      <section id="shop-collection" className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
            <Link
              to="/catalog/men"
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
              className="group relative flex h-40 items-center justify-center overflow-hidden border border-primary/30 bg-gradient-to-r from-card via-card to-card transition-all duration-500 hover:border-primary sm:h-48"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 group-hover:from-primary/10 group-hover:to-primary/10 transition-colors duration-500" />
              <div className="relative text-center">
                <p className="mb-1.5 font-sans text-[0.6rem] uppercase tracking-[0.4em] text-primary sm:mb-2 sm:text-xs">Premium & Ultra Premium</p>
                <h3 className="font-display text-2xl font-light text-foreground transition-colors group-hover:text-primary sm:text-3xl">Exclusive Collection</h3>
                <p className="mt-2 font-sans text-xs text-muted-foreground">From R130 · For the discerning connoisseur</p>
              </div>
            </Link>
          </div>

          {/* Explore Collection CTA + Find My Scent + Live Traffic */}
          <div className="mt-8 text-center space-y-6 md:mt-12">
            <div>
              <p className="mb-3 font-sans text-xs text-muted-foreground sm:mb-4 sm:text-sm">Not sure what suits you?</p>
              <Link
                to="/find-my-scent"
                className="inline-block border border-primary px-8 py-3 font-sans text-xs uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:bg-primary hover:text-primary-foreground sm:px-10 sm:py-4 sm:text-sm"
              >
                Find My Scent
              </Link>
            </div>
            <LiveTrafficSignal />
          </div>
        </div>
      </section>

      <SignatureFragranceSection />
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
