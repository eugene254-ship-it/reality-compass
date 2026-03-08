import { motion } from "framer-motion";
import type { NodeStage } from "./KnowledgeNode";

const stages: { value: NodeStage; label: string }[] = [
  { value: "theory", label: "Theory" },
  { value: "pilot", label: "Pilot" },
  { value: "validated", label: "Validated" },
  { value: "global", label: "Global" },
];

interface StageFilterProps {
  activeStages: NodeStage[];
  onChange: (stages: NodeStage[]) => void;
}

const StageFilter = ({ activeStages, onChange }: StageFilterProps) => {
  const allActive = activeStages.length === 0;

  const toggle = (stage: NodeStage) => {
    if (activeStages.includes(stage)) {
      onChange(activeStages.filter((s) => s !== stage));
    } else {
      onChange([...activeStages, stage]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 flex-wrap"
    >
      <span className="text-xs text-muted-foreground mr-1">Filter:</span>
      <button
        onClick={() => onChange([])}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
          allActive
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:border-muted-foreground/50"
        }`}
      >
        All
      </button>
      {stages.map((s) => {
        const active = activeStages.includes(s.value);
        return (
          <button
            key={s.value}
            onClick={() => toggle(s.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
              active
                ? `border-stage-${s.value}/50 bg-stage-${s.value}/10 text-stage-${s.value}`
                : "border-border text-muted-foreground hover:border-muted-foreground/50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-stage-${s.value}`} />
            {s.label}
          </button>
        );
      })}
    </motion.div>
  );
};

export default StageFilter;
