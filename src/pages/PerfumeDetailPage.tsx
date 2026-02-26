import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { getPerfumeById } from "@/data/perfumes";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const PerfumeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const perfume = getPerfumeById(id || "");
  const [selectedSize, setSelectedSize] = useState<"30ml" | "50ml" | "100ml">("50ml");

  if (!perfume) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Perfume not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      perfumeId: perfume.id,
      name: perfume.name,
      size: selectedSize,
      price: perfume.prices[selectedSize],
      gender: perfume.gender,
    });
    toast.success(`${perfume.name} (${selectedSize}) added to cart`);
  };

  const sizes: ("30ml" | "50ml" | "100ml")[] = ["30ml", "50ml", "100ml"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-sans text-sm tracking-wider text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Image */}
            <div className="bg-secondary aspect-square flex items-center justify-center border border-border">
              <span className="font-display text-9xl text-primary/20">{perfume.name[0]}</span>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
                {perfume.category} · {perfume.gender === "men" ? "For Him" : "For Her"}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
                {perfume.name}
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8">
                {perfume.description}
              </p>

              {/* Notes Tabs */}
              <Tabs defaultValue="top" className="mb-8">
                <TabsList className="bg-secondary border border-border w-full">
                  <TabsTrigger value="top" className="flex-1 font-sans text-xs tracking-[0.2em] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Top Notes
                  </TabsTrigger>
                  <TabsTrigger value="middle" className="flex-1 font-sans text-xs tracking-[0.2em] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Middle Notes
                  </TabsTrigger>
                  <TabsTrigger value="base" className="flex-1 font-sans text-xs tracking-[0.2em] uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Base Notes
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="top" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.top.map((note) => (
                      <span key={note} className="px-4 py-2 bg-secondary border border-border font-body text-sm text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="middle" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.middle.map((note) => (
                      <span key={note} className="px-4 py-2 bg-secondary border border-border font-body text-sm text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="base" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.base.map((note) => (
                      <span key={note} className="px-4 py-2 bg-secondary border border-border font-body text-sm text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Size Selector */}
              <div className="mb-8">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Size</p>
                <div className="flex gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border font-sans text-sm tracking-wider transition-all duration-300 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {size} — R{perfume.prices[size]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
              >
                Add to Cart — R{perfume.prices[selectedSize]}
              </button>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default PerfumeDetailPage;
