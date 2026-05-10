import { Link } from "react-router-dom";
import { Droplets, Heart, Sparkles, Clock, Gem, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Droplets,
    title: "100% Oil-Based",
    text: "Sinks into skin for 10–12 hours of intensity — no midday fade.",
  },
  {
    icon: Clock,
    title: "Intensity that Stays",
    text: "Oil-fed formulas stay on your skin instead of evaporating into the air.",
  },
  {
    icon: Heart,
    title: "Kind to Skin",
    text: "No harsh alcohol, no sting, no dryness — just clean fragrance oil.",
  },
  {
    icon: Gem,
    title: "Everyday Luxury",
    text: "Designer-inspired scents from R100 — no need to save for special occasions.",
  },
  {
    icon: Shield,
    title: "Clean & Safe",
    text: "No drying agents or harsh chemicals. High-concentration oil only.",
  },
  {
    icon: Sparkles,
    title: "Confidence in a Bottle",
    text: "Inspired by the world's most iconic fragrance houses.",
  },
];

const WhyScentStudio = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-primary mb-4">
              Why Scent Studio
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground">
              Designer Fragrance,<br />
              <span className="italic">Re-Engineered</span>
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-6 border border-border rounded-lg bg-card"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 md:mt-14">
            <Button asChild size="lg" className="font-sans text-xs tracking-[0.2em] uppercase">
              <Link to="/catalog/men">Shop the Catalog</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-sans text-xs tracking-[0.2em] uppercase">
              <Link to="/find-my-scent">Find My Scent AI</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyScentStudio;