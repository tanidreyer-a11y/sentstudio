import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { perfumes } from "@/data/perfumes";
import { getPerfumeImage } from "@/lib/perfume-images";
import { Grid3X3, Rows3 } from "lucide-react";

const ExclusivePage = () => {
  const [view, setView] = useState<"scroll" | "grid">("scroll");

  const exclusive = perfumes.filter((p) => {
    const price30 = p.prices["30ml"] ?? 0;
    return price30 >= 130;
  });

  const menExclusive = exclusive.filter((p) => p.gender === "men");
  const womenExclusive = exclusive.filter((p) => p.gender === "women");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
              Premium Selection
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Exclusive Collection
            </h1>
            <p className="font-body text-base text-muted-foreground mt-4 max-w-lg mx-auto">
              Our finest fragrances — premium and ultra-premium oils for the true connoisseur
            </p>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          {/* View toggle */}
          <div className="flex justify-end mb-8">
            <div className="flex border border-border">
              <button
                onClick={() => setView("scroll")}
                className={`p-2 transition-colors ${view === "scroll" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Horizontal scroll view"
              >
                <Rows3 size={18} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </div>

          {/* For Him */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-light text-foreground mb-6">For Him</h2>
            {view === "scroll" ? (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {menExclusive.map((p) => (
                  <ExclusiveCard key={p.id} perfume={p} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {menExclusive.map((p) => (
                  <ExclusiveCard key={p.id} perfume={p} />
                ))}
              </div>
            )}
          </div>

          {/* For Her */}
          <div>
            <h2 className="font-display text-2xl font-light text-foreground mb-6">For Her</h2>
            {view === "scroll" ? (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {womenExclusive.map((p) => (
                  <ExclusiveCard key={p.id} perfume={p} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {womenExclusive.map((p) => (
                  <ExclusiveCard key={p.id} perfume={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

const ExclusiveCard = ({ perfume }: { perfume: typeof perfumes[0] }) => {
  const image = getPerfumeImage(perfume.gender, perfume.category);
  const price30 = perfume.prices["30ml"] ?? 0;
  const isUltra = price30 >= 160;

  return (
    <Link
      to={`/perfume/${perfume.id}`}
      className="group cursor-pointer flex-shrink-0 w-56 sm:w-64 snap-start"
    >
      <div className="relative overflow-hidden mb-4 bg-card aspect-[3/4] flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="font-display text-5xl font-light text-primary/80">
            {perfume.name.charAt(0)}
          </span>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
        {/* Premium badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 text-[10px] tracking-[0.2em] uppercase font-sans ${
          isUltra
            ? "bg-primary text-primary-foreground"
            : "border border-primary text-primary"
        }`}>
          {isUltra ? "Ultra Premium" : "Premium"}
        </div>
      </div>
      <p className="font-sans text-[10px] tracking-wider text-muted-foreground/70 uppercase mb-0.5">Inspired by</p>
      <h3 className="font-display text-base font-medium text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {perfume.name}
      </h3>
      <p className="font-sans text-sm tracking-wider text-primary font-medium">
        From R{price30}
      </p>
    </Link>
  );
};

export default ExclusivePage;
