import { useState, useEffect, useCallback } from "react";
import { Eye, ShoppingBag } from "lucide-react";

/**
 * Simulates realistic, fluctuating live traffic numbers.
 * Each "tick" the viewer count drifts up or down randomly,
 * occasionally dropping to zero and recovering.
 */
const useRealisticCounter = (min: number, max: number, intervalMs: number) => {
  const [value, setValue] = useState(() => Math.floor(Math.random() * (max - min + 1)) + min);

  useEffect(() => {
    const tick = () => {
      setValue((prev) => {
        // 15% chance of dropping to zero
        if (Math.random() < 0.15) return 0;
        // If at zero, 60% chance of staying at zero
        if (prev === 0 && Math.random() < 0.6) return 0;
        // Otherwise drift ±1-5
        const drift = Math.floor(Math.random() * 6) - 2; // -2 to +3 bias upward
        const next = prev + drift;
        return Math.max(0, Math.min(max, next));
      });
    };
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [min, max, intervalMs]);

  return value;
};

const LiveTrafficSignal = () => {
  const viewers = useRealisticCounter(0, 38, 4000);
  const soldLastHour = useRealisticCounter(0, 12, 8000);

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <Eye size={14} className="text-primary" />
        <span className="font-sans text-xs tracking-wider text-muted-foreground">
          <span className="text-foreground font-medium">{viewers}</span> viewing now
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ShoppingBag size={14} className="text-primary" />
        <span className="font-sans text-xs tracking-wider text-muted-foreground">
          <span className="text-foreground font-medium">{soldLastHour}</span> sold this hour
        </span>
      </div>
    </div>
  );
};

export default LiveTrafficSignal;
