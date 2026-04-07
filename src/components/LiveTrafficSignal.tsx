import { Eye, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

const LiveTrafficSignal = () => {
  const [viewers, setViewers] = useState(() => Math.floor(Math.random() * 18) + 12);
  const [soldLastHour, setSoldLastHour] = useState(() => Math.floor(Math.random() * 6) + 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(45, prev + delta));
      });
      setSoldLastHour((prev) => {
        if (Math.random() < 0.3) {
          const delta = Math.random() < 0.5 ? 1 : -1;
          return Math.max(1, Math.min(15, prev + delta));
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 py-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <Eye size={14} className="text-muted-foreground" />
        <span className="font-sans text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{viewers}</span> viewing now
        </span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-2">
        <ShoppingBag size={14} className="text-primary" />
        <span className="font-sans text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{soldLastHour}</span> sold in the last hour
        </span>
      </div>
    </div>
  );
};

export default LiveTrafficSignal;
