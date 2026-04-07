import { useState } from "react";
import { LayoutGrid, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PerfumeCard from "@/components/PerfumeCard";
import { perfumes } from "@/data/perfumes";

const ExclusivePage = () => {
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");

  const premiumPerfumes = perfumes.filter((p) => {
    const price30 = p.prices["30ml"];
    return price30 != null && price30 >= 130;
  });

  const menPremium = premiumPerfumes.filter((p) => p.gender === "men");
  const womenPremium = premiumPerfumes.filter((p) => p.gender === "women");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
              Premium Selection
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Exclusive Collection
            </h1>
            <p className="font-body text-base text-muted-foreground mt-4 max-w-lg mx-auto">
              Our finest fragrances — premium and ultra-premium oils for the discerning collector
            </p>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          {/* View toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setViewMode(viewMode === "scroll" ? "grid" : "scroll")}
              className="flex items-center gap-2 px-4 py-2 border border-border font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {viewMode === "scroll" ? (
                <>
                  <LayoutGrid size={14} />
                  View as Grid
                </>
              ) : (
                <>
                  <ArrowRight size={14} />
                  Scroll View
                </>
              )}
            </button>
          </div>

          {/* Men's Premium */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-light text-foreground mb-6">For Him</h2>
            {viewMode === "scroll" ? (
              <div className="overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex gap-6" style={{ width: "max-content" }}>
                  {menPremium.map((p) => (
                    <div key={p.id} className="w-52 sm:w-60 flex-shrink-0">
                      <PerfumeCard perfume={p} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {menPremium.map((p) => (
                  <PerfumeCard key={p.id} perfume={p} />
                ))}
              </div>
            )}
          </div>

          {/* Women's Premium */}
          <div>
            <h2 className="font-display text-2xl font-light text-foreground mb-6">For Her</h2>
            {viewMode === "scroll" ? (
              <div className="overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex gap-6" style={{ width: "max-content" }}>
                  {womenPremium.map((p) => (
                    <div key={p.id} className="w-52 sm:w-60 flex-shrink-0">
                      <PerfumeCard perfume={p} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {womenPremium.map((p) => (
                  <PerfumeCard key={p.id} perfume={p} />
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

export default ExclusivePage;
