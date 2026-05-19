import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import DiscountModal from "@/components/DiscountModal";
import { perfumes, Perfume } from "@/data/perfumes";
import { getPerfumeImage } from "@/lib/perfume-images";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// ─── Name → DB ID mapping ───
const menNameMap: Record<string, string> = {
  "Acqua Di Gio": "armani-acqua-di-gio",
  "CK1": "calvin-klein-ck1",
  "1 Million Elixir": "paco-rabanne-one-million-elixir",
  "Issey Miyake": "issey-miyake-leau-dissey",
  "Terre D'Hermes": "hermes-terre-dhermes",
  "JPG Scandal Men": "jpg-scandal-pour-homme",
  "Mugler Angel Men": "thierry-mugler-angel-men",
  "Arabian White Oud": "montale-arabian-white-oud",
  "Baccarat Rouge": "mfk-baccarat-rouge-540",
  "Invictus": "paco-rabanne-invictus",
  "Ted Lapidus": "ted-lapidus-pour-homme",
  "Aramis 900": "aramis-900",
  "Dior Sauvage": "dior-sauvage",
  "Versace Dylan Blue": "versace-dylan-blue",
  "Mont Blanc Legend": "mont-blanc-legend",
  "Valentino Uomo": "valentino-uomo",
  "Diesel Fuel For Life": "diesel-fuel-for-life",
  "Versace Eros": "versace-eros",
  "Tom Ford Black Orchid": "tom-ford-black-orchid",
  "Bvlgari Man In Black": "bvlgari-man-in-black",
  "Davidoff Cool Water": "davidoff-cool-water",
  "Lacoste Essential": "lacoste-essential",
  "Hugo Boss Bottled Tonic": "hugo-boss-bottled-tonic",
  "Creed Aventus": "creed-aventus",
  "Montale Black Aoud": "montale-black-aoud",
};

const womenNameMap: Record<string, string> = {
  "D&G Light Blue": "dg-light-blue-women",
  "D&G The One Women": "dg-the-one-women",
  "Green Tea": "elizabeth-arden-green-tea",
  "Elizabeth Arden Green Tea": "elizabeth-arden-green-tea",
  "Tommy Girl": "tommy-hilfiger-tommy-girl",
  "Lady Million": "paco-rabanne-lady-million",
  "La Vie Est Belle": "lancome-la-vie-est-belle",
  "CH Good Girl": "carolina-herrera-good-girl",
  "Coco Mademoiselle": "chanel-coco-mademoiselle",
  "J'adore": "dior-jadore",
  "Dior Hypnotic Poison": "dior-hypnotic-poison",
  "Portrait of a Lady": "frederic-malle-portrait-of-a-lady",
  "YSL Black Opium": "ysl-black-opium",
  "JPG Scandal Women": "jpg-scandal",
  "Versace Eros Women": "versace-eros-pour-femme",
  "Mugler Alien": "thierry-mugler-alien",
  "Chanel No. 5": "chanel-no5",
  "Mancera Rose Vanilla": "mancera-rose-vanille",
  "Gucci Rush": "gucci-rush",
  "Burberry Her": "burberry-her",
  "Lacoste Touch of Pink": "lacoste-touch-of-pink",
};

function resolveId(shortName: string, gender: "men" | "women" | "unisex"): string {
  if (gender === "men") return menNameMap[shortName] || "";
  if (gender === "women") return womenNameMap[shortName] || "";
  // unisex: try both
  return menNameMap[shortName] || womenNameMap[shortName] || "";
}

