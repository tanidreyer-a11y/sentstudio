const Footer = () => {
  return (
    <footer className="py-16 bg-noir border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-wider text-primary mb-6">
              MAISON NOIR
            </h3>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Purveyors of the world's finest fragrances since 2010.
              Experience luxury, redefined.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-foreground mb-6">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {["Collection", "About", "Atelier", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="font-body text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div id="contact">
            <h4 className="font-sans text-xs tracking-[0.3em] uppercase text-foreground mb-6">
              Visit Us
            </h4>
            <div className="font-body text-base text-muted-foreground space-y-2">
              <p>42 Rue du Faubourg</p>
              <p>Paris, France 75008</p>
              <p className="mt-4">contact@maisonnoir.com</p>
              <p>+33 1 42 68 00 00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="font-sans text-xs tracking-wider text-muted-foreground">
            © 2026 Maison Noir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
