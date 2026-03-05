import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const changeTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  }, [isAnimating]);

  const next = useCallback(() => {
    changeTo((current + 1) % testimonials.length);
  }, [current, changeTo]);

  const prev = useCallback(() => {
    changeTo((current - 1 + testimonials.length) % testimonials.length);
  }, [current, changeTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">What Our Clients Say</h2>
          <div className="w-16 h-px bg-primary mx-auto mt-8" />
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div
            className={`min-h-[220px] flex flex-col items-center justify-center text-center px-8 md:px-16 transition-all duration-300 ease-in-out ${
              isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={16} className="text-primary fill-primary" />
              ))}
            </div>
            <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 italic">
              "{t.text}"
            </p>
            <div>
              <p className="font-display text-base text-foreground">{t.name}</p>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary mt-1">{t.perfume}</p>
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => changeTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-primary" : "bg-border"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <div className="text-center mt-10">
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
