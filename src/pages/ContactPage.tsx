import { MessageCircle, Mail, MapPin, Instagram } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">Contact Us</h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <a
              href="https://wa.me/27761328213"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 bg-card border border-border hover:border-primary transition-colors text-center group"
            >
              <MessageCircle className="text-primary mb-4" size={28} />
              <h3 className="font-display text-lg text-foreground mb-2">WhatsApp</h3>
              <p className="font-body text-sm text-muted-foreground">076 132 8213</p>
            </a>

            <a
              href="mailto:scentstudio.fragrance@gmail.com"
              className="flex flex-col items-center p-8 bg-card border border-border hover:border-primary transition-colors text-center group"
            >
              <Mail className="text-primary mb-4" size={28} />
              <h3 className="font-display text-lg text-foreground mb-2">Email</h3>
              <p className="font-body text-sm text-muted-foreground break-all">scentstudio.fragrance@gmail.com</p>
            </a>

            <a
              href="https://instagram.com/scentstudio_floracentre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 bg-card border border-border hover:border-primary transition-colors text-center group"
            >
              <Instagram className="text-primary mb-4" size={28} />
              <h3 className="font-display text-lg text-foreground mb-2">Instagram</h3>
              <p className="font-body text-sm text-muted-foreground">@scentstudio_floracentre</p>
            </a>

            <a
              href="https://maps.app.goo.gl/PQxRkSyJEw81wPbZ6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-8 bg-card border border-border hover:border-primary transition-colors text-center group"
            >
              <MapPin className="text-primary mb-4" size={28} />
              <h3 className="font-display text-lg text-foreground mb-2">In-Store</h3>
              <p className="font-body text-sm text-muted-foreground">Flora Shopping Centre, Corner Ontdekkers &amp; Conrad St, Florida North, Roodepoort, 1709</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Open Tue 9 AM – 6 PM</p>
            </a>
          </div>

          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="font-display text-2xl text-foreground text-center mb-8">Find Us</h2>
            <div className="w-full aspect-video border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.1!2d27.9095!3d-26.1712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950a1b1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sFlora%20Shopping%20Centre%2C%20Conrad%20St%20%26%20Ontdekkers%20Rd%2C%20Florida%20North%2C%20Roodepoort!5e0!3m2!1sen!2sza!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Flora Shopping Centre Location"
              />
            </div>
          </div>

          <div className="max-w-lg mx-auto mt-12 text-center">
            <a
              href="https://wa.me/27761328213"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
