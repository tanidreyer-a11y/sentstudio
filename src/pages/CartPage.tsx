import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, getWhatsAppMessage } = useCart();
  const [customerName, setCustomerName] = useState("");

  const handleOrder = () => {
    if (!customerName.trim()) {
      return;
    }
    window.open(getWhatsAppMessage(customerName.trim()), "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Your Selection</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">Shopping Cart</h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-lg text-muted-foreground">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-12">
                {items.map((item) => (
                  <div
                    key={`${item.perfumeId}-${item.size}`}
                    className="flex items-center gap-6 p-6 bg-card border border-border"
                  >
                    <div className="w-16 h-16 bg-secondary flex items-center justify-center shrink-0">
                      <span className="font-display text-2xl text-primary/40">{item.name[0]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[10px] tracking-wider text-muted-foreground/70 uppercase">Inspired by</p>
                      <h3 className="font-display text-lg text-foreground">{item.name}</h3>
                      <p className="font-sans text-xs tracking-wider text-muted-foreground">
                        {item.size} · {item.gender === "men" ? "For Him" : "For Her"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.perfumeId, item.size, item.quantity - 1)}
                        className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-sans text-sm w-6 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.perfumeId, item.size, item.quantity + 1)}
                        className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="font-sans text-sm tracking-wider text-primary font-medium w-20 text-right">
                      R{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.perfumeId, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm tracking-[0.2em] uppercase text-muted-foreground">Total</span>
                  <span className="font-display text-2xl text-primary">R{totalPrice}</span>
                </div>

                <div>
                  <label className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-2">
                    Your Name
                  </label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name for the order"
                    className="w-full px-6 py-4 bg-card border border-border font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <button
                  onClick={handleOrder}
                  disabled={!customerName.trim()}
                  className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Order via WhatsApp
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-border font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default CartPage;
