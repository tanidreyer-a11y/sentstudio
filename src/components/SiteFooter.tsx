import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="py-16 bg-noir border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-wider text-primary mb-6">
              SCENT STUDIO
            </h3>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Purveyors of the world's finest fragrances. Experience luxury, redefined.
            </p>
            <a
              href="https://instagram.com/scentstudio_floracentre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:text-gold-light transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-body text-sm">@scentstudio_floracentre</span>
            </a>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-foreground mb-6">Shop</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "For Him", path: "/catalog/men" },
                { label: "For Her", path: "/catalog/women" },
                { label: "Find My Scent", path: "/quiz" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="font-body text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-foreground mb-6">Company</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "About", path: "/about" },
                { label: "Reviews", path: "/reviews" },
              { label: "Journal", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="font-body text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-foreground mb-6">Contact</h4>
            <div className="font-body text-base text-muted-foreground space-y-2">
              <p>Flora Shopping Centre</p>
              <p>Conrad St &amp; Ontdekkers Rd</p>
              <p>Florida North, Roodepoort</p>
              <a href="mailto:scentstudio.fragrance@gmail.com" className="block mt-4 text-sm hover:text-primary transition-colors">scentstudio.fragrance@gmail.com</a>
              <a
                href="https://wa.me/27761328213"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-primary hover:text-gold-light transition-colors"
              >
                WhatsApp: 076 132 8213
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="font-sans text-xs tracking-wider text-muted-foreground">
            © 2026 Scent Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
