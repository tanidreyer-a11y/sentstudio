import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

const FindMyScentFab = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-2xl w-72 animate-fade-up">
          <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-display text-base text-foreground">Need Help Choosing?</h3>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
            Our Fragrance Stylist will match you with your perfect scent in under 60 seconds.
          </p>
          <button
            onClick={() => { setOpen(false); navigate("/find-my-scent"); }}
            className="w-full py-2.5 bg-primary text-primary-foreground font-sans text-xs tracking-[0.15em] uppercase rounded-lg hover:bg-primary/90 transition-colors"
          >
            Find My Scent
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="group w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center relative"
        aria-label="Find my scent"
      >
        <Sparkles className="w-6 h-6" />
        {!open && (
          <span className="absolute -top-1 -left-36 bg-card border border-border text-foreground font-sans text-[11px] tracking-wide px-3 py-1.5 rounded-full shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Struggling to find your scent?
          </span>
        )}
      </button>
    </div>
  );
};

export default FindMyScentFab;
