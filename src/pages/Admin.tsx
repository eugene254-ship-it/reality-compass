import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Shield, Check, X, ArrowLeft, Loader2, 
  Sparkles, Calculator, Link2, Plus, ChevronDown, ChevronUp,
  FlaskConical, Edit2, Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  useAllKnowledgeNodes, 
  useUpdateNodeStatus, 
  useUserRole,
  useValidateEvidence,
  useCalculateImpact,
  useUpdateNodeScores,
  useUpdateNodeStage,
  useNodeExperiments,
  useCreateExperiment,
  useNodeEdges,
  useCreateEdge,
} from "@/hooks/useKnowledgeNodes";
import { toast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";

const stageBadge: Record<string, string> = {
  theory: "bg-stage-theory/20 text-stage-theory",
  pilot: "bg-stage-pilot/20 text-stage-pilot",
  validated: "bg-stage-validated/20 text-stage-validated",
  global: "bg-stage-global/20 text-stage-global",
};

const stages = ["theory", "pilot", "validated", "global"] as const;

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useUserRole(user?.id);
  const { data: nodes = [], isLoading } = useAllKnowledgeNodes();
  const { data: edges = [] } = useNodeEdges();
  const updateStatus = useUpdateNodeStatus();
  const validateEvidence = useValidateEvidence();
  const calculateImpact = useCalculateImpact();
  const updateScores = useUpdateNodeScores();
  const updateStage = useUpdateNodeStage();
  const createEdge = useCreateEdge();
  const createExperiment = useCreateExperiment();
  
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [editingScores, setEditingScores] = useState<string | null>(null);
  const [scoreInputs, setScoreInputs] = useState({ credibility: 0, validation: 0, impact: 0 });
  const [newExperiment, setNewExperiment] = useState({ title: "", location: "" });
  const [newEdge, setNewEdge] = useState({ toNodeId: "" });

  const filteredNodes = filter === "all" ? nodes : nodes.filter((n) => n.status === filter);

  const handleAction = (id: string, status: string, label: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast({ title: `Node ${status}`, description: `"${label}" has been ${status}.` }),
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleValidate = (nodeId: string, label: string) => {
    toast({ title: "Validating evidence...", description: "AI is analyzing evidence links." });
    validateEvidence.mutate(nodeId, {
      onSuccess: (data) => {
        toast({ 
          title: "Evidence validated", 
          description: `Credibility: ${data.credibility}, Validation: ${data.validation}, Impact: ${data.impact}` 
        });
      },
      onError: (err: any) => toast({ title: "Validation failed", description: err.message, variant: "destructive" }),
    });
  };

  const handleCalculateImpact = (nodeId: string) => {
    calculateImpact.mutate(nodeId, {
      onSuccess: (data) => {
        toast({ 
          title: "Impact calculated", 
          description: `New impact score: ${data.impact}` 
        });
      },
      onError: (err: any) => toast({ title: "Calculation failed", description: err.message, variant: "destructive" }),
    });
  };

  const handleSaveScores = (nodeId: string) => {
    updateScores.mutate(
      { id: nodeId, ...scoreInputs },
      {
        onSuccess: () => {
          toast({ title: "Scores updated" });
          setEditingScores(null);
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleStageChange = (nodeId: string, stage: typeof stages[number]) => {
    updateStage.mutate(
      { id: nodeId, stage },
      {
        onSuccess: () => toast({ title: "Stage updated" }),
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleAddExperiment = (nodeId: string) => {
    if (!newExperiment.title.trim()) return;
    createExperiment.mutate(
      { node_id: nodeId, title: newExperiment.title, location: newExperiment.location },
      {
        onSuccess: () => {
          toast({ title: "Experiment added" });
          setNewExperiment({ title: "", location: "" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleAddEdge = (fromNodeId: string) => {
    if (!newEdge.toNodeId) return;
    createEdge.mutate(
      { from_node_id: fromNodeId, to_node_id: newEdge.toNodeId },
      {
        onSuccess: () => {
          toast({ title: "Connection added" });
          setNewEdge({ toNodeId: "" });
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-4">You need admin privileges to access this panel.</p>
          <button onClick={() => navigate("/")} className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage knowledge nodes, scores & experiments</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => {
            const count = f === "all" ? nodes.length : nodes.filter((n) => n.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`p-4 rounded-lg border transition-colors ${
                  filter === f
                    ? "border-primary bg-primary/10"
                    : "border-border card-gradient hover:border-muted-foreground/50"
                }`}
              >
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{f}</p>
              </button>
            );
          })}
        </div>

        {/* Nodes list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredNodes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No {filter} nodes found.</div>
        ) : (
          <div className="space-y-3">
            {filteredNodes.map((node, i) => {
              const isExpanded = expandedNode === node.id;
              const isEditingThis = editingScores === node.id;
              const nodeEdges = edges.filter(e => e.from_node_id === node.id || e.to_node_id === node.id);
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-border card-gradient"
                >
                  {/* Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground">{node.label}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${stageBadge[node.stage] || ""}`}>
                            {node.stage}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              node.status === "approved"
                                ? "bg-stage-validated/20 text-stage-validated"
                                : node.status === "rejected"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {node.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{node.description}</p>
                        
                        {/* Scores */}
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className="text-muted-foreground">
                            Credibility: <span className="text-foreground font-medium">{node.credibility || 0}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Validation: <span className="text-foreground font-medium">{node.validation || 0}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Impact: <span className="text-foreground font-medium">{node.impact || 0}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Links: <span className="text-foreground font-medium">{node.evidence_links?.length || 0}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Edges: <span className="text-foreground font-medium">{nodeEdges.length}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {node.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(node.id, "approved", node.label)}
                              disabled={updateStatus.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-stage-validated/20 text-stage-validated text-xs font-medium hover:bg-stage-validated/30 transition-colors disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(node.id, "rejected", node.label)}
                              disabled={updateStatus.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/30 transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border overflow-hidden"
                      >
                        <div className="p-4 space-y-4">
                          {/* Actions row */}
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleValidate(node.id, node.label)}
                              disabled={validateEvidence.isPending}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              AI Validate Evidence
                            </button>
                            <button
                              onClick={() => handleCalculateImpact(node.id)}
                              disabled={calculateImpact.isPending}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                            >
                              <Calculator className="w-3.5 h-3.5" />
                              Calculate Impact
                            </button>
                            <button
                              onClick={() => {
                                setEditingScores(isEditingThis ? null : node.id);
                                setScoreInputs({
                                  credibility: node.credibility || 0,
                                  validation: node.validation || 0,
                                  impact: node.impact || 0,
                                });
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              {isEditingThis ? "Cancel Edit" : "Edit Scores"}
                            </button>
                          </div>

                          {/* Manual score editing */}
                          {isEditingThis && (
                            <div className="p-3 rounded-md bg-muted/50 space-y-3">
                              <div className="grid grid-cols-3 gap-3">
                                {(["credibility", "validation", "impact"] as const).map((field) => (
                                  <div key={field}>
                                    <label className="text-xs text-muted-foreground capitalize">{field}</label>
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={scoreInputs[field]}
                                      onChange={(e) => setScoreInputs({ ...scoreInputs, [field]: Number(e.target.value) })}
                                      className="w-full mt-1 px-2 py-1 rounded border border-border bg-background text-sm"
                                    />
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => handleSaveScores(node.id)}
                                disabled={updateScores.isPending}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                <Save className="w-3.5 h-3.5" />
                                Save Scores
                              </button>
                            </div>
                          )}

                          {/* Stage selector */}
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Stage</label>
                            <div className="flex gap-2">
                              {stages.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStageChange(node.id, s)}
                                  disabled={updateStage.isPending}
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    node.stage === s
                                      ? stageBadge[s]
                                      : "bg-muted text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Evidence links */}
                          {node.evidence_links && node.evidence_links.length > 0 && (
                            <div>
                              <label className="text-xs text-muted-foreground block mb-1.5">Evidence Links</label>
                              <div className="space-y-1">
                                {node.evidence_links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
                                  >
                                    <Link2 className="w-3 h-3 shrink-0" />
                                    {link}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add experiment */}
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">
                              <FlaskConical className="w-3 h-3 inline mr-1" />
                              Add Experiment
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Title"
                                value={newExperiment.title}
                                onChange={(e) => setNewExperiment({ ...newExperiment, title: e.target.value })}
                                className="flex-1 px-2 py-1 rounded border border-border bg-background text-xs"
                              />
                              <input
                                type="text"
                                placeholder="Location"
                                value={newExperiment.location}
                                onChange={(e) => setNewExperiment({ ...newExperiment, location: e.target.value })}
                                className="w-32 px-2 py-1 rounded border border-border bg-background text-xs"
                              />
                              <button
                                onClick={() => handleAddExperiment(node.id)}
                                disabled={createExperiment.isPending || !newExperiment.title.trim()}
                                className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs disabled:opacity-50"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Add edge connection */}
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">
                              <Link2 className="w-3 h-3 inline mr-1" />
                              Add Connection
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={newEdge.toNodeId}
                                onChange={(e) => setNewEdge({ toNodeId: e.target.value })}
                                className="flex-1 px-2 py-1 rounded border border-border bg-background text-xs"
                              >
                                <option value="">Select node to connect...</option>
                                {nodes
                                  .filter((n) => n.id !== node.id && n.status === "approved")
                                  .map((n) => (
                                    <option key={n.id} value={n.id}>
                                      {n.label}
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => handleAddEdge(node.id)}
                                disabled={createEdge.isPending || !newEdge.toNodeId}
                                className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs disabled:opacity-50"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
