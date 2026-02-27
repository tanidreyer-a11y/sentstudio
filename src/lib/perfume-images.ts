import menLuxury from "@/assets/men-luxury.webp";
import menFresh from "@/assets/men-fresh.webp";

const imageMap: Record<string, string> = {
  "men-Luxury": menLuxury,
  "men-Fresh": menFresh,
};

export const getPerfumeImage = (gender: "men" | "women", category: string): string => {
  return imageMap[`${gender}-${category}`] || "";
};
