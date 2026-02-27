import { Shield, Clock, Gem } from "lucide-react";

const ProblemSolutionSection = () => {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
              The Problem &amp; Solution
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-8">
              Why Scent Studio is Better for<br />
              <span className="italic">Your Skin</span> (and Your Budget)
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-10" />
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Traditional designer perfumes are up to 80% alcohol. You're paying for a brand name and a scent that disappears in the heat.
            </p>
          </div>

          <div className="text-center mb-10">
            <h3 className="font-display text-2xl font-light text-foreground mb-10">
              The Scent Studio Difference
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6 border border-border rounded-lg bg-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display text-lg font-medium text-foreground mb-3">Intensity that Stays</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Because our fragrances are oil-based, they don't just sit on the air—they stay on your skin.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border border-border rounded-lg bg-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Gem className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display text-lg font-medium text-foreground mb-3">The Secret to Your Wardrobe</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Stop saving your "good" perfume for special occasions. At our prices, you can afford to smell like luxury every single day.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border border-border rounded-lg bg-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display text-lg font-medium text-foreground mb-3">Clean &amp; Safe</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                No harsh chemicals or drying agents—just pure, high-concentration oil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
