const AboutSection = () => {
  return (
    <section id="about" className="py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">
            Our Philosophy
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-10">
            The Essence of<br />
            <span className="italic">True Luxury</span>
          </h2>
          <div className="w-16 h-px bg-primary mx-auto mb-10" />
          <p className="font-body text-lg md:text-xl text-secondary-foreground/80 leading-relaxed mb-8">
            At Scent Studio, we believe that fragrance is the most intimate form of self-expression.
            Our collection features premium oil-based perfumes inspired by the world's most beloved
            designer fragrances — crafted to deliver the same captivating scent profiles at a
            fraction of the price, with longer-lasting intensity.
          </p>
          <p className="font-body text-lg md:text-xl text-secondary-foreground/80 leading-relaxed">
            Our expert consultants guide you through a sensory journey, helping you discover
            the fragrance that speaks to your unique identity. Visit our atelier and experience
            the art of perfumery.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
