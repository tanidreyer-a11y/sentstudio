import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import { perfumes } from "@/data/perfumes";
import { getPerfumeImage } from "@/lib/perfume-images";

const ExclusiveCollection = () => {
  // All perfumes with 30ml price >= R130
  const exclusivePerfumes = perfumes.filter((p) => {
    const price30 = p.prices["30ml"];
    return price30 != null && price30 >= 130;
  });

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown size={18} className="text-primary" />
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary">
              Exclusive
            </p>
            <Crown size={18} className="text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            Premium Collection
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Our finest curated fragrances — rare, luxurious, and unforgettable
          </p>
          <div className="w-16 h-px bg-primary mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exclusivePerfumes.map((perfume) => {
            const image = getPerfumeImage(perfume.gender, perfume.category, perfume.id);
            return (
              <Link
                key={perfume.id}
                to={`/perfume/${perfume.id}`}
                className="group relative overflow-hidden border border-primary/20 bg-card transition-all duration-500 hover:border-primary hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={perfume.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <span className="font-display text-5xl text-primary/30">
                        {perfume.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 font-sans text-[10px] tracking-[0.15em] uppercase bg-primary/90 text-primary-foreground backdrop-blur-sm">
                    Exclusive
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-sans text-[10px] tracking-wider text-muted-foreground/70 uppercase mb-0.5">
                    Inspired by
                  </p>
                  <h3 className="font-display text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {perfume.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">
                      {perfume.gender === "men" ? "For Him" : "For Her"} · {perfume.category}
                    </p>
                    <p className="font-sans text-sm tracking-wider text-primary font-medium">
                      From R{perfume.prices["30ml"]}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExclusiveCollection;
