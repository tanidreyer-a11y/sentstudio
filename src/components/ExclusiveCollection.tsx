import { perfumes } from "@/data/perfumes";
import PerfumeCard from "./PerfumeCard";

const ExclusiveCollection = () => {
  const premiumPerfumes = perfumes.filter((p) => {
    const price30 = p.prices["30ml"];
    return price30 != null && price30 >= 130;
  });

  if (premiumPerfumes.length === 0) return null;

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
            Premium Selection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
            Exclusive Collection
          </h2>
          <p className="font-body text-base text-muted-foreground mt-4 max-w-lg mx-auto">
            Our finest fragrances — premium and ultra-premium oils for the discerning collector
          </p>
          <div className="w-16 h-px bg-primary mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {premiumPerfumes.map((p) => (
            <PerfumeCard key={p.id} perfume={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExclusiveCollection;
