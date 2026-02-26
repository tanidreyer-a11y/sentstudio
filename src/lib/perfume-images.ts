import menLuxury from "@/assets/men-luxury.webp";
import menSweet from "@/assets/men-sweet.webp";
import menFresh from "@/assets/men-fresh.webp";
import menMusky from "@/assets/men-musky.webp";
import womenLuxury from "@/assets/women-luxury.webp";
import womenSweet from "@/assets/women-sweet.webp";
import womenFresh from "@/assets/women-fresh.webp";
import womenMusky from "@/assets/women-musky.webp";

const imageMap: Record<string, string> = {
  "men-Luxury": menLuxury,
  "men-Sweet": menSweet,
  "men-Fresh": menFresh,
  "men-Musky": menMusky,
  "women-Luxury": womenLuxury,
  "women-Sweet": womenSweet,
  "women-Fresh": womenFresh,
  "women-Musky": womenMusky,
};

export const getPerfumeImage = (gender: "men" | "women", category: string): string => {
  return imageMap[`${gender}-${category}`] || menLuxury;
};
