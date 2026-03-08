import { motion } from "framer-motion";
import { X, FlaskConical, Satellite, FileText, MapPin } from "lucide-react";
import { NodeStage } from "./KnowledgeNode";

interface NodeEvidence {
  id: string;
  label: string;
  stage: NodeStage;
  credibility: number;
  validation: number;
  impact: number;
  experiments: { title: string; location: string; status: string }[];
  relatedIds: string[];
  description: string;
}

export const nodeEvidenceData: Record<string, NodeEvidence> = {
  "regen-ag": {
    id: "regen-ag",
    label: "Regenerative Agriculture",
    stage: "validated",
    credibility: 92,
    validation: 78,
    impact: 71,
    description: "Holistic farming systems that restore soil health, increase biodiversity, and sequester atmospheric carbon.",
    experiments: [
      { title: "Cerrado Soil Restoration Trial", location: "Brazil", status: "Active — Year 3" },
      { title: "Sahel Regreening Initiative", location: "Niger", status: "Completed — Positive" },
      { title: "Permaculture Yield Study", location: "Australia", status: "Active — Year 1" },
    ],
    relatedIds: ["soil-carbon", "drought-crop", "bio-pest", "water-harvest"],
  },
  "soil-carbon": {
    id: "soil-carbon",
    label: "Soil Carbon Capture",
    stage: "pilot",
    credibility: 85,
    validation: 62,
    impact: 48,
    description: "Methods to increase soil organic carbon through cover cropping, no-till, and biochar application.",
    experiments: [
      { title: "Biochar Field Trial", location: "Kenya", status: "Active — Year 2" },
      { title: "No-Till Carbon Measurement", location: "USA", status: "Completed — Positive" },
    ],
    relatedIds: ["regen-ag", "carbon-seq"],
  },
  "drought-crop": {
    id: "drought-crop",
    label: "Drought-Resistant Crops",
    stage: "validated",
    credibility: 94,
    validation: 88,
    impact: 76,
    description: "Genetically improved and traditionally bred crop varieties that maintain yields under water stress conditions.",
    experiments: [
      { title: "CIMMYT Wheat Trials", location: "Ethiopia", status: "Completed — Positive" },
      { title: "Sorghum Resilience Program", location: "India", status: "Active — Year 4" },
      { title: "Cassava Drought Adaptation", location: "Nigeria", status: "Active — Year 2" },
    ],
    relatedIds: ["regen-ag", "flood-mit"],
  },
  "flood-mit": {
    id: "flood-mit",
    label: "Flood Mitigation",
    stage: "pilot",
    credibility: 79,
    validation: 65,
    impact: 55,
    description: "Nature-based and engineered solutions for flood risk reduction in vulnerable communities.",
    experiments: [
      { title: "Mangrove Buffer Zones", location: "Bangladesh", status: "Active — Year 3" },
      { title: "Urban Sponge City Pilot", location: "China", status: "Completed — Positive" },
    ],
    relatedIds: ["solar-irr"],
  },
  "water-harvest": {
    id: "water-harvest",
    label: "Water Harvesting",
    stage: "global",
    credibility: 88,
    validation: 91,
    impact: 85,
    description: "Ancient and modern techniques to capture and store rainwater for agricultural and domestic use.",
    experiments: [
      { title: "Terrace Systems", location: "Kenya", status: "Completed — Positive" },
      { title: "Fog Net Collection", location: "Morocco", status: "Active — Year 5" },
      { title: "Rooftop Harvesting Scale-up", location: "India", status: "Scaling" },
    ],
    relatedIds: ["regen-ag", "health-del"],
  },
  "bio-pest": {
    id: "bio-pest",
    label: "Biopesticide Research",
    stage: "theory",
    credibility: 72,
    validation: 35,
    impact: 22,
    description: "Development of biological pest control agents derived from natural organisms and compounds.",
    experiments: [
      { title: "Neem Extract Efficacy Study", location: "India", status: "Lab Phase" },
    ],
    relatedIds: ["regen-ag"],
  },
  "solar-irr": {
    id: "solar-irr",
    label: "Solar Irrigation",
    stage: "pilot",
    credibility: 81,
    validation: 68,
    impact: 52,
    description: "Solar-powered pumping systems replacing diesel irrigation in off-grid agricultural regions.",
    experiments: [
      { title: "Thar Desert Solar Pump Network", location: "India", status: "Active — Year 2" },
      { title: "Solar Drip Integration", location: "Ethiopia", status: "Active — Year 1" },
    ],
    relatedIds: ["flood-mit", "renew-grid"],
  },
  "health-del": {
    id: "health-del",
    label: "Health Delivery Models",
    stage: "validated",
    credibility: 90,
    validation: 82,
    impact: 78,
    description: "Community-based health worker networks and mobile health platforms for underserved populations.",
    experiments: [
      { title: "Amhara CHW Network", location: "Ethiopia", status: "Completed — Positive" },
      { title: "mHealth Maternal Care", location: "Tanzania", status: "Active — Year 3" },
    ],
    relatedIds: ["mrna-dist", "water-harvest"],
  },
  "mrna-dist": {
    id: "mrna-dist",
    label: "mRNA Distribution",
    stage: "theory",
    credibility: 76,
    validation: 28,
    impact: 18,
    description: "Cold-chain-free mRNA vaccine delivery systems for tropical and remote regions.",
    experiments: [
      { title: "Thermostable Lipid Nanoparticle Study", location: "UK", status: "Lab Phase" },
    ],
    relatedIds: ["health-del"],
  },
  "renew-grid": {
    id: "renew-grid",
    label: "Renewable Grid Systems",
    stage: "global",
    credibility: 95,
    validation: 90,
    impact: 88,
    description: "Distributed renewable energy generation and smart grid infrastructure for universal energy access.",
    experiments: [
      { title: "East Africa Mini-Grid Rollout", location: "Kenya", status: "Scaling" },
      { title: "Island Microgrid Network", location: "Philippines", status: "Completed — Positive" },
      { title: "Rural Solar+Storage", location: "India", status: "Scaling" },
    ],
    relatedIds: ["micro-grid", "solar-irr"],
  },
  "micro-grid": {
    id: "micro-grid",
    label: "Micro-Grid Networks",
    stage: "validated",
    credibility: 87,
    validation: 79,
    impact: 72,
    description: "Localized energy distribution systems enabling community-owned power infrastructure.",
    experiments: [
      { title: "Village Microgrid Cluster", location: "Nigeria", status: "Active — Year 2" },
      { title: "Peer-to-Peer Energy Trading", location: "Bangladesh", status: "Active — Year 1" },
    ],
    relatedIds: ["renew-grid"],
  },
  "carbon-seq": {
    id: "carbon-seq",
    label: "Carbon Sequestration",
    stage: "theory",
    credibility: 68,
    validation: 30,
    impact: 20,
    description: "Advanced methods for long-term atmospheric carbon storage in geological and biological systems.",
    experiments: [
      { title: "Enhanced Weathering Trial", location: "Iceland", status: "Lab Phase" },
    ],
    relatedIds: ["soil-carbon"],
  },
};

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
  const data = nodeEvidenceData[nodeId];
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-4 right-4 w-80 max-h-[420px] overflow-y-auto rounded-lg border border-border bg-card/95 backdrop-blur-md p-4 z-20"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full bg-stage-${data.stage}`} />
        <span className="text-xs font-medium text-muted-foreground">{stageLabels[data.stage]}</span>
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{data.label}</h3>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{data.description}</p>

      {/* Evidence Scores */}
      <div className="space-y-2 mb-4">
        {[
          { label: "Research Credibility", value: data.credibility, icon: FileText, color: "bg-stage-theory" },
          { label: "Experimental Validation", value: data.validation, icon: FlaskConical, color: "bg-stage-pilot" },
          { label: "Planetary Impact", value: data.impact, icon: Satellite, color: "bg-stage-validated" },
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
          Field Experiments ({data.experiments.length})
        </h4>
        <div className="space-y-2">
          {data.experiments.map((exp) => (
            <div key={exp.title} className="p-2 rounded-md bg-secondary/50 border border-border/50">
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
