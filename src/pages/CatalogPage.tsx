import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PerfumeCard from "@/components/PerfumeCard";
import { getPerfumesByGender } from "@/data/perfumes";
import type { Perfume } from "@/data/perfumes";
import { getMenMuskyScene, menMuskyPanorama } from "@/lib/perfume-images";
import { Grid3X3, Rows3 } from "lucide-react";

const categories = ["All", "Luxury", "Fresh", "Musky", "Sweet"] as const;

const CatalogPage = () => {
  const { gender } = useParams<{ gender: string }>();
  const validGender = gender === "men" || gender === "women" ? gender : "men";
  const allPerfumes = getPerfumesByGender(validGender);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [view, setView] = useState<"scroll" | "grid">("scroll");

  const filteredPerfumes = activeCategory === "All"
    ? allPerfumes
    : allPerfumes.filter((p) => p.category === activeCategory);

  const isContinuousMenMuskyRow = view === "scroll" && validGender === "men" && activeCategory === "Musky";
  const panoramaSegments = isContinuousMenMuskyRow ? filteredPerfumes.length : 0;

  const getOverride = (perfume: Perfume, idx: number) =>
    isContinuousMenMuskyRow
      ? menMuskyPanorama
      : perfume.gender === "men" && perfume.category === "Musky"
      ? getMenMuskyScene(idx)
      : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
              {validGender === "men" ? "For Him" : "For Her"}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              {validGender === "men" ? "Men's" : "Women's"} Collection
            </h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 border transition-all duration-300 ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex justify-end mb-6">
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

          {view === "scroll" ? (
            <div className={`overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide ${isContinuousMenMuskyRow ? "" : ""}`}>
              <div className={`flex ${isContinuousMenMuskyRow ? "gap-0" : "gap-6"}`}>
              {filteredPerfumes.map((perfume, idx) => (
                <div key={perfume.id} className={`flex-shrink-0 snap-start ${isContinuousMenMuskyRow ? "w-56 sm:w-64" : "w-56 sm:w-64"}`}>
                  <PerfumeCard
                    perfume={perfume}
                    imageOverride={getOverride(perfume, idx)}
                    imageClassName={isContinuousMenMuskyRow ? "max-w-none" : undefined}
                    imageStyle={isContinuousMenMuskyRow ? {
                      width: `${panoramaSegments * 100}%`,
                      maxWidth: "none",
                      objectFit: "cover",
                      objectPosition: `${panoramaSegments <= 1 ? 50 : (idx / (panoramaSegments - 1)) * 100}% center`,
                    } : undefined}
                    cardClassName={isContinuousMenMuskyRow ? "[&>a>div]:mb-5" : undefined}
                  />
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPerfumes.map((perfume, idx) => (
                <PerfumeCard key={perfume.id} perfume={perfume} imageOverride={getOverride(perfume, idx)} />
              ))}
            </div>
          )}

          {filteredPerfumes.length === 0 && (
            <p className="text-center text-muted-foreground font-body text-lg mt-8">
              No perfumes found in this category.
            </p>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default CatalogPage;
