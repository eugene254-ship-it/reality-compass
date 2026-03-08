import { useState } from "react";
import { motion } from "framer-motion";
import KnowledgeNode, { NodeStage } from "./KnowledgeNode";
import NodeDetailCard from "./NodeDetailCard";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  size: number;
  stage: NodeStage;
  label: string;
}

interface GraphEdge {
  from: string;
  to: string;
}

export const knowledgeNodes: GraphNode[] = [
  { id: "regen-ag", x: 300, y: 160, size: 18, stage: "validated", label: "Regenerative Agriculture" },
  { id: "soil-carbon", x: 200, y: 100, size: 12, stage: "pilot", label: "Soil Carbon Capture" },
  { id: "drought-crop", x: 420, y: 100, size: 14, stage: "validated", label: "Drought-Resistant Crops" },
  { id: "flood-mit", x: 520, y: 200, size: 16, stage: "pilot", label: "Flood Mitigation" },
  { id: "water-harvest", x: 140, y: 220, size: 10, stage: "global", label: "Water Harvesting" },
  { id: "bio-pest", x: 380, y: 260, size: 8, stage: "theory", label: "Biopesticide Research" },
  { id: "solar-irr", x: 500, y: 300, size: 11, stage: "pilot", label: "Solar Irrigation" },
  { id: "health-del", x: 100, y: 320, size: 15, stage: "validated", label: "Health Delivery Models" },
  { id: "mrna-dist", x: 220, y: 350, size: 9, stage: "theory", label: "mRNA Distribution" },
  { id: "renew-grid", x: 460, y: 380, size: 17, stage: "global", label: "Renewable Grid Systems" },
  { id: "micro-grid", x: 340, y: 400, size: 13, stage: "validated", label: "Micro-Grid Networks" },
  { id: "carbon-seq", x: 80, y: 160, size: 7, stage: "theory", label: "Carbon Sequestration" },
];

export const knowledgeEdges: GraphEdge[] = [
  { from: "regen-ag", to: "soil-carbon" },
  { from: "regen-ag", to: "drought-crop" },
  { from: "regen-ag", to: "bio-pest" },
  { from: "soil-carbon", to: "carbon-seq" },
  { from: "water-harvest", to: "regen-ag" },
  { from: "flood-mit", to: "solar-irr" },
  { from: "health-del", to: "mrna-dist" },
  { from: "renew-grid", to: "micro-grid" },
  { from: "renew-grid", to: "solar-irr" },
  { from: "water-harvest", to: "health-del" },
];

const nodeMap = Object.fromEntries(knowledgeNodes.map((n) => [n.id, n]));

// Build adjacency for highlighting related nodes
const adjacency: Record<string, Set<string>> = {};
knowledgeNodes.forEach((n) => (adjacency[n.id] = new Set()));
knowledgeEdges.forEach((e) => {
  adjacency[e.from].add(e.to);
  adjacency[e.to].add(e.from);
});

interface KnowledgeGraphProps {
  highlightIds?: string[];
}

const KnowledgeGraph = ({ highlightIds }: KnowledgeGraphProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getRelatedSet = (): Set<string> | null => {
    if (selectedId) {
      const set = new Set<string>([selectedId]);
      adjacency[selectedId]?.forEach((id) => set.add(id));
      return set;
    }
    if (highlightIds && highlightIds.length > 0) {
      return new Set(highlightIds);
    }
    return null;
  };

  const relatedSet = getRelatedSet();

  return (
    <div className="relative w-full rounded-lg border border-border card-gradient overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="px-6 pt-5 pb-2 relative z-10">
        <h2 className="text-lg font-semibold text-foreground">Knowledge Network</h2>
        <p className="text-sm text-muted-foreground">
          {selectedId ? "Click node to explore — showing related cluster" : "Click any node to explore its evidence and experiments"}
        </p>
      </div>
      <svg
        viewBox="0 0 600 450"
        className="w-full h-auto relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Edges */}
        {knowledgeEdges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          const isHighlighted = relatedSet ? relatedSet.has(edge.from) && relatedSet.has(edge.to) : true;
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? "hsl(210, 50%, 40%)" : "hsl(210, 30%, 25%)"}
              strokeWidth={isHighlighted ? 1.5 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isHighlighted ? 0.7 : 0.15 }}
              transition={{ duration: 1, delay: i * 0.08 }}
            />
          );
        })}
        {/* Nodes */}
        {knowledgeNodes.map((node, i) => (
          <KnowledgeNode
            key={node.id}
            {...node}
            delay={i * 0.1}
            isSelected={selectedId === node.id}
            isDimmed={relatedSet ? !relatedSet.has(node.id) : false}
            onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
          />
        ))}
      </svg>
      {/* Legend */}
      <div className="flex gap-5 px-6 pb-5 relative z-10">
        {(["theory", "pilot", "validated", "global"] as const).map((stage) => (
          <div key={stage} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full bg-stage-${stage}`} />
            <span className="text-xs text-muted-foreground capitalize">
              {stage === "global" ? "Global Adoption" : stage === "validated" ? "Field Validated" : stage === "pilot" ? "Pilot Testing" : "Theoretical"}
            </span>
          </div>
        ))}
      </div>

      {/* Detail Card */}
      {selectedId && (
        <NodeDetailCard nodeId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
};

export default KnowledgeGraph;
