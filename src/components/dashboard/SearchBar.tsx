import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { KnowledgeNode } from "@/hooks/useKnowledgeNodes";

interface SearchBarProps {
  onFilter: (matchedNodeIds: string[]) => void;
  nodes?: KnowledgeNode[];
}

const suggestions = [
  "climate techniques for arid regions",
  "water harvesting",
  "renewable energy",
  "health delivery",
  "carbon sequestration",
  "drought resistant crops",
];

const SearchBar = ({ onFilter, nodes = [] }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);

  const searchNodes = useCallback(
    (q: string): string[] => {
      if (!q.trim()) return [];
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      return nodes
        .map((node) => {
          const text = [node.label, node.stage, node.description].join(" ").toLowerCase();
          const score = terms.reduce((acc, t) => (text.includes(t) ? acc + 1 : acc), 0);
          return { id: node.id, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.id);
    },
    [nodes]
  );

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
    [onFilter, searchNodes]
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
      <AnimatePresence>
        {resultCount !== null && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 top-full mt-1 text-xs text-muted-foreground">
            {resultCount === 0 ? "No matches found" : `${resultCount} knowledge node${resultCount > 1 ? "s" : ""} matched`}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {focused && !query && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-border bg-card/95 backdrop-blur-md p-3 z-30">
            <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Try searching</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} onMouseDown={(e) => { e.preventDefault(); handleSearch(s); }} className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors">
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
