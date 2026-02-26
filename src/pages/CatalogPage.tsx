import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PerfumeCard from "@/components/PerfumeCard";
import { getPerfumesByGender } from "@/data/perfumes";

const CatalogPage = () => {
  const { gender } = useParams<{ gender: string }>();
  const validGender = gender === "men" || gender === "women" ? gender : "men";
  const perfumes = getPerfumesByGender(validGender);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
              {validGender === "men" ? "For Him" : "For Her"}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              {validGender === "men" ? "Men's" : "Women's"} Collection
            </h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default CatalogPage;
