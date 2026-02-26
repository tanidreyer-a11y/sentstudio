export interface Perfume {
  id: string;
  name: string;
  category: "Luxury" | "Sweet" | "Fresh" | "Musky";
  gender: "men" | "women";
  description: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  prices: {
    "30ml": number;
    "50ml": number;
    "100ml": number;
  };
  image: string;
}

export const perfumes: Perfume[] = [
  // ===== WOMEN'S FRAGRANCES =====
  {
    id: "velvet-rose",
    name: "Velvet Rose",
    category: "Luxury",
    gender: "women",
    description: "A sumptuous blend of Bulgarian rose and rich velvet musk, evoking the elegance of a midnight garden.",
    notes: {
      top: ["Pink Pepper", "Bergamot", "Lychee"],
      middle: ["Bulgarian Rose", "Peony", "Raspberry"],
      base: ["Velvet Musk", "Patchouli", "Cashmeran"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "sugar-kiss",
    name: "Sugar Kiss",
    category: "Sweet",
    gender: "women",
    description: "An irresistible gourmand fragrance with caramelized vanilla and candied fruits.",
    notes: {
      top: ["Candied Apple", "Strawberry", "Mandarin"],
      middle: ["Caramel", "Jasmine", "Praline"],
      base: ["Vanilla", "Tonka Bean", "White Musk"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    category: "Fresh",
    gender: "women",
    description: "A refreshing aquatic scent that captures the spirit of a Mediterranean coastal morning.",
    notes: {
      top: ["Sea Salt", "Lemon Zest", "Green Apple"],
      middle: ["Water Lily", "Freesia", "Cucumber"],
      base: ["White Cedar", "Ambroxan", "Driftwood"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "midnight-amber",
    name: "Midnight Amber",
    category: "Musky",
    gender: "women",
    description: "A deeply sensual amber fragrance with smoky undertones for the confident woman.",
    notes: {
      top: ["Saffron", "Black Pepper", "Cardamom"],
      middle: ["Amber", "Orris Root", "Rose Absolute"],
      base: ["Labdanum", "Benzoin", "Oud"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom Dream",
    category: "Sweet",
    gender: "women",
    description: "A delicate floral gourmand inspired by spring cherry blossoms in Kyoto.",
    notes: {
      top: ["Cherry Blossom", "Pear", "Pink Grapefruit"],
      middle: ["Magnolia", "Tuberose", "Almond Milk"],
      base: ["Sandalwood", "Vanilla Orchid", "Soft Musk"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "golden-gardenia",
    name: "Golden Gardenia",
    category: "Luxury",
    gender: "women",
    description: "An opulent white floral wrapped in golden warmth, fit for royalty.",
    notes: {
      top: ["Neroli", "Ylang Ylang", "Bergamot"],
      middle: ["Gardenia", "Jasmine Sambac", "Tuberose"],
      base: ["Gold Amber", "Sandalwood", "Musk"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "citrus-aura",
    name: "Citrus Aura",
    category: "Fresh",
    gender: "women",
    description: "A vibrant and zesty citrus composition that energizes and uplifts.",
    notes: {
      top: ["Sicilian Lemon", "Grapefruit", "Lime"],
      middle: ["Orange Blossom", "Neroli", "Green Tea"],
      base: ["White Musk", "Cedarwood", "Vetiver"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "noir-orchid",
    name: "Noir Orchid",
    category: "Musky",
    gender: "women",
    description: "A mysterious and intoxicating blend of black orchid and dark spices.",
    notes: {
      top: ["Black Truffle", "Ylang Ylang", "Bergamot"],
      middle: ["Black Orchid", "Lotus", "Dark Chocolate"],
      base: ["Patchouli", "Incense", "Vanilla Noir"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },

  // ===== MEN'S FRAGRANCES =====
  {
    id: "royal-oud",
    name: "Royal Oud",
    category: "Luxury",
    gender: "men",
    description: "A regal composition of rare oud and precious woods for the modern king.",
    notes: {
      top: ["Elemi", "Galbanum", "Pink Pepper"],
      middle: ["Oud", "Cedar Atlas", "Angelica"],
      base: ["Sandalwood", "Tonka Bean", "Amber"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "dark-tobacco",
    name: "Dark Tobacco",
    category: "Sweet",
    gender: "men",
    description: "A rich, warming blend of aged tobacco and honey for the distinguished gentleman.",
    notes: {
      top: ["Tobacco Leaf", "Rum", "Cinnamon"],
      middle: ["Honey", "Tonka Bean", "Cocoa"],
      base: ["Leather", "Benzoin", "Vanilla Absolute"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "arctic-wave",
    name: "Arctic Wave",
    category: "Fresh",
    gender: "men",
    description: "A crisp, invigorating aquatic fragrance with cool mint and marine accords.",
    notes: {
      top: ["Frozen Mint", "Sea Breeze", "Bergamot"],
      middle: ["Lavender", "Marine Accord", "Geranium"],
      base: ["Ambergris", "White Cedar", "Musk"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "savage-musk",
    name: "Savage Musk",
    category: "Musky",
    gender: "men",
    description: "A raw, animalistic musk blended with smoky woods and leather.",
    notes: {
      top: ["Black Pepper", "Calabrian Bergamot", "Elemi"],
      middle: ["Lavandin", "Geranium", "Nutmeg"],
      base: ["Ambroxan", "Cashmeran", "Cedar"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "whiskey-wood",
    name: "Whiskey Wood",
    category: "Luxury",
    gender: "men",
    description: "Aged whiskey notes meet smoked oak in this bold, sophisticated scent.",
    notes: {
      top: ["Whiskey Accord", "Apple", "Cinnamon"],
      middle: ["Smoked Oak", "Orris", "Violet Leaf"],
      base: ["Vetiver", "Guaiac Wood", "Amber"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "cedar-shadow",
    name: "Cedar Shadow",
    category: "Musky",
    gender: "men",
    description: "A deep, woody fragrance with smoky cedar and dark vetiver.",
    notes: {
      top: ["Juniper Berry", "Pink Pepper", "Grapefruit"],
      middle: ["Atlas Cedar", "Cypress", "Labdanum"],
      base: ["Dark Vetiver", "Oakmoss", "Leather"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "blue-horizon",
    name: "Blue Horizon",
    category: "Fresh",
    gender: "men",
    description: "A clean, airy fragrance inspired by endless summer skies.",
    notes: {
      top: ["Ozone", "Lemon", "Green Apple"],
      middle: ["Jasmine", "White Tea", "Violet"],
      base: ["White Musk", "Ambroxan", "Skin Accord"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
  {
    id: "caramel-noir",
    name: "Caramel Noir",
    category: "Sweet",
    gender: "men",
    description: "A decadent, masculine gourmand with burnt caramel and dark coffee.",
    notes: {
      top: ["Espresso", "Cardamom", "Bergamot"],
      middle: ["Burnt Caramel", "Praline", "Cinnamon"],
      base: ["Dark Chocolate", "Vanilla", "Benzoin"],
    },
    prices: { "30ml": 100, "50ml": 150, "100ml": 280 },
    image: "/placeholder.svg",
  },
];

export const getPerfumeById = (id: string) => perfumes.find((p) => p.id === id);
export const getPerfumesByGender = (gender: "men" | "women") => perfumes.filter((p) => p.gender === gender);
export const searchPerfumes = (query: string) => {
  const q = query.toLowerCase();
  const moodMap: Record<string, string[]> = {
    romantic: ["rose", "jasmine", "peony", "gardenia", "tuberose"],
    fresh: ["citrus", "lemon", "bergamot", "mint", "ocean", "sea", "green"],
    sweet: ["vanilla", "caramel", "chocolate", "honey", "sugar", "praline"],
    musky: ["musk", "amber", "leather", "oud", "vetiver"],
    luxury: ["oud", "saffron", "gold", "royal", "orchid"],
  };

  const moodTerms = moodMap[q] || [];

  return perfumes.filter((p) => {
    const allNotes = [...p.notes.top, ...p.notes.middle, ...p.notes.base].join(" ").toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      allNotes.includes(q) ||
      moodTerms.some((term) => allNotes.includes(term) || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
    );
  });
};
