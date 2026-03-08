import { motion } from "framer-motion";
import { MapPin, TrendingUp, Leaf, Droplets } from "lucide-react";

interface Innovation {
  region: string;
  country: string;
  title: string;
  stage: "theory" | "pilot" | "validated" | "global";
  impact: string;
  icon: typeof MapPin;
  velocity: string;
}

const innovations: Innovation[] = [
  {
    region: "Rift Valley",
    country: "Kenya",
    title: "Terrace Water Harvesting",
    stage: "validated",
    impact: "+34% vegetation recovery",
    icon: Droplets,
    velocity: "↑ 420%",
  },
  {
    region: "Cerrado",
    country: "Brazil",
    title: "Syntropic Agroforestry",
    stage: "global",
    impact: "+2.1 tons CO₂/ha/yr captured",
    icon: Leaf,
    velocity: "↑ 280%",
  },
  {
    region: "Thar Desert",
    country: "India",
    title: "Solar Micro-Irrigation",
    stage: "pilot",
    impact: "+47% crop yield in trials",
    icon: TrendingUp,
    velocity: "↑ 150%",
  },
  {
    region: "Sahel Belt",
    country: "Niger",
    title: "Farmer-Managed Natural Regeneration",
    stage: "validated",
    impact: "5M hectares restored",
    icon: Leaf,
    velocity: "↑ 340%",
  },
];

const stageLabels: Record<string, string> = {
  theory: "Theoretical",
  pilot: "Pilot Testing",
  validated: "Field Validated",
  global: "Global Adoption",
};

interface RegionalInnovationProps {
  activeStages?: ("theory" | "pilot" | "validated" | "global")[];
}

const RegionalInnovation = ({ activeStages = [] }: RegionalInnovationProps) => {
  const filtered = activeStages.length > 0
    ? innovations.filter((i) => activeStages.includes(i.stage))
    : innovations;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-lg border border-border card-gradient p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Regional Innovation Detection</h2>
        <p className="text-sm text-muted-foreground">Grassroots breakthroughs verified by satellite evidence</p>
      </div>
      <div className="space-y-4">
        {filtered.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-md border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium bg-stage-${item.stage}/20 text-stage-${item.stage}`}>
                    {stageLabels[item.stage]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MapPin className="w-3 h-3" />
                  {item.region}, {item.country}
                </div>
                <p className="text-xs text-muted-foreground">{item.impact}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-stage-validated">{item.velocity}</span>
                <p className="text-[10px] text-muted-foreground">velocity</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RegionalInnovation;
