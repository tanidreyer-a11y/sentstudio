import type { Perfume } from "@/data/perfumes";

export type PricingTier = "standard" | "premium" | "ultra-premium";

export const getPricingTier = (perfume: Perfume): PricingTier => {
  const price = perfume.prices["30ml"];
  if (price >= 160) return "ultra-premium";
  if (price >= 130) return "premium";
  return "standard";
};

export const tierLabel: Record<PricingTier, string> = {
  standard: "",
  premium: "Premium",
  "ultra-premium": "Ultra Premium",
};
