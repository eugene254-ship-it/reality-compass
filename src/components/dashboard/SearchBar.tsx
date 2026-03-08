import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { knowledgeNodes } from "./KnowledgeGraph";
import { nodeEvidenceData } from "./NodeDetailCard";

interface SearchBarProps {
  onFilter: (matchedNodeIds: string[]) => void;
}

// Simple keyword-based search across node labels, descriptions, experiments, and locations
const searchNodes = (query: string): string[] => {
  if (!query.trim()) return [];
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  
  const scored: { id: string; score: number }[] = knowledgeNodes.map((node) => {
    const evidence = nodeEvidenceData[node.id];
    const searchableText = [
      node.label,
      node.stage,
      evidence?.description || "",
      ...(evidence?.experiments.map((e) => `${e.title} ${e.location} ${e.status}`) || []),
    ]
      .join(" ")
      .toLowerCase();

    const score = terms.reduce((acc, term) => {
      if (searchableText.includes(term)) return acc + 1;
      return acc;
    }, 0);

    return { id: node.id, score };
  });

  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.id);
};

const suggestions = [
  "climate techniques for arid regions",
  "water harvesting",
  "renewable energy",
  "health delivery",
  "carbon sequestration",
  "drought resistant crops",
];

const SearchBar = ({ onFilter }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (!value.trim()) {
        onFilter([]);
        setResultCount(null);
        return;
      }
      const ids = searchNodes(value);
      onFilter(ids);
      setResultCount(ids.length);
    },
    [onFilter]
  );

  const handleClear = () => {
    setQuery("");
    onFilter([]);
    setResultCount(null);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search knowledge... e.g. 'What climate techniques work best in arid regions?'"
          className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count */}
      <AnimatePresence>
        {resultCount !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-full mt-1 text-xs text-muted-foreground"
          >
            {resultCount === 0 ? "No matches found" : `${resultCount} knowledge node${resultCount > 1 ? "s" : ""} matched`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {focused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-border bg-card/95 backdrop-blur-md p-3 z-30"
          >
            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Try searching</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSearch(s);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
