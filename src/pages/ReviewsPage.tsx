import { Star } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

const reviews = [
  { name: "Thandi M.", rating: 5, text: "Velvet Rose is absolutely divine! I get compliments every single time I wear it. Scent Studio has the best collection.", perfume: "Velvet Rose" },
  { name: "James K.", rating: 5, text: "Royal Oud is my go-to. The longevity is incredible — lasts from morning to night. Highly recommend!", perfume: "Royal Oud" },
  { name: "Lerato N.", rating: 5, text: "The customer service is top-notch. They helped me find the perfect scent through WhatsApp. Sugar Kiss is perfection.", perfume: "Sugar Kiss" },
  { name: "David P.", rating: 4, text: "Dark Tobacco is unique and classy. I've never smelled anything like it. Great quality at a fair price.", perfume: "Dark Tobacco" },
  { name: "Nomsa S.", rating: 5, text: "I bought Cherry Blossom Dream as a gift and she loved it! Beautiful packaging too. Will definitely be back.", perfume: "Cherry Blossom Dream" },
  { name: "Michael R.", rating: 5, text: "Savage Musk is beast mode. The projection is insane and it just works. My new signature.", perfume: "Savage Musk" },
];

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Testimonials</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">Customer Reviews</h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="p-8 bg-card border border-border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className={j < review.rating ? "text-primary fill-primary" : "text-muted-foreground"}
                    />
                  ))}
                </div>
                <p className="font-body text-base text-muted-foreground leading-relaxed mb-4">"{review.text}"</p>
                <div>
                  <p className="font-display text-sm text-foreground">{review.name}</p>
                  <p className="font-sans text-xs tracking-wider text-primary">{review.perfume}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default ReviewsPage;
