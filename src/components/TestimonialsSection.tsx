import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  { name: "Samantha Dreyer", text: "I'd like to extend my gratitude to Nathaniel from Scent Studio for providing exceptional service when I purchased my J'adore fragrance. The moment I smelled it, I was transported back to a joyful time in my life – truly nostalgic!", perfume: "J'adore" },
  { name: "Blake", text: "I recently tried Scent Studio, and I'm genuinely impressed. Their perfumes are unique, long-lasting, and have a quality that stands out from the rest. Each scent feels carefully crafted and truly unforgettable.", perfume: "Creed Aventus" },
  { name: "Kealen", text: "My experience with Scent Studio was amazing. The quality of their products and attention to detail are next level. Definitely my go-to spot for unique, long-lasting scents.", perfume: "Dior Sauvage" },
  { name: "Leila", text: "Scent Studio has created a beautiful experience for me. Their scents not only smell phenomenal, but last incredibly long. I get countless compliments and questions about what scent I'm wearing.", perfume: "Good Girl" },
  { name: "Thandi M.", text: "Absolutely divine! I get compliments every single time I wear it. Scent Studio has the best collection.", perfume: "Chanel No.5" },
  { name: "Michael R.", text: "Beast mode. The projection is insane and it just works. My new signature scent.", perfume: "Paco Rabanne Invictus" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">What Our Clients Say</h2>
          <div className="w-16 h-px bg-primary mx-auto mt-8" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-lg border border-border bg-card p-6 text-left"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="mt-auto">
                  <p className="font-display text-base text-foreground">{t.name}</p>
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-primary mt-1">
                    Inspired by {t.perfume}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/reviews"
              className="font-sans text-sm tracking-[0.2em] uppercase text-primary hover:text-gold-light transition-colors border-b border-primary pb-1"
            >
              Read All Reviews
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
