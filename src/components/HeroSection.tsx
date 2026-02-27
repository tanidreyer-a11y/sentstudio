import { useEffect, useRef } from "react";
import heroImage from "@/assets/hero-perfume-bg.jpeg";

const HeroSection = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollY * 0.4}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 will-change-transform scale-110">
        <img
          src={heroImage}
          alt="Scent Studio luxury perfume collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary animate-fade-up mb-6">
          The Art of Fragrance
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground animate-fade-up-delay-1 mb-8">
          Scents That<br />
          <span className="italic font-medium text-gold-gradient">Define You</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-fade-up-delay-2 mb-10">
          Discover our curated collection of the world's most exquisite fragrances,
          handpicked for the discerning connoisseur.
        </p>
        <a
          href="#collection"
          className="inline-block font-sans text-sm tracking-[0.2em] uppercase px-10 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 animate-fade-up-delay-3"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
