import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import KnowledgeNode, { NodeStage } from "./KnowledgeNode";
import NodeDetailCard from "./NodeDetailCard";
import type { KnowledgeNode as DBNode } from "@/hooks/useKnowledgeNodes";

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

// Static positions for known seed nodes
const staticPositions: Record<string, { x: number; y: number; size: number }> = {
  "a1000000-0000-0000-0000-000000000001": { x: 300, y: 160, size: 18 },
  "a1000000-0000-0000-0000-000000000002": { x: 200, y: 100, size: 12 },
  "a1000000-0000-0000-0000-000000000003": { x: 420, y: 100, size: 14 },
  "a1000000-0000-0000-0000-000000000004": { x: 520, y: 200, size: 16 },
  "a1000000-0000-0000-0000-000000000005": { x: 140, y: 220, size: 10 },
  "a1000000-0000-0000-0000-000000000006": { x: 380, y: 260, size: 8 },
  "a1000000-0000-0000-0000-000000000007": { x: 500, y: 300, size: 11 },
  "a1000000-0000-0000-0000-000000000008": { x: 100, y: 320, size: 15 },
  "a1000000-0000-0000-0000-000000000009": { x: 220, y: 350, size: 9 },
  "a1000000-0000-0000-0000-000000000010": { x: 460, y: 380, size: 17 },
  "a1000000-0000-0000-0000-000000000011": { x: 340, y: 400, size: 13 },
  "a1000000-0000-0000-0000-000000000012": { x: 80, y: 160, size: 7 },
};

// Static edges between seed nodes
const seedEdges: GraphEdge[] = [
  { from: "a1000000-0000-0000-0000-000000000001", to: "a1000000-0000-0000-0000-000000000002" },
  { from: "a1000000-0000-0000-0000-000000000001", to: "a1000000-0000-0000-0000-000000000003" },
  { from: "a1000000-0000-0000-0000-000000000001", to: "a1000000-0000-0000-0000-000000000006" },
  { from: "a1000000-0000-0000-0000-000000000002", to: "a1000000-0000-0000-0000-000000000012" },
  { from: "a1000000-0000-0000-0000-000000000005", to: "a1000000-0000-0000-0000-000000000001" },
  { from: "a1000000-0000-0000-0000-000000000004", to: "a1000000-0000-0000-0000-000000000007" },
  { from: "a1000000-0000-0000-0000-000000000008", to: "a1000000-0000-0000-0000-000000000009" },
  { from: "a1000000-0000-0000-0000-000000000010", to: "a1000000-0000-0000-0000-000000000011" },
  { from: "a1000000-0000-0000-0000-000000000010", to: "a1000000-0000-0000-0000-000000000007" },
  { from: "a1000000-0000-0000-0000-000000000005", to: "a1000000-0000-0000-0000-000000000008" },
];

function hashPosition(id: string, index: number): { x: number; y: number } {
  // Deterministic pseudo-random position from id
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  const x = 60 + Math.abs(hash % 480);
  const y = 60 + Math.abs((hash * 31 + index * 97) % 340);
  return { x, y };
}

interface KnowledgeGraphProps {
  highlightIds?: string[];
  activeStages?: NodeStage[];
  dbNodes?: DBNode[];
}

const KnowledgeGraph = ({ highlightIds, activeStages = [], dbNodes = [] }: KnowledgeGraphProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const graphNodes: GraphNode[] = useMemo(() => {
    return dbNodes.map((n, i) => {
      const pos = staticPositions[n.id] || hashPosition(n.id, i);
      return {
        id: n.id,
        x: pos.x,
        y: pos.y,
        size: staticPositions[n.id]?.size ?? 10,
        stage: n.stage as NodeStage,
        label: n.label,
      };
    });
  }, [dbNodes]);

  const nodeMap = useMemo(() => Object.fromEntries(graphNodes.map((n) => [n.id, n])), [graphNodes]);

  // Only use edges where both endpoints exist
  const edges = useMemo(() => {
    const nodeIds = new Set(graphNodes.map((n) => n.id));
    return seedEdges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));
  }, [graphNodes]);

  const adjacency = useMemo(() => {
    const adj: Record<string, Set<string>> = {};
    graphNodes.forEach((n) => (adj[n.id] = new Set()));
    edges.forEach((e) => {
      adj[e.from]?.add(e.to);
      adj[e.to]?.add(e.from);
    });
    return adj;
  }, [graphNodes, edges]);

  const getRelatedSet = (): Set<string> | null => {
    if (selectedId) {
      const set = new Set<string>([selectedId]);
      adjacency[selectedId]?.forEach((id) => set.add(id));
      return set;
    }
    if (highlightIds && highlightIds.length > 0) return new Set(highlightIds);
    if (activeStages.length > 0) return new Set(graphNodes.filter((n) => activeStages.includes(n.stage)).map((n) => n.id));
    return null;
  };

  const relatedSet = getRelatedSet();

  return (
    <div className="relative w-full rounded-lg border border-border card-gradient overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="px-6 pt-5 pb-2 relative z-10">
        <h2 className="text-lg font-semibold text-foreground">Knowledge Network</h2>
        <p className="text-sm text-muted-foreground">
          {graphNodes.length === 0
            ? "Loading nodes from database..."
            : selectedId
            ? "Click node to explore — showing related cluster"
            : "Click any node to explore its evidence and experiments"}
        </p>
      </div>
      <svg viewBox="0 0 600 450" className="w-full h-auto relative z-10" preserveAspectRatio="xMidYMid meet">
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
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
        {graphNodes.map((node, i) => (
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
      {selectedId && <NodeDetailCard nodeId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
};

export default KnowledgeGraph;
