import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Copy, Check, X, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const STORAGE_KEY = "scentDiscountPopupSeen";
const QUIZ_ANSWERS_KEY = "scentMiniQuizAnswers";

type Step = "gender" | "mood" | "occasion" | "email" | "success";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number too long")
    .regex(/^[0-9+\s\-()]+$/, "Digits only"),
});

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SCENT10-${s}`;
};

const GENDER_OPTS = [
  { v: "men", label: "For Him" },
  { v: "women", label: "For Her" },
  { v: "unisex", label: "Either / Unisex" },
];
const MOOD_OPTS = [
  { v: "Fresh", label: "Fresh & Clean" },
  { v: "Warm", label: "Warm & Cozy" },
  { v: "Sensual", label: "Sensual & Bold" },
  { v: "Deep", label: "Deep & Mysterious" },
  { v: "Light", label: "Light & Easy" },
];
const OCCASION_OPTS = [
  { v: "everyday", label: "Everyday Wear" },
  { v: "office", label: "Office / Work" },
  { v: "night", label: "Date Night" },
  { v: "special", label: "Special Occasions" },
];

const DiscountPopup = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("gender");
  const [gender, setGender] = useState("");
  const [mood, setMood] = useState("");
  const [occasion, setOccasion] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [returning, setReturning] = useState(false);
  const triggeredRef = useRef(false);

  // Trigger: 8s timer OR exit-intent, whichever comes first. Once per browser.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setOpen(true);
    };

    const t = setTimeout(trigger, 8000);

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const pickGender = (v: string) => {
    setGender(v);
    setStep("mood");
  };
  const pickMood = (v: string) => {
    setMood(v);
    setStep("occasion");
  };
  const pickOccasion = (v: string) => {
    setOccasion(v);
    setStep("email");
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
    const cleanEmail = parsed.data.email.toLowerCase();
    const source = `quiz:${gender}/${mood}/${occasion}`;

    const { error } = await supabase.from("leads").insert({
      email: cleanEmail,
      phone: parsed.data.phone,
      discount_code: discountCode,
      source,
    });

    if (error) {
      if (error.code === "23505") {
        // Returning visitor — fetch their existing code so they can still use it
        const { data: existing } = await supabase
          .from("leads")
          .select("discount_code")
          .eq("email", cleanEmail)
          .maybeSingle();
        if (existing?.discount_code) {
          setCode(existing.discount_code);
          setReturning(true);
          setStep("success");
          localStorage.setItem(STORAGE_KEY, "1");
          setSubmitting(false);
          return;
        }
        toast({ title: "You're already on the list", description: "This email has already claimed a discount.", variant: "destructive" });
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
      setSubmitting(false);
      return;
    }

    // Save quiz answers so /find-my-scent can prefill
    localStorage.setItem(
      QUIZ_ANSWERS_KEY,
      JSON.stringify({ gender, mood, occasion, savedAt: Date.now() })
    );

    setSubmitting(false);
    setCode(discountCode);
    setStep("success");
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepIndex = ["gender", "mood", "occasion", "email"].indexOf(step);
  const progress = step === "success" ? 100 : ((stepIndex + 1) / 4) * 100;

  const back = () => {
    if (step === "mood") setStep("gender");
    else if (step === "occasion") setStep("mood");
    else if (step === "email") setStep("occasion");
  };

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

        {step !== "success" && (
          <div className="h-1 w-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8 text-center">
          {step !== "success" ? (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.4em] text-primary">
                30-Second Scent Quiz
              </p>
              <h2 className="mb-2 font-display text-2xl font-light text-foreground sm:text-3xl">
                Find Your Match + Get 10% Off
              </h2>
              <p className="mb-5 font-body text-xs leading-relaxed text-muted-foreground">
                Join 2,400+ scent lovers — answer 3 quick questions to unlock your discount.
              </p>
            </>
          ) : null}

          {step === "gender" && (
            <div className="flex flex-col gap-2">
              <p className="mb-1 font-body text-sm font-medium text-foreground">Who is this for?</p>
              {GENDER_OPTS.map((o) => (
                <button
                  key={o.v}
                  onClick={() => pickGender(o.v)}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {o.label}
                </button>
              ))}
              <button onClick={dismiss} className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
                Maybe later
              </button>
            </div>
          )}

          {step === "mood" && (
            <div className="flex flex-col gap-2">
              <p className="mb-1 font-body text-sm font-medium text-foreground">Pick a vibe.</p>
              {MOOD_OPTS.map((o) => (
                <button
                  key={o.v}
                  onClick={() => pickMood(o.v)}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {o.label}
                </button>
              ))}
              <button onClick={back} className="mt-2 inline-flex items-center justify-center gap-1 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            </div>
          )}

          {step === "occasion" && (
            <div className="flex flex-col gap-2">
              <p className="mb-1 font-body text-sm font-medium text-foreground">When will you wear it?</p>
              {OCCASION_OPTS.map((o) => (
                <button
                  key={o.v}
                  onClick={() => pickOccasion(o.v)}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {o.label}
                </button>
              ))}
              <button onClick={back} className="mt-2 inline-flex items-center justify-center gap-1 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
              <p className="text-center font-body text-sm font-medium text-foreground">
                Almost done — unlock your 10% off.
              </p>
              <p className="text-center font-body text-xs text-muted-foreground -mt-1 mb-1">
                We'll save your results so you can pick up where you left off.
              </p>
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
                {submitting ? "Unlocking…" : "Unlock My 10% Off"}
              </button>
              <button type="button" onClick={back} className="inline-flex items-center justify-center gap-1 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
            </form>
          )}

          {step === "success" && code && (
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-2 font-display text-2xl font-light text-foreground">
                {returning ? "Welcome back!" : "You're in."}
              </h2>
              <p className="mb-4 font-body text-sm text-muted-foreground">
                {returning
                  ? "Here's your existing 10% code — still good to use."
                  : "Your scent match is ready. Use this code at checkout."}
              </p>
              <div className="mb-4 border border-primary/40 bg-secondary p-4">
                <p className="mb-1 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Your code</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-2xl tracking-[0.2em] text-primary">{code}</span>
                  <button onClick={copyCode} aria-label="Copy code" className="text-muted-foreground hover:text-primary">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="mb-1 font-body text-xs leading-relaxed text-foreground">
                Apply at checkout for <span className="text-primary font-medium">10% off any fragrance</span> sitewide.
              </p>
              <p className="mb-4 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-destructive">
                ⏳ Expires in 30 days — one-time use
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    dismiss();
                    navigate("/find-my-scent");
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90"
                >
                  See My Full Match
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={dismiss}
                  className="inline-flex w-full items-center justify-center gap-2 border border-border px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-foreground hover:border-primary hover:text-primary"
                >
                  Continue to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;