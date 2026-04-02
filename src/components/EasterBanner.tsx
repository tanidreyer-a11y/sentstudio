import { isEasterActive, EASTER_PROMO } from "@/lib/promotions";
import { Link } from "react-router-dom";

const EasterBanner = () => {
  if (!isEasterActive()) return null;

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3 text-center">
        <a href="#collection" className="group inline-block">
          <p className="font-sans text-xs tracking-[0.2em] uppercase sm:text-sm">
            🐣 {EASTER_PROMO.description}{" "}
            <span className="underline underline-offset-4 opacity-80 group-hover:opacity-100 transition-opacity">
              Shop Now →
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default EasterBanner;
