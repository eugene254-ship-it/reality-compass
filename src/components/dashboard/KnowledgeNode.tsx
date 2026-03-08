import { motion } from "framer-motion";

export type NodeStage = "theory" | "pilot" | "validated" | "global";

interface KnowledgeNodeProps {
  x: number;
  y: number;
  size: number;
  stage: NodeStage;
  label: string;
  delay?: number;
  isSelected?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
}

const stageColors: Record<NodeStage, string> = {
  theory: "hsl(220, 80%, 60%)",
  pilot: "hsl(45, 90%, 55%)",
  validated: "hsl(145, 70%, 45%)",
  global: "hsl(42, 100%, 55%)",
};

const stageGlow: Record<NodeStage, string> = {
  theory: "0 0 12px hsl(220 80% 60% / 0.6)",
  pilot: "0 0 12px hsl(45 90% 55% / 0.6)",
  validated: "0 0 16px hsl(145 70% 45% / 0.6)",
  global: "0 0 20px hsl(42 100% 55% / 0.7)",
};

const KnowledgeNode = ({ x, y, size, stage, label, delay = 0, isSelected, isDimmed, onClick }: KnowledgeNodeProps) => {
  const nodeOpacity = isDimmed ? 0.25 : 1;
  const selectedScale = isSelected ? 1.3 : 1;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: nodeOpacity, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring" }}
      className="cursor-pointer"
      onClick={onClick}
    >
      {/* Pulse ring */}
      <motion.circle
        cx={x}
        cy={y}
        r={size + 4}
        fill="none"
        stroke={stageColors[stage]}
        strokeWidth={isSelected ? 2 : 1}
        opacity={0.3}
        animate={{ r: [size + 4, size + 10, size + 4], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Selection ring */}
      {isSelected && (
        <motion.circle
          cx={x}
          cy={y}
          r={size + 14}
          fill="none"
          stroke={stageColors[stage]}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1, rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Core */}
      <motion.circle
        cx={x}
        cy={y}
        r={size * selectedScale}
        fill={stageColors[stage]}
        opacity={0.85}
        style={{ filter: `drop-shadow(${stageGlow[stage]})` }}
        whileHover={{ scale: 1.15 }}
      />
      {/* Label */}
      <text
        x={x}
        y={y + size * selectedScale + 16}
        textAnchor="middle"
        fill="hsl(210, 40%, 75%)"
        fontSize={isSelected ? 11 : 10}
        fontFamily="Space Grotesk"
        fontWeight={isSelected ? 600 : 400}
      >
        {label}
      </text>
    </motion.g>
  );
};

export default KnowledgeNode;
