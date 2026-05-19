import { useState } from "react";
import { Sparkles, MessageCircle, Copy, Check } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const WHATSAPP_NUMBER = "27761328213";

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

interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
  /** Optional name of the recommended fragrance (used in chatbot context) */
  recommendedFragrance?: string;
  /** Heading override */
  heading?: string;
  /** Subtext override */
  subtext?: string;
  /** Label for the cancel/dismiss button */
  cancelLabel?: string;
}

const DiscountModal = ({
  open,
  onOpenChange,
  source = "entry-popup",
  recommendedFragrance,
  heading,
  subtext,
  cancelLabel = "Maybe later",
}: DiscountModalProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      source,
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "You're already on the list",
          description: "This email has already claimed a discount. Reach out on WhatsApp if you've lost your code.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
      return;
    }
    setCode(discountCode);
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = recommendedFragrance
    ? `Hi Scent Studio, I'd like to claim 10% off ${recommendedFragrance} using code: ${code} (email: ${email})`
    : `Hi Scent Studio, I'd like to claim my 10% off first order using code: ${code} (email: ${email})`;

  const whatsappUrl = code
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const resolvedHeading =
    heading ||
    (recommendedFragrance
      ? `Get 10% off ${recommendedFragrance}`
      : "Get 10% Off Your First Order");

  const resolvedSubtext =
    subtext ||
    (recommendedFragrance
      ? "Drop your email and WhatsApp number and we'll send you a one-time discount code for your recommended scent."
      : "Drop your email and WhatsApp number — we'll generate a one-time discount code instantly. No spam, just one beautiful scent away.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-center font-sans text-[0.65rem] uppercase tracking-[0.4em] text-primary">
            Exclusive Offer
          </p>
          <DialogTitle className="text-center font-display text-2xl font-light sm:text-3xl">
            {resolvedHeading}
          </DialogTitle>
          <DialogDescription className="text-center font-body text-sm leading-relaxed">
            {resolvedSubtext}
          </DialogDescription>
        </DialogHeader>

        {!code ? (
          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
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
              onClick={() => onOpenChange(false)}
              className="w-full px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {cancelLabel}
            </button>
            <p className="text-center font-sans text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              One code per email · Valid on first order
            </p>
          </form>
        ) : (
          <div className="border border-primary/40 bg-background p-6 text-center">
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Your discount code
            </p>
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="font-display text-2xl tracking-[0.2em] text-primary sm:text-3xl">{code}</span>
              <button
                onClick={copyCode}
                aria-label="Copy code"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
              Send this code on WhatsApp to claim your 10% off.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-4 w-4" />
              Send Code on WhatsApp
            </a>
            <button
              onClick={() => onOpenChange(false)}
              className="mt-3 w-full px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
