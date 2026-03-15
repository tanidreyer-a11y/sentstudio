import { useMemo, useState } from "react";
import { Sparkles, Droplets, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { perfumes } from "@/data/perfumes";
import heroPerfumeBg from "@/assets/hero-perfume-bg.jpeg";
import bottleWomen from "@/assets/bottle-women-30ml.jpeg";

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

const SignatureFragranceSection = () => {
  const [selectedSize, setSelectedSize] = useState<BottleSize>("50ml");
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [oilConcentration, setOilConcentration] = useState(20);

  const fragranceLibrary = useMemo(
    () => [...new Set(perfumes.map((perfume) => perfume.name))].sort((a, b) => a.localeCompare(b)),
    []
  );

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

  const handleCreateBlend = () => {
    const blendList = selectedFragrances.length > 0 ? selectedFragrances.join(", ") : "Not selected yet";
    const message = `Hi Scent Studio ✨\n\nI'd like to create my Signature Fragrance:\n• Bottle size: ${selectedSize}\n• Fragrances: ${blendList}\n• Oil concentration: ${oilConcentration}%\n\nPlease guide me with the next step.`;
    window.open(`https://wa.me/27761328213?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute inset-0 opacity-20">
        <img src={heroPerfumeBg} alt="Luxury fragrance atmosphere" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative container mx-auto space-y-14 px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-primary">Signature Fragrance</p>
            <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">Craft Your Own Fragrance</h2>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
              Create a fragrance that is uniquely yours.
              <br />
              Choose your favourite scents from our fragrance library and blend them into a personalised signature perfume.
              Whether you prefer something bold, fresh, or seductive, this is your chance to craft a scent that tells your
              story.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-border bg-card/70 p-4 shadow-xl backdrop-blur-sm">
            <img src={bottleWomen} alt="Signature perfume bottle" className="h-72 w-full rounded-lg object-cover" loading="lazy" />
            <div className="absolute bottom-8 left-8 right-8 rounded-lg border border-border bg-background/75 px-4 py-3 backdrop-blur-sm">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-primary">Luxury Blend Experience</p>
              <p className="mt-1 font-body text-sm text-foreground">Glass bottle elegance, built around your story and mood.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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
                  <span className="absolute right-4 top-4 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-primary">
                    {pkg.highlight}
                  </span>
                )}
                <CardContent className="space-y-4 p-6">
                  <button onClick={() => handleSizeSelect(pkg.size)} className="w-full text-left">
                    <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">{pkg.size}</p>
                    <p className="mt-2 font-display text-3xl text-foreground">R{blendLimits[pkg.size].price}</p>
                    <p className="mt-2 font-body text-base text-foreground">{pkg.title}</p>
                    <p className="mt-1 font-body text-sm text-muted-foreground">{pkg.description}</p>
                  </button>
                  <ul className="space-y-2">
                    {pkg.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border bg-card/80 shadow-xl backdrop-blur-sm">
          <CardContent className="space-y-8 p-6 md:p-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary">Customization Builder</p>
              <h3 className="mt-2 font-display text-3xl font-light text-foreground">Build Your Signature Blend</h3>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div>
                  <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">1. Choose Bottle Size</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(blendLimits) as BottleSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`rounded-lg border px-3 py-3 font-sans text-xs uppercase tracking-[0.18em] transition-colors ${
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

                <div>
                  <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    2. Select Fragrances from the Full Fragrance List
                  </p>
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-border bg-background/60 p-3">
                    {fragranceLibrary.map((name) => {
                      const selected = selectedFragrances.includes(name);
                      const disabled = !selected && selectedFragrances.length >= limits.maxFragrances;
                      return (
                        <button
                          key={name}
                          onClick={() => toggleFragrance(name)}
                          disabled={disabled}
                          className={`w-full rounded-md border px-3 py-2 text-left font-body text-sm transition-colors ${
                            selected
                              ? "border-primary bg-primary/15 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-body text-sm text-muted-foreground">
                    Selected {selectedFragrances.length}/{limits.maxFragrances} fragrances.
                  </p>
                </div>

                <div>
                  <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    3. Choose Oil Concentration
                  </p>
                  <div className="rounded-xl border border-border bg-background/60 p-4">
                    <Slider
                      value={[oilConcentration]}
                      min={limits.minOil}
                      max={limits.maxOil}
                      step={1}
                      onValueChange={(values) => setOilConcentration(values[0])}
                    />
                    <div className="mt-3 flex items-center justify-between font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <span>{limits.minOil}%</span>
                      <span className="text-primary">{oilConcentration}%</span>
                      <span>{limits.maxOil}%</span>
                    </div>
                  </div>
                </div>

                <p className="rounded-lg border border-border bg-background/50 px-4 py-3 font-body text-sm text-muted-foreground">
                  30ml blends allow up to 2 fragrances and oil concentration between 10%–20%. 50ml and 100ml blends allow up
                  to 3 fragrances with oil concentration between 10%–40%.
                </p>
              </div>

              <div className="space-y-4 rounded-xl border border-border bg-background/50 p-5">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary">4. Preview Your Blend</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    <span className="font-body">Bottle Size: {selectedSize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="font-body">Oil Concentration: {oilConcentration}%</span>
                  </div>
                  <div>
                    <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Selected Fragrances</p>
                    {selectedFragrances.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedFragrances.map((name) => (
                          <span key={name} className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-body text-xs text-foreground">
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-sm text-muted-foreground">Pick fragrances to preview your blend identity.</p>
                    )}
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleCreateBlend}
                  className="mt-2 w-full font-sans text-xs uppercase tracking-[0.2em]"
                >
                  Create My Signature Fragrance
                </Button>
                <p className="text-center font-body text-sm text-muted-foreground">Your scent. Your identity. Your signature</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignatureFragranceSection;
