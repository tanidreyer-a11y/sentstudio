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

import { mensPerfumes } from "./mens-perfumes";
import { womensPerfumes } from "./womens-perfumes";

export const perfumes: Perfume[] = [...mensPerfumes, ...womensPerfumes];

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
