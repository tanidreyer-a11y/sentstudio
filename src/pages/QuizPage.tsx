import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { perfumes, Perfume } from "@/data/perfumes";

interface Question {
  question: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    question: "Who is this fragrance for?",
    options: [
      { label: "For Him", value: "men" },
      { label: "For Her", value: "women" },
    ],
  },
  {
    question: "What vibe are you going for?",
    options: [
      { label: "Fresh & Clean", value: "Fresh" },
      { label: "Sweet & Warm", value: "Sweet" },
      { label: "Dark & Musky", value: "Musky" },
      { label: "Rich & Luxurious", value: "Luxury" },
    ],
  },
  {
    question: "What occasion?",
    options: [
      { label: "Everyday", value: "everyday" },
      { label: "Date Night", value: "date" },
      { label: "Special Event", value: "special" },
      { label: "Office / Professional", value: "office" },
    ],
  },
];

const QuizPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<Perfume[]>([]);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate results
      const gender = newAnswers[0] as "men" | "women";
      const category = newAnswers[1];
      const matched = perfumes.filter(
        (p) => p.gender === gender && p.category === category
      );
      setResults(matched.length > 0 ? matched : perfumes.filter((p) => p.gender === gender).slice(0, 2));
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="font-sans text-sm tracking-[0.4em] uppercase text-primary mb-4">Discover</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Find My <span className="italic">Scent</span>
            </h1>
            <div className="w-16 h-px bg-primary mx-auto mt-8" />
          </div>

          <div className="max-w-xl mx-auto">
            {results.length === 0 ? (
              <div className="text-center">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
                  Question {step + 1} of {questions.length}
                </p>
                <h2 className="font-display text-2xl text-foreground mb-8">
                  {questions[step].question}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {questions[step].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="p-6 border border-border bg-card font-display text-lg text-foreground hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="font-display text-2xl text-foreground mb-2">Your Perfect Match</h2>
                <p className="font-body text-muted-foreground mb-10">Based on your preferences, we recommend:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/perfume/${p.id}`)}
                      className="p-8 bg-card border border-border hover:border-primary transition-colors text-center"
                    >
                      <span className="font-display text-5xl text-primary/30 block mb-4">{p.name[0]}</span>
                      <h3 className="font-display text-lg text-foreground mb-1">{p.name}</h3>
                      <p className="font-sans text-xs tracking-wider text-muted-foreground mb-2">{p.category}</p>
                      <p className="font-sans text-sm text-primary">From R{p.prices["30ml"]}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={restart}
                  className="px-8 py-3 border border-border font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  Take Quiz Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default QuizPage;
