import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Perfume } from "@/data/perfumes";
import { getPerfumeImage } from "@/lib/perfume-images";
import { getPricingTier, tierLabel } from "@/lib/pricing-tiers";
import { useState } from "react";
import { toast } from "sonner";

const PerfumeCard = ({ perfume, imageOverride }: { perfume: Perfume; imageOverride?: string }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const tier = getPricingTier(perfume);

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
          {(imageOverride || getPerfumeImage(perfume.gender, perfume.category)) ? (
            <img
              src={imageOverride || getPerfumeImage(perfume.gender, perfume.category)}
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
