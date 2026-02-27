import menLuxury from "@/assets/men-luxury.jpeg";
import menFresh from "@/assets/men-fresh.webp";
import menMusky from "@/assets/men-musky.webp";
import womenLuxury from "@/assets/women-luxury.jpeg";

const imageMap: Record<string, string> = {
  "men-Luxury": menLuxury,
  "men-Fresh": menFresh,
  "men-Musky": menMusky,
  "women-Luxury": womenLuxury,
};

export const getPerfumeImage = (gender: "men" | "women", category: string): string => {
  return imageMap[`${gender}-${category}`] || "";
};
