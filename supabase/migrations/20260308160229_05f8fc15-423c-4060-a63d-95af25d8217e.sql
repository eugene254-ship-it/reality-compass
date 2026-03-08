
-- Create enum for knowledge node stages
CREATE TYPE public.node_stage AS ENUM ('theory', 'pilot', 'validated', 'global');

-- Create knowledge_nodes table
CREATE TABLE public.knowledge_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  stage node_stage NOT NULL DEFAULT 'theory',
  evidence_links TEXT[] DEFAULT '{}',
  credibility INTEGER DEFAULT 0 CHECK (credibility >= 0 AND credibility <= 100),
  validation INTEGER DEFAULT 0 CHECK (validation >= 0 AND validation <= 100),
  impact INTEGER DEFAULT 0 CHECK (impact >= 0 AND impact <= 100),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiments table
CREATE TABLE public.experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'planned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

-- Knowledge nodes: anyone can read approved nodes
CREATE POLICY "Anyone can read approved nodes"
  ON public.knowledge_nodes FOR SELECT
  USING (status = 'approved');

-- Authenticated users can submit nodes
CREATE POLICY "Authenticated users can submit nodes"
  ON public.knowledge_nodes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- Users can update their own pending nodes
CREATE POLICY "Users can update own pending nodes"
  ON public.knowledge_nodes FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by AND status = 'pending');

-- Anyone can read experiments for approved nodes
CREATE POLICY "Anyone can read experiments"
  ON public.experiments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.knowledge_nodes
    WHERE knowledge_nodes.id = experiments.node_id
    AND knowledge_nodes.status = 'approved'
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for knowledge_nodes
CREATE TRIGGER update_knowledge_nodes_updated_at
  BEFORE UPDATE ON public.knowledge_nodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_knowledge_nodes_stage ON public.knowledge_nodes(stage);
CREATE INDEX idx_knowledge_nodes_status ON public.knowledge_nodes(status);
CREATE INDEX idx_experiments_node_id ON public.experiments(node_id);
