import { motion } from "framer-motion";
import { Shield, FlaskConical, Satellite } from "lucide-react";

const layers = [
  {
    icon: Shield,
    title: "Research Credibility",
    score: 87,
    details: ["Peer review status", "Reproducibility index", "Citation velocity"],
    color: "text-stage-theory",
    barColor: "bg-stage-theory",
  },
  {
    icon: FlaskConical,
    title: "Experimental Validation",
    score: 72,
    details: ["Field deployments: 142", "Regions tested: 38", "Replication rate: 76%"],
    color: "text-stage-pilot",
    barColor: "bg-stage-pilot",
  },
  {
    icon: Satellite,
    title: "Planetary Impact",
    score: 64,
    details: ["Satellite-confirmed: 89", "Ecosystem recovery: +23%", "Carbon delta: measurable"],
    color: "text-stage-validated",
    barColor: "bg-stage-validated",
  },
];

const EvidenceLayers = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-lg border border-border card-gradient p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Evidence Layers</h2>
        <p className="text-sm text-muted-foreground">Three-layer verification system</p>
      </div>
      <div className="space-y-5">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-4 h-4 ${layer.color}`} />
                <span className="text-sm font-medium text-foreground">{layer.title}</span>
                <span className={`ml-auto text-sm font-bold ${layer.color}`}>{layer.score}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full rounded-full ${layer.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${layer.score}%` }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: "easeOut" }}
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                {layer.details.map((d) => (
                  <span key={d} className="text-[11px] text-muted-foreground">{d}</span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EvidenceLayers;
