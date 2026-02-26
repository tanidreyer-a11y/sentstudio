import perfume1 from "@/assets/perfume-1.webp";
import perfume2 from "@/assets/perfume-2.webp";
import perfume3 from "@/assets/perfume-3.webp";
import perfume4 from "@/assets/perfume-4.webp";

const fragrances = [
  {
    name: "Amber Soleil",
    category: "Eau de Parfum",
    price: "$185",
    notes: "Amber · Vanilla · Sandalwood",
    image: perfume1,
  },
  {
    name: "Rose Mystique",
    category: "Eau de Parfum",
    price: "$210",
    notes: "Bulgarian Rose · Oud · Musk",
    image: perfume2,
  },
  {
    name: "Bois Sacré",
    category: "Parfum",
    price: "$245",
    notes: "Cedarwood · Vetiver · Leather",
    image: perfume3,
  },
  {
    name: "Orient d'Or",
    category: "Extrait de Parfum",
    price: "$320",
    notes: "Saffron · Incense · Amber",
    image: perfume4,
  },
];

const FeaturedCollection = () => {
  return (
    <section id="collection" className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
            Curated Selection
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
            Featured Fragrances
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {fragrances.map((fragrance) => (
            <div
              key={fragrance.name}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-6 bg-card">
                <img
                  src={fragrance.image}
                  alt={fragrance.name}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
              </div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
                {fragrance.category}
              </p>
              <h3 className="font-display text-xl font-medium text-foreground mb-1">
                {fragrance.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-3">
                {fragrance.notes}
              </p>
              <p className="font-sans text-sm tracking-wider text-primary font-medium">
                {fragrance.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