// ─── 25-point mapping matrices ───
const menMatrix: Record<string, string[]> = {
  QF: ["Acqua Di Gio", "Lacoste Essential", "CK1"],
  QW: ["Valentino Uomo", "Diesel Fuel For Life", "1 Million Elixir"],
  QS: ["Dior Sauvage", "Versace Dylan Blue", "Mont Blanc Legend"],
  QD: ["Tom Ford Black Orchid", "Arabian White Oud", "Bvlgari Man In Black"],
  QL: ["Issey Miyake", "Davidoff Cool Water", "Hugo Boss Bottled Tonic"],
  CF: ["Versace Dylan Blue", "Dior Sauvage", "Acqua Di Gio"],
  CW: ["1 Million Elixir", "Valentino Uomo", "Diesel Fuel For Life"],
  CS: ["Invictus", "Dior Sauvage", "Versace Eros"],
  CD: ["Baccarat Rouge", "Creed Aventus", "Tom Ford Black Orchid"],
  CL: ["Mont Blanc Legend", "CK1", "Lacoste Essential"],
  MF: ["Acqua Di Gio", "Dior Sauvage", "Issey Miyake"],
  MW: ["Ted Lapidus", "Valentino Uomo", "Diesel Fuel For Life"],
  MS: ["Creed Aventus", "Bvlgari Man In Black", "Aramis 900"],
  MD: ["Arabian White Oud", "Tom Ford Black Orchid", "Montale Black Aoud"],
  ML: ["Acqua Di Gio", "Davidoff Cool Water", "Issey Miyake"],
  AF: ["Dior Sauvage", "Versace Dylan Blue", "Acqua Di Gio"],
  AW: ["Valentino Uomo", "1 Million Elixir", "Diesel Fuel For Life"],
  AS: ["Creed Aventus", "Baccarat Rouge", "Bvlgari Man In Black"],
  AD: ["Terre D'Hermes", "Arabian White Oud", "Montale Black Aoud"],
  AL: ["Mont Blanc Legend", "Lacoste Essential", "CK1"],
  PF: ["1 Million Elixir", "Acqua Di Gio", "Versace Dylan Blue"],
  PW: ["Diesel Fuel For Life", "Valentino Uomo", "Versace Eros"],
  PS: ["Invictus", "JPG Scandal Men", "Mugler Angel Men"],
  PD: ["Bvlgari Man In Black", "Tom Ford Black Orchid", "Arabian White Oud"],
  PL: ["Davidoff Cool Water", "Issey Miyake", "Lacoste Essential"],
};

const womenMatrix: Record<string, string[]> = {
  QF: ["Elizabeth Arden Green Tea", "Lacoste Touch of Pink", "D&G Light Blue"],
  QW: ["La Vie Est Belle", "CH Good Girl", "Burberry Her"],
  QS: ["Coco Mademoiselle", "J'adore", "Portrait of a Lady"],
  QD: ["Mancera Rose Vanilla", "Arabian White Oud", "Dior Hypnotic Poison"],
  QL: ["Tommy Girl", "Lacoste Touch of Pink", "Green Tea"],
  CF: ["D&G Light Blue", "Green Tea", "Lacoste Touch of Pink"],
  CW: ["Versace Eros Women", "Lady Million", "La Vie Est Belle"],
  CS: ["Gucci Rush", "CH Good Girl", "Mugler Alien"],
  CD: ["Portrait of a Lady", "Chanel No. 5", "Arabian White Oud"],
  CL: ["Burberry Her", "Versace Eros Women", "Tommy Girl"],
  MF: ["D&G Light Blue", "Green Tea", "Lacoste Touch of Pink"],
  MW: ["La Vie Est Belle", "Mugler Alien", "Lady Million"],
  MS: ["Chanel No. 5", "Coco Mademoiselle", "Portrait of a Lady"],
  MD: ["Dior Hypnotic Poison", "Arabian White Oud", "Mancera Rose Vanilla"],
  ML: ["Lacoste Touch of Pink", "Tommy Girl", "Green Tea"],
  AF: ["D&G The One Women", "J'adore", "Gucci Rush"],
  AW: ["La Vie Est Belle", "YSL Black Opium", "Lady Million"],
  AS: ["Portrait of a Lady", "Coco Mademoiselle", "Gucci Rush"],
  AD: ["Portrait of a Lady", "Dior Hypnotic Poison", "Arabian White Oud"],
  AL: ["Tommy Girl", "Lacoste Touch of Pink", "Green Tea"],
  PF: ["Versace Eros Women", "D&G Light Blue", "Burberry Her"],
  PW: ["Lady Million", "La Vie Est Belle", "CH Good Girl"],
  PS: ["Mugler Alien", "YSL Black Opium", "JPG Scandal Women"],
  PD: ["Arabian White Oud", "Mancera Rose Vanilla", "Dior Hypnotic Poison"],
  PL: ["Elizabeth Arden Green Tea", "Tommy Girl", "Lacoste Touch of Pink"],
};

