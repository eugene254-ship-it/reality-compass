import { useState, useCallback } from "react";
import { Globe, Brain, Zap, Satellite, BookOpen, Plus, LogIn, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import { useKnowledgeNodes, useSubmitNode, useNodeEdges, useUserRole } from "@/hooks/useKnowledgeNodes";

const Index = () => {
  const [searchMatchIds, setSearchMatchIds] = useState<string[]>([]);
  const [activeStages, setActiveStages] = useState<NodeStage[]>([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: nodes = [] } = useKnowledgeNodes();
  const { data: edges = [] } = useNodeEdges();
  const { data: role } = useUserRole(user?.id);
  const submitNode = useSubmitNode();

  const handleFilter = useCallback((ids: string[]) => {
    setSearchMatchIds(ids);
  }, []);

  const handleSubmitNode = (node: { label: string; description: string; stage: NodeStage; evidenceLinks: string[] }) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to submit nodes.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    submitNode.mutate(
      {
        label: node.label,
        description: node.description,
        stage: node.stage,
        evidence_links: node.evidenceLinks,
        submitted_by: user.id,
      },
      {
        onSuccess: () => {
          toast({ title: "Node submitted", description: `"${node.label}" has been submitted for review.` });
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  const handleSubmitClick = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to submit nodes.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setSubmitOpen(true);
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
          <SearchBar onFilter={handleFilter} nodes={nodes} />
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
            <button
              onClick={handleSubmitClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit
            </button>
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </button>
            )}
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
          <MetricCard icon={Brain} label="Active Ideas" value={String(nodes.length)} change="from database" delay={0} />
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
              dbNodes={nodes}
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
