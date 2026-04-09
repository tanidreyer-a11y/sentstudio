import menLuxury from "@/assets/men-luxury.jpeg";
import menFresh from "@/assets/men-fresh.jpeg";
import menMusky from "@/assets/men-musky.jpeg";
import womenLuxury from "@/assets/women-luxury.jpeg";
import womenFresh from "@/assets/women-fresh.jpeg";
import womenMusky from "@/assets/women-musky.jpeg";
import womenSweet from "@/assets/women-sweet.jpeg";
import menSweet from "@/assets/men-sweet.jpeg";

const imageMap: Record<string, string> = {
  "men-Luxury": menLuxury,
  "men-Fresh": menFresh,
  "men-Musky": menMusky,
  "men-Sweet": menSweet,
  "women-Luxury": womenLuxury,
  "women-Fresh": womenFresh,
  "women-Musky": womenMusky,
  "women-Sweet": womenSweet,
};

export const getPerfumeImage = (gender: "men" | "women", category: string): string => {
  return imageMap[`${gender}-${category}`] || "";
};
