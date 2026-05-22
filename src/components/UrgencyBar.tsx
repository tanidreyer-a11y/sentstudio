import { useEffect, useState } from "react";
import { X, Flame } from "lucide-react";

const KEY = "scentUrgencyBarDismissed";

const UrgencyBar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="relative w-full bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center gap-2 px-6 py-2 text-center">
        <Flame className="h-3.5 w-3.5 shrink-0" />
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.25em] sm:text-xs">
          First-time visitor? Your 10% off unlocks below — valid sitewide
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default UrgencyBar;