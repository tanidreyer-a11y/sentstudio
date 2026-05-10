import { Sparkles, Compass, Gem } from "lucide-react";

const points = [
  {
    icon: Sparkles,
    title: "Intimate Self-Expression",
    text: "Fragrance is the most personal way to tell your story.",
  },
  {
    icon: Gem,
    title: "Designer-Inspired Oils",
    text: "The scent profiles you love — at a fraction of the price, with longer-lasting intensity.",
  },
  {
    icon: Compass,
    title: "Expertly Guided",
    text: "Our consultants help you discover the fragrance that truly fits you.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
          <p className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-primary mb-4">
            Our Philosophy
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-6">
            The Essence of<br />
            <span className="italic">True Luxury</span>
          </h2>
          <div className="w-16 h-px bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
            {points.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 border border-border rounded-lg bg-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
