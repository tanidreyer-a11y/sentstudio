import menLuxury from "@/assets/men-luxury.jpeg";
import menFresh from "@/assets/men-fresh.jpeg";
import menMusky from "@/assets/men-musky.jpeg";
import womenLuxury from "@/assets/women-luxury.jpeg";
import womenFresh from "@/assets/women-fresh.jpeg";
import womenMusky from "@/assets/women-musky.jpeg";
import womenSweet from "@/assets/women-sweet.jpeg";
import menSweet from "@/assets/men-sweet.jpeg";

// Per-perfume images (men) - keyed by perfume ID
const menPerfumeImages: Record<string, string> = {};

// Category fallback images
const categoryMap: Record<string, string> = {
  "men-Luxury": menLuxury,
  "men-Fresh": menFresh,
  "men-Musky": menMusky,
  "men-Sweet": menSweet,
  "women-Luxury": womenLuxury,
  "women-Fresh": womenFresh,
  "women-Musky": womenMusky,
  "women-Sweet": womenSweet,
};

export const registerPerfumeImage = (id: string, image: string) => {
  menPerfumeImages[id] = image;
};

export const getPerfumeImageById = (id: string): string => {
  return menPerfumeImages[id] || "";
};

export const getPerfumeImage = (gender: "men" | "women", category: string, perfumeId?: string): string => {
  // Check for individual perfume image first
  if (perfumeId && menPerfumeImages[perfumeId]) {
    return menPerfumeImages[perfumeId];
  }
  // Fall back to category image
  return categoryMap[`${gender}-${category}`] || "";
};
