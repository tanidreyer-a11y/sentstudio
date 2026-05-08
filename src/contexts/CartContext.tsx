import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import {
  calculateEasterDiscounts,
  calculateMothersDayDiscount,
  type CartDiscount,
} from "@/lib/promotions";

export interface CartItem {
  perfumeId: string;
  name: string;
  size: "30ml" | "50ml" | "100ml";
  price: number;
  gender: "men" | "women";
  quantity: number;
  /** Custom blend metadata (only for signature fragrance items) */
  customBlend?: {
    fragrances: string[];
    oilConcentration: number;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (perfumeId: string, size: string) => void;
  updateQuantity: (perfumeId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discounts: CartDiscount[];
  totalDiscount: number;
  finalPrice: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  getWhatsAppMessage: (customerName: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.perfumeId === item.perfumeId && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.perfumeId === item.perfumeId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (perfumeId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.perfumeId === perfumeId && i.size === size)));
  };

  const updateQuantity = (perfumeId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(perfumeId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.perfumeId === perfumeId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const discounts = useMemo(
    () => [
      ...calculateEasterDiscounts(items),
      ...calculateMothersDayDiscount(items, promoCode),
    ],
    [items, promoCode]
  );
  const totalDiscount = discounts.reduce((s, d) => s + d.amount, 0);
  const finalPrice = totalPrice - totalDiscount;

  const getWhatsAppMessage = (customerName: string) => {
    const itemsList = items
      .map(
        (i) =>
          `• ${i.name} (${i.size}) x${i.quantity} — R${i.price * i.quantity}`
      )
      .join("\n");

    const message = `🛍️ *New Order — Scent Studio*\n\n👤 Customer: ${customerName}\n\n📦 Items:\n${itemsList}\n\n💰 *Total: R${totalPrice}*\n\nPlease confirm availability and payment details. Thank you!`;

    return `https://wa.me/27761328213?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, discounts, totalDiscount, finalPrice, promoCode, setPromoCode, getWhatsAppMessage }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
