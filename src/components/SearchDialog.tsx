import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { searchPerfumes } from "@/data/perfumes";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = query.length >= 2 ? searchPerfumes(query) : [];

  const handleSelect = (id: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/perfume/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 bg-card border-border gap-0">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, notes, mood..."
            className="flex-1 py-4 bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>

        {query.length >= 2 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="py-8 text-center font-body text-muted-foreground">No fragrances found</p>
            ) : (
              results.map((perfume) => (
                <button
                  key={perfume.id}
                  onClick={() => handleSelect(perfume.id)}
                  className="w-full flex items-center gap-4 p-3 rounded hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    <span className="font-display text-lg text-primary">{perfume.name[0]}</span>
                  </div>
                   <div>
                    <p className="font-display text-sm text-foreground">
                      <span className="font-sans text-[10px] tracking-wider text-muted-foreground/70 uppercase mr-1">Inspired by</span>
                      {perfume.name}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground tracking-wider">
                      {perfume.category} · {perfume.gender === "men" ? "For Him" : "For Her"} · From R{perfume.prices["30ml"]}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        <div className="px-4 py-3 border-t border-border">
          <p className="font-sans text-xs text-muted-foreground tracking-wider">
            Try: romantic, fresh, sweet, musky, luxury
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
