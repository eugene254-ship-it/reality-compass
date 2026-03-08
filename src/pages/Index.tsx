import { useState, useCallback } from "react";
import { Globe, Brain, Zap, Satellite, BookOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import MetricCard from "@/components/dashboard/MetricCard";
import KnowledgeGraph from "@/components/dashboard/KnowledgeGraph";
import VelocityChart from "@/components/dashboard/VelocityChart";
import RegionalInnovation from "@/components/dashboard/RegionalInnovation";
import EvidenceLayers from "@/components/dashboard/EvidenceLayers";
import AdoptionPipeline from "@/components/dashboard/AdoptionPipeline";
import WorldMap from "@/components/dashboard/WorldMap";
import SearchBar from "@/components/dashboard/SearchBar";
import StageFilter from "@/components/dashboard/StageFilter";
import SubmitNodeModal from "@/components/dashboard/SubmitNodeModal";
import type { NodeStage } from "@/components/dashboard/KnowledgeNode";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [searchMatchIds, setSearchMatchIds] = useState<string[]>([]);
  const [activeStages, setActiveStages] = useState<NodeStage[]>([]);
  const [submitOpen, setSubmitOpen] = useState(false);

  const handleFilter = useCallback((ids: string[]) => {
    setSearchMatchIds(ids);
  }, []);

  const handleSubmitNode = (node: { label: string; description: string; stage: NodeStage; evidenceLinks: string[] }) => {
    toast({
      title: "Node submitted",
      description: `"${node.label}" has been submitted for review.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Atlas</h1>
              <p className="text-xs text-muted-foreground">Knowledge Evolution Dashboard</p>
            </div>
          </div>
          <SearchBar onFilter={handleFilter} />
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setSubmitOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit
            </button>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-stage-validated"
            />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stage Filter */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <StageFilter activeStages={activeStages} onChange={setActiveStages} />
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Brain} label="Active Ideas" value="3,717" change="+142 this month" delay={0} />
          <MetricCard icon={Zap} label="Velocity Spikes" value="23" change="+8 emerging breakthroughs" delay={0.1} />
          <MetricCard icon={Satellite} label="Satellite Verified" value="89" change="+12 confirmed impacts" delay={0.2} />
          <MetricCard icon={BookOpen} label="Sources Ingested" value="48.2K" change="+2,340 this week" delay={0.3} />
        </div>

        {/* Adoption Pipeline */}
        <AdoptionPipeline />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <KnowledgeGraph
              highlightIds={searchMatchIds.length > 0 ? searchMatchIds : undefined}
              activeStages={activeStages}
            />
          </div>
          <div className="lg:col-span-2">
            <EvidenceLayers />
          </div>
        </div>

        {/* World Map */}
        <WorldMap activeStages={activeStages} />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VelocityChart />
          <RegionalInnovation activeStages={activeStages} />
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Atlas — A scientific nervous system for humanity. Reality is the referee.
          </p>
        </footer>
      </main>

      <SubmitNodeModal open={submitOpen} onClose={() => setSubmitOpen(false)} onSubmit={handleSubmitNode} />
    </div>
  );
};

export default Index;
