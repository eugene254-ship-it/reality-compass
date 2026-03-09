-- Create node_edges table for knowledge graph relationships
CREATE TABLE public.node_edges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'related',
  strength INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_node_id, to_node_id)
);

-- Enable RLS
ALTER TABLE public.node_edges ENABLE ROW LEVEL SECURITY;

-- Anyone can read edges for approved nodes
CREATE POLICY "Anyone can read edges for approved nodes"
ON public.node_edges
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.knowledge_nodes
    WHERE id = node_edges.from_node_id AND status = 'approved'
  ) AND EXISTS (
    SELECT 1 FROM public.knowledge_nodes
    WHERE id = node_edges.to_node_id AND status = 'approved'
  )
);

-- Admins can manage all edges
CREATE POLICY "Admins can insert edges"
ON public.node_edges
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update edges"
ON public.node_edges
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete edges"
ON public.node_edges
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add index for performance
CREATE INDEX idx_node_edges_from ON public.node_edges(from_node_id);
CREATE INDEX idx_node_edges_to ON public.node_edges(to_node_id);