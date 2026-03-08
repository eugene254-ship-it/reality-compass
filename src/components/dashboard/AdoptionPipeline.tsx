import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stages = [
  { label: "Theory", count: 2847, color: "bg-stage-theory", textColor: "text-stage-theory" },
  { label: "Experiment", count: 634, color: "bg-stage-pilot", textColor: "text-stage-pilot" },
  { label: "Field Impact", count: 189, color: "bg-stage-validated", textColor: "text-stage-validated" },
  { label: "Global Adoption", count: 47, color: "bg-stage-global", textColor: "text-stage-global" },
];

const AdoptionPipeline = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg border border-border card-gradient p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Adoption Pipeline</h2>
        <p className="text-sm text-muted-foreground">Theory → Experiment → Field Impact → Global Adoption</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2 flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex-1 text-center p-4 rounded-lg bg-secondary/50 border border-border/50"
            >
              <div className={`text-2xl font-bold ${stage.textColor}`}>
                {stage.count.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stage.label}</div>
              <div className={`w-full h-1 rounded-full mt-3 ${stage.color} opacity-40`} />
            </motion.div>
            {i < stages.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdoptionPipeline;