// ─── Longevity scores ───
const longevityMap: Record<string, number> = {
  "tom-ford-black-orchid": 10, "mfk-baccarat-rouge-540": 10, "montale-arabian-white-oud": 10,
  "montale-black-aoud": 10, "arabian-white-oud-women": 10, "mancera-rose-vanille": 10,
  "dior-sauvage": 9, "creed-aventus": 9, "dior-hypnotic-poison": 9, "hermes-terre-dhermes": 9,
  "paco-rabanne-one-million": 8, "paco-rabanne-one-million-elixir": 8, "thierry-mugler-alien": 8,
  "chanel-no5": 8, "paco-rabanne-invictus": 8, "paco-rabanne-lady-million": 8,
};

function getLongevity(id: string): number {
  return longevityMap[id] || 7;
}

// ─── Personality ego-boost lines ───
const vibeResponses: Record<string, string> = {
  Q: "The quiet ones always have the most depth. Your scent should whisper power, not shout it.",
  C: "Main character energy — love that. Let's find something that announces you before you even speak.",
  M: "Mysterious is magnetic. People should wonder what that scent is… and never forget it.",
  A: "Driven and focused — you need a scent that matches your ambition. Something commanding.",
  P: "Life's too short for boring fragrances. Let's find something as fun and vibrant as you are.",
};

// ─── Occasion best-for labels ───
const occasionLabels: Record<string, string> = {
  A: "Everyday / Work",
  B: "Gym / Casual",
  C: "Date Nights",
  D: "Parties / Nights Out",
  E: "Formal Events",
};

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  options?: { label: string; value: string }[];
  results?: RecommendationResult[];
}

interface RecommendationResult {
  perfume: Perfume;
  matchType: "PERFECT" | "SAFE" | "WILDCARD";
  whyItFits: string;
  bestOccasion: string;
  longevity: number;
}

const FindMyScentPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Welcome to Scent Studio. I'm your Personal Fragrance Stylist — here to find the scent that was made for you. ✨\n\nWhat's your name?",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState<"men" | "women" | "unisex">("men");
  const [personality, setPersonality] = useState("");
  const [intensity, setIntensity] = useState("");
  const [occasion, setOccasion] = useState("");
  const [amplifier, setAmplifier] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [topRecommendation, setTopRecommendation] = useState<string | null>(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const addMessages = (...msgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  };

  const processStep = (userMessage: string) => {
    const text = userMessage.trim();

    if (step === 0) {
      // Name
      const name = text.split(/\s+/)[0];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setUserName(capitalized);
      setStep(1);
      addMessages(
        { role: "user", content: text },
        {
          role: "assistant",
          content: `Lovely to meet you, ${capitalized}. Let's create something special.\n\nAre you shopping for a **man**, **woman**, or would you like me to **surprise you**?`,
          options: [
            { label: "For Him 🧔", value: "man" },
            { label: "For Her 👩", value: "woman" },
            { label: "Surprise Me ✨", value: "surprise" },
          ],
        }
      );
      return;
    }

    if (step === 1) {
      // Gender
      const lower = text.toLowerCase();
      let g: "men" | "women" | "unisex" = "unisex";
      if (/\b(woman|women|female|her)\b/i.test(lower)) g = "women";
      else if (/\b(man|men|male|him)\b/i.test(lower)) g = "men";
      setGender(g);
      setStep(2);
      const genderLabel = g === "men" ? "the gentleman" : g === "women" ? "the lady" : "the adventurer";
      addMessages(
        { role: "user", content: text },
        {
          role: "assistant",
          content: `Perfect — shopping for ${genderLabel}. Excellent taste already, ${userName}.\n\nNow tell me — how would you describe your natural vibe?`,
          options: [
            { label: "A) Quiet, keeps to themselves", value: "Q" },
            { label: "B) Confident, room-energy", value: "C" },
            { label: "C) Calm, mysterious", value: "M" },
            { label: "D) Focused, ambitious", value: "A" },
            { label: "E) Playful, light-hearted", value: "P" },
          ],
        }
      );
      return;
    }

    if (step === 2) {
      // Personality
      const val = text.charAt(0).toUpperCase();
      const keyMap: Record<string, string> = { A: "Q", B: "C", C: "M", D: "A", E: "P" };
      const p = keyMap[val] || text.toUpperCase().charAt(0);
      const validP = ["Q", "C", "M", "A", "P"].includes(p) ? p : "C";
      setPersonality(validP);
      setStep(3);
      addMessages(
        { role: "user", content: text },
        {
          role: "assistant",
          content: `${vibeResponses[validP]}\n\nNow, what kind of intensity do you lean toward?`,
          options: [
            { label: "A) Fresh & Light", value: "F" },
            { label: "B) Warm & Sweet", value: "W" },
            { label: "C) Strong & Heavy", value: "S" },
            { label: "D) Dark & Resinous", value: "D" },
            { label: "E) Soft & Subtle", value: "L" },
          ],
        }
      );
      return;
    }

    if (step === 3) {
      // Intensity
      const val = text.charAt(0).toUpperCase();
      const keyMap: Record<string, string> = { A: "F", B: "W", C: "S", D: "D", E: "L" };
      const i = keyMap[val] || text.toUpperCase().charAt(0);
      const validI = ["F", "W", "S", "D", "L"].includes(i) ? i : "F";
      setIntensity(validI);
      setStep(4);
      addMessages(
        { role: "user", content: text },
        {
          role: "assistant",
          content: `Wonderful — that gives me a clear sense of your style.\n\nWhat occasion will you be wearing this most?`,
          options: [
            { label: "A) Everyday / Work", value: "A" },
            { label: "B) Gym / Casual", value: "B" },
            { label: "C) Date Nights / Romantic", value: "C" },
            { label: "D) Parties / Nights Out", value: "D" },
            { label: "E) Formal / Impressing", value: "E" },
          ],
        }
      );
      return;
    }

    if (step === 4) {
      // Occasion
      const val = text.charAt(0).toUpperCase();
      const validO = ["A", "B", "C", "D", "E"].includes(val) ? val : "A";
      setOccasion(validO);
      setStep(5);
      addMessages(
        { role: "user", content: text },
        {
          role: "assistant",
          content: `Love that. Last question, ${userName} — and this one's the most important.\n\nWhat should this scent **amplify** about you?`,
          options: [
            { label: "A) Confidence", value: "A" },
            { label: "B) Mystery / Intrigue", value: "B" },
            { label: "C) Warmth / Friendliness", value: "C" },
            { label: "D) Power / Dominance", value: "D" },
            { label: "E) Elegance / Class", value: "E" },
          ],
        }
      );
      return;
    }

    if (step === 5) {
      // Amplifier → calculate results
      const val = text.charAt(0).toUpperCase();
      const validAmp = ["A", "B", "C", "D", "E"].includes(val) ? val : "A";
      setAmplifier(validAmp);
      setStep(6);

      const results = calculateResults(gender, personality, intensity, occasion, validAmp);
      setTopRecommendation(results[0]?.perfume.name ?? null);
      addMessages(
        { role: "user", content: text },
        {
          role: "assistant",
          content: `${userName}, I've curated your perfect fragrance wardrobe. These three scents were chosen specifically for your personality, lifestyle, and the energy you want to project.\n\nHere are your matches:`,
          results,
        }
      );
      return;
    }
  };

  const calculateResults = (
    g: "men" | "women" | "unisex",
    pers: string,
    inten: string,
    occ: string,
    amp: string
  ): RecommendationResult[] => {
    let names: string[];
    const key = `${pers}${inten}`;

    if (g === "unisex") {
      // Unisex mapping
      if ((pers === "Q" || pers === "M") && inten === "D") {
        names = ["Baccarat Rouge", "Arabian White Oud", "Tom Ford Black Orchid"];
      } else if ((pers === "C" || pers === "A") && inten === "S") {
        names = ["Creed Aventus", "Portrait of a Lady", "Baccarat Rouge"];
      } else if ((pers === "P" || pers === "C") && inten === "W") {
        names = ["1 Million Elixir", "La Vie Est Belle", "Versace Eros"];
      } else if (inten === "F") {
        names = ["Acqua Di Gio", "D&G Light Blue", "CK1"];
      } else if (inten === "D") {
        names = ["Montale Black Aoud", "Mancera Rose Vanilla", "Terre D'Hermes"];
      } else {
        names = ["Baccarat Rouge", "CK1", "Tom Ford Black Orchid"];
      }
    } else {
      const matrix = g === "men" ? menMatrix : womenMatrix;
      names = matrix[key] || matrix["CF"] || [];
    }

    // Clone for mutation
    names = [...names];

    // Occasion overrides
    if (occ === "C" && inten === "F") {
      // Date night + fresh → swap to sweet/musky
      if (g === "men") {
        names[0] = "Valentino Uomo";
        names[1] = "1 Million Elixir";
      } else if (g === "women") {
        names[0] = "Lady Million";
        names[1] = "La Vie Est Belle";
      }
    }
    if (occ === "B") {
      // Gym/Casual
      if (g === "men") {
        names[0] = "Acqua Di Gio";
        names[1] = "Davidoff Cool Water";
      } else if (g === "women") {
        names[0] = "D&G Light Blue";
        names[1] = "Green Tea";
      }
    }
    if (occ === "D" || occ === "E") {
      // Formal/Party
      if (g === "men") {
        names = ["Creed Aventus", "Baccarat Rouge", "Invictus"];
      } else if (g === "women") {
        names = ["Portrait of a Lady", "Chanel No. 5", "Mugler Alien"];
      }
    }

    // Amplifier overrides
    if (amp === "B") {
      // Mystery
      if (g === "men") {
        names[0] = "Tom Ford Black Orchid";
        names[1] = "Arabian White Oud";
      } else if (g === "women") {
        names[0] = "Dior Hypnotic Poison";
        names[1] = "Arabian White Oud";
      }
    }
    if (amp === "C") {
      // Warmth
      if (g === "men") names[1] = "Diesel Fuel For Life";
      else if (g === "women") names[1] = "La Vie Est Belle";
    }
    if (amp === "D") {
      // Power
      if (g === "men") {
        names[0] = "Creed Aventus";
        names[1] = "Baccarat Rouge";
      } else if (g === "women") {
        names[0] = "Portrait of a Lady";
      }
    }
    if (amp === "E") {
      // Elegance
      if (g === "men") names[1] = "Dior Sauvage";
      else if (g === "women") {
        names[0] = "Coco Mademoiselle";
        names[1] = "J'adore";
      }
    }

    // Deduplicate
    names = [...new Set(names)].slice(0, 3);

    // Resolve to perfume objects
    const resolveGender = g === "unisex" ? "men" : g;
    const matchTypes: ("PERFECT" | "SAFE" | "WILDCARD")[] = ["PERFECT", "SAFE", "WILDCARD"];
    const persLabels: Record<string, string> = {
      Q: "quiet depth", C: "confident energy", M: "mysterious aura", A: "ambitious drive", P: "playful spirit",
    };
    const ampLabels: Record<string, string> = {
      A: "confidence", B: "mystery", C: "warmth", D: "power", E: "elegance",
    };

    return names.map((name, i) => {
      const id = resolveId(name, g === "unisex" ? "unisex" : g);
      const perfume = perfumes.find((p) => p.id === id);
      if (!perfume) {
        // fallback
        const fallback = perfumes.find((p) => p.gender === resolveGender) || perfumes[0];
        return {
          perfume: fallback,
          matchType: matchTypes[i] || "WILDCARD",
          whyItFits: `Selected for your ${persLabels[pers] || "unique"} personality that radiates ${ampLabels[amp] || "style"}.`,
          bestOccasion: occasionLabels[occ] || "Everyday",
          longevity: getLongevity(fallback.id),
        };
      }
      return {
        perfume,
        matchType: matchTypes[i] || "WILDCARD",
        whyItFits: `Selected for your ${persLabels[pers] || "unique"} personality that radiates ${ampLabels[amp] || "style"}.`,
        bestOccasion: occasionLabels[occ] || "Everyday",
        longevity: getLongevity(perfume.id),
      };
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    processStep(input);
    setInput("");
  };

  const handleOptionClick = (value: string) => {
    processStep(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 pt-24 pb-6 flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col max-w-3xl">
          {/* Title */}
          <div className="text-center mb-6">
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-primary mb-2">AI-Powered</p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
              Find My <span className="italic">Scent</span>
            </h1>
            <div className="w-12 h-px bg-primary mx-auto mt-4" />
          </div>

          {/* Chat area */}
          <div
            ref={chatContainerRef}
            className="mb-4 flex-1 space-y-4 overflow-y-auto pr-1"
            style={{ maxHeight: "calc(100vh - 320px)" }}
          >
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "assistant" ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                        <p
                          className="whitespace-pre-line font-body text-sm leading-relaxed text-foreground md:text-base"
                          dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                        />
                      </div>
                      {msg.options && (
                        <div className="flex max-w-[85%] flex-wrap gap-2">
                          {msg.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleOptionClick(opt.value)}
                              className="rounded-full border border-border bg-card/50 px-4 py-2 font-sans text-xs tracking-wider text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.results && <ResultCards results={msg.results} gender={gender} userName={userName} />}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[75%] rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/15 px-4 py-3">
                      <p className="font-body text-sm text-foreground md:text-base">{msg.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          {step < 6 && (
            <div className="border border-border bg-card rounded-xl p-2 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={step === 0 ? "Type your name..." : "Type or select an option..."}
                className="flex-1 bg-transparent px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}

          {step >= 6 && (
            <div className="text-center py-4">
              <button
                onClick={() => {
                  setMessages([{
                    role: "assistant",
                    content: "Welcome back! Let's find another perfect scent for you. ✨\n\nWhat's your name?",
                  }]);
                  setStep(0);
                  setInput("");
                  setUserName("");
                  setGender("men");
                  setPersonality("");
                  setIntensity("");
                  setOccasion("");
                  setAmplifier("");
                }}
                className="px-8 py-3 border border-border font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

// ─── Result Cards Component ───
const ResultCards = ({
  results,
  gender,
  userName,
}: {
  results: RecommendationResult[];
  gender: "men" | "women" | "unisex";
  userName: string;
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const badgeColors: Record<string, string> = {
    PERFECT: "bg-primary text-primary-foreground",
    SAFE: "bg-secondary text-secondary-foreground border border-border",
    WILDCARD: "bg-accent/20 text-accent border border-accent/30",
  };

  return (
    <div className="space-y-4 max-w-full">
      {results.map((r) => (
        <ResultCard
          key={`${r.perfume.id}-${r.matchType}`}
          result={r}
          gender={gender}
          userName={userName}
          badgeColor={badgeColors[r.matchType]}
        />
      ))}
    </div>
  );
};

const ResultCard = ({
  result,
  gender,
  userName,
  badgeColor,
}: {
  result: RecommendationResult;
  gender: "men" | "women" | "unisex";
  userName: string;
  badgeColor: string;
}) => {
  const [selectedSize, setSelectedSize] = useState<"30ml" | "50ml" | "100ml">("50ml");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { perfume, matchType, whyItFits, bestOccasion, longevity } = result;

  const handleAddToCart = () => {
    addToCart({
      perfumeId: perfume.id,
      name: perfume.name,
      size: selectedSize,
      price: perfume.prices[selectedSize],
      gender: perfume.gender,
    });
    toast.success(`${perfume.name} (${selectedSize}) added to cart`);
  };

  const handleWhatsApp = () => {
    const message = `Hi Scent Studio! 🌟\n\nI'm ${userName}, and your Fragrance Stylist recommended:\n\n• ${perfume.name} (${selectedSize}) — R${perfume.prices[selectedSize]}\n\nI'd like to order this. Please confirm availability!`;
    window.open(`https://wa.me/27761328213?text=${encodeURIComponent(message)}`, "_blank");
  };

  const image = getPerfumeImage(perfume.gender, perfume.category);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5">
        {/* Badge + Name */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase mb-2 ${badgeColor}`}>
              {matchType === "PERFECT" ? "✨ Perfect Match" : matchType === "SAFE" ? "🎯 Safe Pick" : "🔥 Wildcard"}
            </span>
            <h3
              className="font-display text-xl text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate(`/perfume/${perfume.id}`)}
            >
              {perfume.name}
            </h3>
            <p className="font-sans text-xs tracking-wider text-muted-foreground uppercase">{perfume.category}</p>
          </div>
          {image && (
            <img
              src={image}
              alt={perfume.name}
              className="w-16 h-20 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Why it fits */}
        <p className="font-body text-sm text-muted-foreground mb-3 italic">"{whyItFits}"</p>

        {/* Notes */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div>
            <p className="font-sans text-[10px] tracking-wider text-primary uppercase mb-1">Top</p>
            <p className="font-body text-muted-foreground">{perfume.notes.top.join(", ")}</p>
          </div>
          <div>
            <p className="font-sans text-[10px] tracking-wider text-primary uppercase mb-1">Heart</p>
            <p className="font-body text-muted-foreground">{perfume.notes.middle.join(", ")}</p>
          </div>
          <div>
            <p className="font-sans text-[10px] tracking-wider text-primary uppercase mb-1">Base</p>
            <p className="font-body text-muted-foreground">{perfume.notes.base.join(", ")}</p>
          </div>
        </div>

        {/* Occasion + Longevity */}
        <div className="flex items-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-sans text-[10px] tracking-wider text-muted-foreground uppercase">Best for:</span>
            <span className="font-body text-foreground">{bestOccasion}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-sans text-[10px] tracking-wider text-muted-foreground uppercase">Longevity:</span>
            <span className="font-body text-primary font-medium">{longevity}/10</span>
          </div>
        </div>

        {/* Size selector */}
        <div className="flex gap-2 mb-3">
          {(["30ml", "50ml", "100ml"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex-1 py-2 rounded-lg font-sans text-xs tracking-wider transition-all ${
                selectedSize === size
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {size} — R{perfume.prices[size]}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 bg-primary text-primary-foreground font-sans text-xs tracking-[0.15em] uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={handleWhatsApp}
            className="py-2.5 px-4 border border-border font-sans text-xs tracking-wider text-muted-foreground rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMyScentPage;
