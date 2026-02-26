import { Crown, Gift, Sparkles, Star } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

const perks = [
  { icon: Crown, title: "Priority Access", description: "Be the first to shop new arrivals and limited editions." },
  { icon: Gift, title: "Birthday Gift", description: "Receive a complimentary fragrance sample on your birthday." },
  { icon: Sparkles, title: "Exclusive Discounts", description: "Enjoy 15% off all orders as a VIP member." },
  { icon: Star, title: "Free Samples", description: "Get 2 free samples with every order you place." },
];

const VIPPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Exclusive</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              VIP <span className="italic">Membership</span>
            </h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8 mb-8" />
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
              Join our inner circle and unlock exclusive perks, early access, and personalized fragrance experiences.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {perks.map((perk) => (
              <div key={perk.title} className="p-8 bg-card border border-border flex gap-6">
                <perk.icon className="text-primary shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-display text-lg text-foreground mb-2">{perk.title}</h3>
                  <p className="font-body text-base text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://wa.me/27792449607?text=Hi%20Scent%20Studio!%20I'm%20interested%20in%20VIP%20membership."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-primary text-primary-foreground font-sans text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
            >
              Join VIP via WhatsApp
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default VIPPage;
