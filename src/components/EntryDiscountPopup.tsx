import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DiscountModal from "./DiscountModal";

const STORAGE_KEY = "scentstudio_entry_discount_seen";

const EntryDiscountPopup = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't show on admin/login pages
    if (pathname.startsWith("/admin") || pathname === "/login") return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <DiscountModal
      open={open}
      onOpenChange={handleOpenChange}
      source="entry-popup"
      cancelLabel="Maybe later"
    />
  );
};

export default EntryDiscountPopup;
