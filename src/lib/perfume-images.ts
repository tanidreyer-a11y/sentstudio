import menLuxury from "@/assets/men-luxury.webp";

const imageMap: Record<string, string> = {
  "men-Luxury": menLuxury,
};

export const getPerfumeImage = (gender: "men" | "women", category: string): string => {
  return imageMap[`${gender}-${category}`] || "";
};
