import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  delay?: number;
}

const MetricCard = ({ icon: Icon, label, value, change, positive = true, delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-lg border border-border card-gradient p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className={`text-xs font-medium ${positive ? "text-stage-validated" : "text-destructive"}`}>
        {change}
      </div>
    </motion.div>
  );
};

export default MetricCard;
