import { useMemo, useState } from "react";
import { Sparkles, Droplets, FlaskConical, Search, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { perfumes } from "@/data/perfumes";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import heroPerfumeBg from "@/assets/hero-perfume-bg.jpeg";
import signatureBg from "@/assets/signature-bg.png";

type BottleSize = "30ml" | "50ml" | "100ml";

const blendLimits: Record<BottleSize, { maxFragrances: number; minOil: number; maxOil: number; price: number }> = {
  "30ml": { maxFragrances: 2, minOil: 10, maxOil: 20, price: 180 },
  "50ml": { maxFragrances: 3, minOil: 10, maxOil: 40, price: 250 },
  "100ml": { maxFragrances: 3, minOil: 10, maxOil: 40, price: 490 },
};

const packages: Array<{
  size: BottleSize;
  title: string;
  description: string;
  points: string[];
  highlight?: string;
}> = [
  {
    size: "30ml",
    title: "Perfect for experimenting with your own scent.",
    description: "A playful entry into custom blending.",
    points: ["Choose up to 2 fragrances to blend", "Select oil concentration between 10% – 20%"],
  },
  {
    size: "50ml",
    title: "The ideal balance of creativity and longevity.",
    description: "Craft your personal signature with full expression.",
    points: ["Choose up to 3 fragrances to blend", "Select oil concentration between 10% – 40%"],
    highlight: "Most Popular",
  },
  {
    size: "100ml",
    title: "Create a bold, long-lasting signature scent.",
    description: "Your identity bottled for everyday wear.",
    points: ["Choose up to 3 fragrances to blend", "Select oil concentration between 10% – 40%"],
  },
];

type GenderFilter = "all" | "men" | "women";
type CategoryFilter = "all" | "Luxury" | "Fresh" | "Musky" | "Sweet";

const SignatureFragranceSection = () => {
  const [selectedSize, setSelectedSize] = useState<BottleSize>("50ml");
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [oilConcentration, setOilConcentration] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const fragranceLibrary = useMemo(() => {
    let filtered = perfumes;
    if (genderFilter !== "all") filtered = filtered.filter((p) => p.gender === genderFilter);
    if (categoryFilter !== "all") filtered = filtered.filter((p) => p.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.middle.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.base.some((n) => n.toLowerCase().includes(q))
      );
    }
    // Deduplicate by name and sort
    const unique = [...new Map(filtered.map((p) => [p.name, p])).values()];
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, genderFilter, categoryFilter]);

  const limits = blendLimits[selectedSize];

  const handleSizeSelect = (size: BottleSize) => {
    const newLimits = blendLimits[size];
    setSelectedSize(size);
    setSelectedFragrances((prev) => prev.slice(0, newLimits.maxFragrances));
    setOilConcentration((prev) => Math.min(Math.max(prev, newLimits.minOil), newLimits.maxOil));
  };

  const toggleFragrance = (name: string) => {
    setSelectedFragrances((prev) => {
      if (prev.includes(name)) return prev.filter((item) => item !== name);
      if (prev.length >= limits.maxFragrances) return prev;
      return [...prev, name];
    });
  };

  const handleAddToCart = () => {
    if (selectedFragrances.length === 0) {
      toast({ title: "Select Fragrances", description: "Please select at least one fragrance for your blend.", variant: "destructive" });
      return;
    }

    const blendName = `Custom Blend (${selectedFragrances.join(" + ")})`;
    addToCart({
      perfumeId: `custom-blend-${Date.now()}`,
      name: blendName,
      size: selectedSize,
      price: limits.price,
      gender: "women", // neutral default
      customBlend: {
        fragrances: selectedFragrances,
        oilConcentration,
      },
    });

    toast({ title: "Added to Cart ✨", description: `Your ${selectedSize} signature blend has been added.` });
    setSelectedFragrances([]);
    setOilConcentration(limits.minOil + Math.round((limits.maxOil - limits.minOil) / 2));
  };

  const genderOptions: { value: GenderFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "men", label: "For Him" },
    { value: "women", label: "For Her" },
  ];

  const categoryOptions: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Luxury", label: "Luxury" },
    { value: "Fresh", label: "Fresh" },
    { value: "Musky", label: "Musky" },
    { value: "Sweet", label: "Sweet" },
  ];

  return (
    <section id="signature" className="relative overflow-hidden bg-background py-12 md:py-24 scroll-mt-24">
      <div className="absolute inset-0 opacity-20">
        <img src={heroPerfumeBg} alt="Luxury fragrance atmosphere" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative container mx-auto space-y-8 px-4 md:space-y-14 md:px-6">
        {/* Hero intro */}
        <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-primary md:mb-3 md:text-xs">Signature Fragrance</p>
            <h2 className="font-display text-2xl font-light text-foreground sm:text-3xl md:text-5xl">Craft Your Own Fragrance</h2>
            <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
              Create a fragrance that is uniquely yours.
              <br className="hidden md:block" />
              Choose your favourite scents from our fragrance library and blend them into a personalised signature perfume.
              Whether you prefer something bold, fresh, or seductive, this is your chance to craft a scent that tells your
              story.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border bg-card/70 p-3 shadow-xl backdrop-blur-sm md:p-4">
            <img src={signatureBg} alt="Signature perfume bottle" className="h-48 w-full rounded-lg object-cover sm:h-60 md:h-72" loading="lazy" />
            <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-border bg-background/75 px-3 py-2 backdrop-blur-sm md:bottom-8 md:left-8 md:right-8 md:px-4 md:py-3">
              <p className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-primary md:text-[0.65rem]">Luxury Blend Experience</p>
              <p className="mt-0.5 font-body text-xs text-foreground md:mt-1 md:text-sm">Glass bottle elegance, built around your story and mood.</p>
            </div>
          </div>
        </div>

        {/* Package cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {packages.map((pkg) => {
            const isActive = selectedSize === pkg.size;
            return (
              <Card
                key={pkg.size}
                className={`relative overflow-hidden border transition-all duration-300 ${
                  isActive ? "border-primary shadow-xl" : "border-border hover:border-primary/60 hover:shadow-lg"
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute right-3 top-3 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-primary md:right-4 md:top-4 md:px-3 md:py-1 md:text-[0.6rem]">
                    {pkg.highlight}
                  </span>
                )}
                <CardContent className="space-y-3 p-4 md:space-y-4 md:p-6">
                  <button onClick={() => handleSizeSelect(pkg.size)} className="w-full text-left">
                    <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground md:text-xs">{pkg.size}</p>
                    <p className="mt-1 font-display text-2xl text-foreground md:mt-2 md:text-3xl">R{blendLimits[pkg.size].price}</p>
                    <p className="mt-1 font-body text-sm text-foreground md:mt-2 md:text-base">{pkg.title}</p>
                    <p className="mt-0.5 font-body text-xs text-muted-foreground md:mt-1 md:text-sm">{pkg.description}</p>
                  </button>
                  <ul className="space-y-1.5 md:space-y-2">
                    {pkg.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 font-body text-xs text-muted-foreground md:text-sm">
                        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary md:h-3.5 md:w-3.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customization Builder */}
        <Card className="border-border bg-card/80 shadow-xl backdrop-blur-sm">
          <CardContent className="space-y-5 p-3 sm:p-4 md:space-y-8 md:p-8">
            <div>
              <p className="font-sans text-[0.6rem] uppercase tracking-[0.25em] text-primary sm:text-[0.65rem] md:text-xs">Customization Builder</p>
              <h3 className="mt-1 font-display text-lg font-light text-foreground sm:text-xl md:mt-2 md:text-3xl">Build Your Signature Blend</h3>
            </div>

            <div className="grid gap-5 md:gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5 md:space-y-6">
                {/* Step 1 – Bottle Size */}
                <div>
                  <p className="mb-2 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs md:mb-3">1. Choose Bottle Size</p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {(Object.keys(blendLimits) as BottleSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`rounded-lg border px-2 py-2.5 font-sans text-[0.65rem] uppercase tracking-[0.12em] transition-colors sm:px-3 sm:py-3 sm:text-xs sm:tracking-[0.18em] ${
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 – Fragrance Picker with Search & Filters */}
                <div>
                  <p className="mb-2 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs md:mb-3">
                    2. Select Fragrances
                  </p>

                  {/* Search input */}
                  <div className="relative mb-2 md:mb-3">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:h-4 sm:w-4" />
                    <Input
                      placeholder="Search fragrances…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-8 font-body text-xs sm:h-10 sm:pl-9 sm:text-sm"
                    />
                  </div>

                  {/* Filter chips */}
                  <div className="mb-2 flex flex-wrap gap-2 md:mb-3">
                    {genderOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setGenderFilter(opt.value)}
                        className={`min-h-[36px] rounded-full border px-3.5 py-1.5 font-sans text-[0.65rem] uppercase tracking-[0.15em] transition-colors md:px-4 md:py-2 md:text-xs ${
                          genderFilter === opt.value
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/60"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <span className="self-center px-1 text-xs text-border">|</span>
                    {categoryOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCategoryFilter(opt.value)}
                        className={`min-h-[36px] rounded-full border px-3.5 py-1.5 font-sans text-[0.65rem] uppercase tracking-[0.15em] transition-colors md:px-4 md:py-2 md:text-xs ${
                          categoryFilter === opt.value
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/60"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Fragrance grid */}
                  <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-background/60 p-2 sm:p-3">
                    {fragranceLibrary.length === 0 ? (
                      <p className="py-3 text-center font-body text-xs text-muted-foreground sm:text-sm">No fragrances match your search.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                      {fragranceLibrary.map((p) => {
                        const selected = selectedFragrances.includes(p.name);
                        const disabled = !selected && selectedFragrances.length >= limits.maxFragrances;
                        return (
                          <button
                            key={p.id}
                            onClick={() => toggleFragrance(p.name)}
                            disabled={disabled}
                            className={`flex w-full min-h-[40px] items-center justify-between rounded-md border px-3 py-2 text-left font-body text-xs transition-colors sm:text-sm ${
                              selected
                                ? "border-primary bg-primary/15 text-foreground"
                                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                          >
                            <span className="truncate pr-2">{p.name}</span>
                            {selected && <Check className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" />}
                          </button>
                        );
                      })}
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 font-body text-xs text-muted-foreground sm:mt-2 sm:text-sm">
                    Selected {selectedFragrances.length}/{limits.maxFragrances} fragrances.
                  </p>
                </div>

                {/* Step 3 – Oil Concentration */}
                <div>
                  <p className="mb-2 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs md:mb-3">
                    3. Oil Concentration
                  </p>
                  <div className="rounded-lg border border-border bg-background/60 p-3 sm:p-4">
                    <Slider
                      value={[oilConcentration]}
                      min={limits.minOil}
                      max={limits.maxOil}
                      step={1}
                      onValueChange={(values) => setOilConcentration(values[0])}
                    />
                    <div className="mt-2 flex items-center justify-between font-sans text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground sm:mt-3 sm:text-xs">
                      <span>{limits.minOil}%</span>
                      <span className="text-primary">{oilConcentration}%</span>
                      <span>{limits.maxOil}%</span>
                    </div>
                  </div>
                </div>

                <p className="rounded-lg border border-border bg-background/50 px-3 py-2.5 font-body text-xs leading-relaxed text-muted-foreground sm:px-4 sm:py-3 sm:text-sm">
                  30ml: up to 2 fragrances, 10–20% oil. 50ml & 100ml: up to 3 fragrances, 10–40% oil.
                </p>
              </div>

              {/* Preview panel */}
              <div className="space-y-3 rounded-xl border border-border bg-background/50 p-3 sm:space-y-4 sm:p-5">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-primary sm:text-xs">4. Preview Your Blend</p>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 text-xs text-foreground sm:text-sm">
                    <FlaskConical className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                    <span className="font-body">Bottle Size: {selectedSize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground sm:text-sm">
                    <Droplets className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                    <span className="font-body">Oil: {oilConcentration}%</span>
                  </div>
                  <div>
                    <p className="mb-1.5 font-sans text-[0.55rem] uppercase tracking-[0.15em] text-muted-foreground sm:mb-2 sm:text-[0.65rem]">Selected Fragrances</p>
                    {selectedFragrances.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {selectedFragrances.map((name) => (
                          <span key={name} className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-body text-[0.65rem] text-foreground sm:px-3 sm:py-1 sm:text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-xs text-muted-foreground sm:text-sm">Pick fragrances to preview your blend.</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="font-sans text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">Price</span>
                    <span className="font-display text-xl text-primary sm:text-2xl">R{limits.price}</span>
                  </div>
                </div>

                <Button
                  size="default"
                  onClick={handleAddToCart}
                  className="mt-1.5 w-full gap-1.5 font-sans text-[0.6rem] uppercase tracking-[0.15em] sm:mt-2 sm:gap-2 sm:text-xs"
                >
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Add Blend to Cart
                </Button>
                <p className="text-center font-body text-[0.65rem] text-muted-foreground sm:text-sm">Your scent. Your identity. Your signature</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignatureFragranceSection;
