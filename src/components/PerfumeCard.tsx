import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Perfume } from "@/data/perfumes";
import { getPerfumeImage } from "@/lib/perfume-images";
import { getPricingTier, tierLabel } from "@/lib/pricing-tiers";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

const useTrafficSignal = (perfumeId: string) => {
  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < perfumeId.length; i++) {
      h = (Math.imul(31, h) + perfumeId.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }, [perfumeId]);

  const [viewers, setViewers] = useState(() => (seed % 30) + 5);
  const [sold, setSold] = useState(() => (seed % 8) + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => Math.max(3, Math.min(40, prev + Math.floor(Math.random() * 5) - 2)));
      if (Math.random() < 0.25) {
        setSold((prev) => Math.max(1, Math.min(12, prev + (Math.random() < 0.5 ? 1 : -1))));
      }
    }, 4000 + (seed % 3000));
    return () => clearInterval(interval);
  }, [seed]);

  return { viewers, sold };
};

const PerfumeCard = ({ perfume }: { perfume: Perfume }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const tier = getPricingTier(perfume);
  const { viewers, sold } = useTrafficSignal(perfume.id);

  const defaultSize = perfume.prices["50ml"] != null ? "50ml" : perfume.prices["30ml"] != null ? "30ml" : "100ml";
  const defaultPrice = perfume.prices[defaultSize] || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      perfumeId: perfume.id,
      name: perfume.name,
      size: defaultSize as "30ml" | "50ml" | "100ml",
      price: defaultPrice,
      gender: perfume.gender,
    });
    toast.success(`${perfume.name} added to cart`);
  };

  return (
    <div className="group relative">
      <Link to={`/perfume/${perfume.id}`}>
        <div className="relative overflow-hidden mb-4 bg-card aspect-[3/4] flex items-center justify-center">
          {getPerfumeImage(perfume.gender, perfume.category, perfume.id) ? (
            <img
              src={getPerfumeImage(perfume.gender, perfume.category, perfume.id)}
              alt={perfume.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="font-display text-6xl font-light text-primary/80">
              {perfume.name.charAt(0)}
            </span>
          )}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
          {tier !== "standard" && (
            <span className={`absolute top-3 left-3 px-3 py-1 font-sans text-[10px] tracking-[0.15em] uppercase backdrop-blur-sm ${
              tier === "ultra-premium"
                ? "bg-primary/90 text-primary-foreground"
                : "bg-secondary/90 text-primary border border-primary/30"
            }`}>
              {tierLabel[tier]}
            </span>
          )}
          {/* Live traffic signal overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-2 py-1.5 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <Eye size={10} />
              <span className="text-foreground font-medium">{viewers}</span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <ShoppingBag size={10} className="text-primary" />
              <span className="text-foreground font-medium">{sold}</span>
              <span className="hidden sm:inline">sold/hr</span>
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 p-2 bg-background/60 backdrop-blur-sm rounded-full text-muted-foreground hover:text-primary transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart size={16} fill={wishlisted ? "hsl(var(--primary))" : "none"} className={wishlisted ? "text-primary" : ""} />
      </button>

      <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">
        {perfume.category}
      </p>
      <Link to={`/perfume/${perfume.id}`}>
        <p className="font-sans text-[10px] tracking-wider text-muted-foreground/70 uppercase mb-0.5">Inspired by</p>
        <h3 className="font-display text-lg font-medium text-foreground mb-1 hover:text-primary transition-colors">
          {perfume.name}
        </h3>
      </Link>
      <p className="font-sans text-sm tracking-wider text-primary font-medium mb-3">
        From R{perfume.prices["30ml"] || perfume.prices["50ml"] || perfume.prices["100ml"]}
      </p>
      <button
        onClick={handleAddToCart}
        className="w-full py-2.5 border border-border font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default PerfumeCard;
