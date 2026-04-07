import { useState, useEffect } from "react";
import { Eye, ShoppingBag } from "lucide-react";

const LiveTrafficSignal = () => {
  const [viewers, setViewers] = useState(0);
  const [sold, setSold] = useState(0);

  useEffect(() => {
    // Initial realistic values
    setViewers(Math.floor(Math.random() * 30) + 18);
    setSold(Math.floor(Math.random() * 8) + 3);

    const interval = setInterval(() => {
      setViewers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(8, Math.min(60, prev + delta));
      });
      setSold((prev) => {
        // Occasionally increment sold count
        if (Math.random() < 0.15) return Math.min(prev + 1, 25);
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <Eye size={14} className="text-muted-foreground" />
        <span className="font-sans text-xs tracking-wider text-muted-foreground">
          <span className="text-foreground font-medium">{viewers}</span> people viewing now
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ShoppingBag size={14} className="text-primary" />
        <span className="font-sans text-xs tracking-wider text-muted-foreground">
          <span className="text-primary font-medium">{sold}</span> sold in the last hour
        </span>
      </div>
    </div>
  );
};

export default LiveTrafficSignal;
