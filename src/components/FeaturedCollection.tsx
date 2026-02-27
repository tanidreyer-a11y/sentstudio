import { Link } from "react-router-dom";
import { getPerfumeImage } from "@/lib/perfume-images";

const featuredMen = [
  { id: "michael-kors", name: "Michael Kors", category: "Luxury" as const, gender: "men" as const },
  { id: "creed-aventus", name: "Creed Aventus", category: "Musky" as const, gender: "men" as const },
  { id: "calvin-klein-ck1", name: "Calvin Klein CK1", category: "Fresh" as const, gender: "men" as const },
  { id: "paco-rabanne-one-million", name: "Paco Rabanne One Million", category: "Sweet" as const, gender: "men" as const },
];

const featuredWomen = [
  { id: "chanel-no5", name: "Chanel No.5", category: "Luxury" as const, gender: "women" as const },
  { id: "narciso-rodriguez-for-her", name: "Narciso Rodriguez For Her", category: "Musky" as const, gender: "women" as const },
  { id: "elizabeth-arden-green-tea", name: "Elizabeth Arden Green Tea", category: "Fresh" as const, gender: "women" as const },
  { id: "paco-rabanne-lady-million", name: "Paco Rabanne Lady Million", category: "Sweet" as const, gender: "women" as const },
];

const FeaturedCard = ({ perfume }: { perfume: { id: string; name: string; category: string; gender: "men" | "women" } }) => {
  const image = getPerfumeImage(perfume.gender, perfume.category);
  return (
    <Link to={`/perfume/${perfume.id}`} className="group cursor-pointer">
      <div className="relative overflow-hidden mb-6 bg-card aspect-[3/4] flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="font-display text-6xl font-light text-primary/80">
            {perfume.name.charAt(0)}
          </span>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
      </div>
      <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
        {perfume.category}
      </p>
      <h3 className="font-display text-xl font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
        {perfume.name}
      </h3>
      <p className="font-sans text-sm tracking-wider text-primary font-medium">
        From R100
      </p>
    </Link>
  );
};

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

        {/* Men's Featured */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-light text-foreground mb-8 text-center">For Him</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMen.map((p) => (
              <FeaturedCard key={p.id} perfume={p} />
            ))}
          </div>
        </div>

        {/* Women's Featured */}
        <div>
          <h3 className="font-display text-2xl font-light text-foreground mb-8 text-center">For Her</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredWomen.map((p) => (
              <FeaturedCard key={p.id} perfume={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
