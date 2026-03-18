// Note-based sub-group images
import menLeather from "@/assets/men-leather.jpeg";
import menVanilla from "@/assets/men-vanilla.jpeg";
import menAmber from "@/assets/men-amber.jpeg";
import menFreshNotes from "@/assets/men-fresh-notes.jpeg";
import menMusky from "@/assets/men-musky.jpeg";
import menLuxury from "@/assets/men-luxury.jpeg";

import womenVanilla from "@/assets/women-vanilla.jpeg";
import womenPatchouli from "@/assets/women-patchouli.jpeg";
import womenGourmand from "@/assets/women-gourmand.jpeg";
import womenWoody from "@/assets/women-woody.jpeg";
import womenAmber from "@/assets/women-amber.jpeg";
import womenLuxury from "@/assets/women-luxury.jpeg";

// Sub-group image map
const noteGroupImages: Record<string, string> = {
  // Men
  "men-oud": menMusky,         // fallback until oud image generated
  "men-leather": menLeather,
  "men-vanilla": menVanilla,
  "men-woody": menLuxury,      // fallback until woody image generated
  "men-amber": menAmber,
  "men-fresh": menFreshNotes,
  // Women
  "women-vanilla": womenVanilla,
  "women-patchouli": womenPatchouli,
  "women-gourmand": womenGourmand,
  "women-woody": womenWoody,
  "women-amber": womenAmber,
  "women-floral": womenLuxury,  // fallback until floral image generated
};

type BaseNotes = string[];

const hasNote = (notes: BaseNotes, keywords: string[]): boolean =>
  notes.some((n) => keywords.some((k) => n.toLowerCase().includes(k.toLowerCase())));

/**
 * Determines the note sub-group for a perfume based on its base notes and gender.
 * Priority order matters — more specific groups checked first.
 */
export const getNoteGroup = (
  gender: "men" | "women",
  baseNotes: BaseNotes
): string => {
  if (gender === "men") {
    if (hasNote(baseNotes, ["Oud", "Agarwood"])) return "men-oud";
    if (hasNote(baseNotes, ["Leather", "Tobacco"])) return "men-leather";
    if (hasNote(baseNotes, ["Vanilla", "Tonka", "Caramel", "Praline", "Toffee", "Sugar"]))
      return "men-vanilla";
    if (hasNote(baseNotes, ["Vetiver", "Patchouli", "Oakmoss", "Cedar", "Cedarwood", "Sandalwood"]))
      return "men-woody";
    if (hasNote(baseNotes, ["Amber", "Benzoin", "Incense", "Styrax", "Labdanum"]))
      return "men-amber";
    return "men-fresh";
  } else {
    if (hasNote(baseNotes, ["Caramel", "Praline", "Toffee", "Cacao", "Chocolate", "Cocoa"]))
      return "women-gourmand";
    if (hasNote(baseNotes, ["Patchouli"]) && !hasNote(baseNotes, ["Vanilla"]))
      return "women-patchouli";
    if (hasNote(baseNotes, ["Vanilla", "Tonka"]))
      return "women-vanilla";
    if (
      hasNote(baseNotes, ["Sandalwood", "Cedar", "Cedarwood", "Vetiver", "Oakmoss"])
    )
      return "women-woody";
    if (hasNote(baseNotes, ["Amber", "Benzoin"]))
      return "women-amber";
    if (hasNote(baseNotes, ["Rose", "Amaranth", "Jasmine", "Peony"]))
      return "women-floral";
    // Default
    return "women-amber";
  }
};

/**
 * Gets the product image for a perfume based on its base notes.
 * This provides more specific imagery than category-only mapping.
 */
export const getPerfumeImage = (
  gender: "men" | "women",
  _category: string,
  baseNotes?: BaseNotes
): string => {
  if (baseNotes && baseNotes.length > 0) {
    const group = getNoteGroup(gender, baseNotes);
    return noteGroupImages[group] || "";
  }
  // Fallback to a default per gender
  return gender === "men" ? menAmber : womenVanilla;
};
