// How customers can order right now.
//
// Online card payments (Yoco) are switched off while the payment system is being
// fixed; every order goes through WhatsApp instead. Flip this to true once Yoco
// payments are confirmed working end to end.
export const ONLINE_PAYMENTS_ENABLED = false;

export const WHATSAPP_NUMBER = "27761328213";
export const WHATSAPP_DISPLAY = "076 132 8213";

export const PAYMENTS_PAUSED_NOTE =
  "Online card payments are temporarily unavailable. Please place your order on WhatsApp and we'll confirm availability, payment and delivery with you directly.";

/** Short reference so Scent Studio can match WhatsApp messages to an order. */
export const orderReference = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "SS-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

export const whatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
