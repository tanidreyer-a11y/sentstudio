import menBottle from "@/assets/men-bottle-black.jpg";
import womenBottle from "@/assets/women-bottle-ivory.jpg";

// Per-perfume images - keyed by perfume ID
const perfumeImages: Record<string, string> = {};

// Gender fallback images
const genderMap: Record<string, string> = {
  men: menBottle,
  women: womenBottle,
};

export const registerPerfumeImage = (id: string, image: string) => {
  perfumeImages[id] = image;
};

export const getPerfumeImageById = (id: string): string => {
  return perfumeImages[id] || "";
};

export const getPerfumeImage = (gender: "men" | "women", category: string, perfumeId?: string): string => {
  // Check for individual perfume image first
  if (perfumeId && perfumeImages[perfumeId]) {
    return perfumeImages[perfumeId];
  }
  // Fall back to gender image
  return genderMap[gender] || "";
};
  // Check for individual perfume image first
  if (perfumeId && menPerfumeImages[perfumeId]) {
    return menPerfumeImages[perfumeId];
  }
  // Fall back to category image
  return categoryMap[`${gender}-${category}`] || "";
};
