import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Shield, Check, X, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAllKnowledgeNodes, useUpdateNodeStatus, useUserRole } from "@/hooks/useKnowledgeNodes";
import { toast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";

const stageBadge: Record<string, string> = {
  theory: "bg-stage-theory/20 text-stage-theory",
  pilot: "bg-stage-pilot/20 text-stage-pilot",
  validated: "bg-stage-validated/20 text-stage-validated",
  global: "bg-stage-global/20 text-stage-global",
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useUserRole(user?.id);
  const { data: nodes = [], isLoading } = useAllKnowledgeNodes();
  const updateStatus = useUpdateNodeStatus();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

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
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage knowledge node submissions</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && ` (${nodes.filter((n) => n.status === f).length})`}
              {f === "all" && ` (${nodes.length})`}
            </button>
          ))}
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
            {filteredNodes.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg border border-border card-gradient p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">{node.label}</h3>
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
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Created {new Date(node.created_at).toLocaleDateString()}
                      {node.submitted_by && ` · by ${node.submitted_by.slice(0, 8)}...`}
                    </p>
                  </div>
                  {node.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
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
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
