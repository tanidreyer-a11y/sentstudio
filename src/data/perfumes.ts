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
    "30ml"?: number;
    "50ml"?: number;
    "100ml"?: number;
  };
  image: string;
}

import { mensPerfumes } from "./mens-perfumes";
import { womensPerfumes } from "./womens-perfumes";

export const perfumes: Perfume[] = [...mensPerfumes, ...womensPerfumes];

export const getPerfumeById = (id: string) => perfumes.find((p) => p.id === id);
export const getPerfumesByGender = (gender: "men" | "women") => perfumes.filter((p) => p.gender === gender);
// Simple Levenshtein distance for typo tolerance
const levenshtein = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

// Check if any word in the target fuzzy-matches any query word
const fuzzyWordMatch = (target: string, queryWords: string[], threshold = 2): boolean => {
  const targetWords = target.toLowerCase().split(/[\s&.,'()-]+/).filter(Boolean);
  return queryWords.some((qw) => {
    if (qw.length < 3) return targetWords.some((tw) => tw.startsWith(qw));
    return targetWords.some((tw) => {
      if (tw.includes(qw) || qw.includes(tw)) return true;
      // Allow more tolerance for longer words
      const maxDist = qw.length <= 4 ? 1 : threshold;
      return levenshtein(tw, qw) <= maxDist;
    });
  });
};

// Check if query (without spaces) matches target (without spaces) — handles "flower bomb" → "flowerbomb"
const compactMatch = (target: string, query: string): boolean => {
  const compactTarget = target.toLowerCase().replace(/[\s&.,'()-]+/g, "");
  const compactQuery = query.toLowerCase().replace(/[\s]+/g, "");
  if (compactTarget.includes(compactQuery)) return true;
  if (compactQuery.length >= 4 && levenshtein(compactTarget, compactQuery) <= 3) return false; // too broad
  // Check if compact query is close to compact target
  if (compactQuery.length >= 5) {
    // Substring fuzzy: slide a window of query length over target
    for (let i = 0; i <= compactTarget.length - compactQuery.length; i++) {
      const slice = compactTarget.substring(i, i + compactQuery.length);
      if (levenshtein(slice, compactQuery) <= 2) return true;
    }
  }
  return false;
};

export const searchPerfumes = (query: string) => {
  const q = query.toLowerCase().trim();
  const queryWords = q.split(/\s+/).filter(Boolean);
  const moodMap: Record<string, string[]> = {
    romantic: ["rose", "jasmine", "peony", "gardenia", "tuberose"],
    fresh: ["citrus", "lemon", "bergamot", "mint", "ocean", "sea", "green"],
    sweet: ["vanilla", "caramel", "chocolate", "honey", "sugar", "praline"],
    musky: ["musk", "amber", "leather", "oud", "vetiver"],
    luxury: ["oud", "saffron", "gold", "royal", "orchid"],
  };

  const moodTerms = moodMap[q] || [];

  // Score each perfume for relevance
  const scored = perfumes.map((p) => {
    const nameLower = p.name.toLowerCase();
    const categoryLower = p.category.toLowerCase();
    const allNotes = [...p.notes.top, ...p.notes.middle, ...p.notes.base].join(" ").toLowerCase();
    const descLower = p.description.toLowerCase();
    let score = 0;

    // Exact substring matches (highest priority)
    if (nameLower.includes(q)) score += 100;
    if (categoryLower.includes(q)) score += 50;
    if (allNotes.includes(q)) score += 40;
    if (descLower.includes(q)) score += 20;

    // Compact match (handles "flower bomb" → "flowerbomb", "sauvage elixir" etc.)
    if (score === 0 && compactMatch(nameLower, q)) score += 90;

    // Fuzzy word matching on name (handles typos like "flwerbomb", "savuage")
    if (score === 0 && fuzzyWordMatch(nameLower, queryWords)) score += 70;

    // Fuzzy match on notes
    if (score === 0 && queryWords.some((qw) => fuzzyWordMatch(allNotes, [qw]))) score += 30;

    // Mood-based matching
    if (score === 0 && moodTerms.length > 0) {
      const moodScore = moodTerms.filter((term) =>
        allNotes.includes(term) || nameLower.includes(term) || categoryLower.includes(term)
      ).length;
      if (moodScore > 0) score += moodScore * 15;
    }

    // Partial name word matching (handles searching just "flowerbomb" without "Viktor & Rolf")
    if (score === 0) {
      const nameWords = nameLower.split(/[\s&.,'()-]+/).filter(Boolean);
      const matchCount = queryWords.filter((qw) =>
        nameWords.some((nw) => nw.includes(qw) || (qw.length >= 4 && levenshtein(nw, qw) <= 2))
      ).length;
      if (matchCount > 0) score += matchCount * 25;
    }

    return { perfume: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.perfume);
};
