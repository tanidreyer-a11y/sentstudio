import { Link } from "react-router-dom";
import { Droplets, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ValuesSection = () => {
  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
            What Are Our Values
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-10">
            The Designer Fragrance You Love,<br />
            <span className="italic">Re-Engineered</span>
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mb-12" />

          <p className="font-body text-lg text-secondary-foreground/80 leading-relaxed mb-12">
            The designer fragrance you love, re-engineered to last longer and cost less.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14 text-left">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">100% Oil-Based</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Forget alcohol-based sprays that evaporate by noon. Our oil-fed formulas sink into the skin for 10–12 hours of intensity.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">Kind to Skin</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                A healthier, lighter alternative that won't sting or dry out your skin.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">Confidence in a Bottle</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                High-vibrant scents inspired by the world's most iconic houses.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-sans text-xs tracking-[0.2em] uppercase">
              <Link to="/quiz">Find My Scent AI</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-sans text-xs tracking-[0.2em] uppercase">
              <Link to="/catalog/men">Shop the Catalog</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
