import { motion } from "framer-motion";

export type NodeStage = "theory" | "pilot" | "validated" | "global";

interface KnowledgeNodeProps {
  x: number;
  y: number;
  size: number;
  stage: NodeStage;
  label: string;
  delay?: number;
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

const KnowledgeNode = ({ x, y, size, stage, label, delay = 0 }: KnowledgeNodeProps) => {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring" }}
    >
      <motion.circle
        cx={x}
        cy={y}
        r={size + 4}
        fill="none"
        stroke={stageColors[stage]}
        strokeWidth={1}
        opacity={0.3}
        animate={{ r: [size + 4, size + 10, size + 4], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={stageColors[stage]}
        opacity={0.85}
        style={{ filter: `drop-shadow(${stageGlow[stage]})` }}
      />
      <text
        x={x}
        y={y + size + 16}
        textAnchor="middle"
        fill="hsl(210, 40%, 75%)"
        fontSize={10}
        fontFamily="Space Grotesk"
        fontWeight={400}
      >
        {label}
      </text>
    </motion.g>
  );
};

export default KnowledgeNode;
