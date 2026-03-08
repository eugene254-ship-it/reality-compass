import { motion } from "framer-motion";
import { X, FlaskConical, Satellite, FileText, MapPin } from "lucide-react";
import { NodeStage } from "./KnowledgeNode";
import { useKnowledgeNodes, useNodeExperiments } from "@/hooks/useKnowledgeNodes";

const stageLabels: Record<string, string> = {
  theory: "Theoretical",
  pilot: "Pilot Testing",
  validated: "Field Validated",
  global: "Global Adoption",
};

interface NodeDetailCardProps {
  nodeId: string;
  onClose: () => void;
}

const NodeDetailCard = ({ nodeId, onClose }: NodeDetailCardProps) => {
  const { data: nodes = [] } = useKnowledgeNodes();
  const { data: experiments = [] } = useNodeExperiments(nodeId);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-4 right-4 w-80 max-h-[420px] overflow-y-auto rounded-lg border border-border bg-card/95 backdrop-blur-md p-4 z-20"
    >
      <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full bg-stage-${node.stage}`} />
        <span className="text-xs font-medium text-muted-foreground">{stageLabels[node.stage]}</span>
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{node.label}</h3>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{node.description}</p>

      {/* Evidence Scores */}
      <div className="space-y-2 mb-4">
        {[
          { label: "Research Credibility", value: node.credibility ?? 0, icon: FileText, color: "bg-stage-theory" },
          { label: "Experimental Validation", value: node.validation ?? 0, icon: FlaskConical, color: "bg-stage-pilot" },
          { label: "Planetary Impact", value: node.impact ?? 0, icon: Satellite, color: "bg-stage-validated" },
        ].map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <metric.icon className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{metric.label}</span>
              </div>
              <span className="text-[11px] font-semibold text-foreground">{metric.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${metric.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Experiments */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <FlaskConical className="w-3 h-3 text-primary" />
          Field Experiments ({experiments.length})
        </h4>
        <div className="space-y-2">
          {experiments.map((exp) => (
            <div key={exp.id} className="p-2 rounded-md bg-secondary/50 border border-border/50">
              <p className="text-[11px] font-medium text-foreground">{exp.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {exp.location}
                </span>
                <span className="text-[10px] text-primary">{exp.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NodeDetailCard;
