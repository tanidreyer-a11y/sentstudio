import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Our Story</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-10">
              About <span className="italic">Scent Studio</span>
            </h1>
            <div className="w-16 h-px bg-primary mx-auto mb-10" />
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Scent Studio was born from a deep passion for the art of fragrance. We believe that every person deserves 
              to find a scent that speaks to their soul — a scent that tells their story without words.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Our curated collection features fragrances that span the full spectrum of olfactory art, from fresh 
              and invigorating citrus compositions to deep, mysterious ouds. Each fragrance in our studio has been 
              carefully selected for its quality, longevity, and character.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              We are more than a perfume shop — we are your personal fragrance consultants. Whether you're searching 
              for your signature scent or the perfect gift, our team is here to guide you through a sensory journey 
              you'll never forget.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border mt-12">
              {[
                { number: "500+", label: "Happy Customers" },
                { number: "16+", label: "Curated Fragrances" },
                { number: "100%", label: "Oil-Based Formulas" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl text-primary mb-2">{stat.number}</p>
                  <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
