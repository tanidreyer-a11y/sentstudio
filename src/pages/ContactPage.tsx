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

            <div className="flex flex-col items-center p-8 bg-card border border-border text-center">
              <Mail className="text-primary mb-4" size={28} />
              <h3 className="font-display text-lg text-foreground mb-2">Email</h3>
              <p className="font-body text-sm text-muted-foreground break-all">scentstudio.fragrance@gmail.com</p>
            </div>

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

            <div className="flex flex-col items-center p-8 bg-card border border-border text-center">
              <MapPin className="text-primary mb-4" size={28} />
              <h3 className="font-display text-lg text-foreground mb-2">Location</h3>
              <p className="font-body text-sm text-muted-foreground">South Africa</p>
            </div>
          </div>

          <div className="max-w-lg mx-auto mt-16 text-center">
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
