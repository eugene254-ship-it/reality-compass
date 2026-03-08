import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Link as LinkIcon } from "lucide-react";
import { NodeStage } from "./KnowledgeNode";

interface SubmitNodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (node: {
    label: string;
    description: string;
    stage: NodeStage;
    evidenceLinks: string[];
  }) => void;
}

const stages: { value: NodeStage; label: string }[] = [
  { value: "theory", label: "Theoretical" },
  { value: "pilot", label: "Pilot Testing" },
  { value: "validated", label: "Field Validated" },
  { value: "global", label: "Global Adoption" },
];

const SubmitNodeModal = ({ open, onClose, onSubmit }: SubmitNodeModalProps) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<NodeStage>("theory");
  const [links, setLinks] = useState<string[]>([""]);

  const handleAddLink = () => setLinks([...links, ""]);
  const handleLinkChange = (i: number, val: string) => {
    const updated = [...links];
    updated[i] = val;
    setLinks(updated);
  };
  const handleRemoveLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (!label.trim() || !description.trim()) return;
    onSubmit({
      label: label.trim(),
      description: description.trim(),
      stage,
      evidenceLinks: links.filter((l) => l.trim()),
    });
    setLabel("");
    setDescription("");
    setStage("theory");
    setLinks([""]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg rounded-lg border border-border card-gradient p-6 mx-4"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">Submit Knowledge Node</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value.slice(0, 100))}
                  placeholder="e.g. Drought-Resistant Crop Rotation"
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Describe the innovation, methodology, or finding..."
                  className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              {/* Stage */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Stage</label>
                <div className="flex gap-2 flex-wrap">
                  {stages.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStage(s.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                        stage === s.value
                          ? `bg-stage-${s.value}/20 border-stage-${s.value}/50 text-stage-${s.value}`
                          : "border-border text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Links */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Evidence Links</label>
                <div className="space-y-2">
                  {links.map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-2">
                        <LinkIcon className="w-3 h-3 text-muted-foreground shrink-0" />
                        <input
                          value={link}
                          onChange={(e) => handleLinkChange(i, e.target.value.slice(0, 500))}
                          placeholder="https://doi.org/..."
                          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                      </div>
                      {links.length > 1 && (
                        <button
                          onClick={() => handleRemoveLink(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {links.length < 5 && (
                    <button
                      onClick={handleAddLink}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add another link
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!label.trim() || !description.trim()}
                className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Submit Node
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitNodeModal;
