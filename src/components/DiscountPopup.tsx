import { useEffect, useState } from "react";
import { Sparkles, MessageCircle, Copy, Check, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const WHATSAPP_NUMBER = "27761328213";
const STORAGE_KEY = "scentDiscountPopupSeen";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number too long")
    .regex(/^[0-9+\s\-()]+$/, "Phone number can only contain digits"),
});

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `SCENT10-${suffix}`;
};

const DiscountPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, phone });
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const discountCode = generateCode();
    const { error } = await supabase.from("leads").insert({
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      discount_code: discountCode,
      source: "popup",
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "You're already on the list",
          description: "This email has already claimed a discount.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
      return;
    }
    setCode(discountCode);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = code
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi Scent Studio, I'd like to claim my 10% off using code: ${code} (email: ${email})`
      )}`
    : "#";

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : dismiss())}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-primary/30">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 text-muted-foreground hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6 sm:p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.4em] text-primary">Exclusive Offer</p>
          <h2 className="mb-3 font-display text-2xl font-light text-foreground sm:text-3xl">
            Get 10% Off Your First Order
          </h2>
          <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
            Drop your email & WhatsApp number — we'll generate your discount code instantly.
          </p>

          {!code ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                inputMode="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="tel"
                inputMode="tel"
                placeholder="WhatsApp number (e.g. 0761234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={20}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary px-6 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting ? "Generating…" : "Get My Discount"}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="font-sans text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"
              >
                Maybe later
              </button>
            </form>
          ) : (
            <div className="border border-primary/40 bg-secondary p-5">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">Your discount code</p>
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="font-display text-2xl tracking-[0.2em] text-primary">{code}</span>
                <button onClick={copyCode} aria-label="Copy code" className="text-muted-foreground hover:text-primary">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mb-5 font-body text-xs leading-relaxed text-muted-foreground">
                Send this code on WhatsApp to claim 10% off your first order.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="h-4 w-4" />
                Send on WhatsApp
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;
