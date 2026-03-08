
-- Fix RLS policies: change from RESTRICTIVE to PERMISSIVE

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can read approved nodes" ON public.knowledge_nodes;
DROP POLICY IF EXISTS "Authenticated users can submit nodes" ON public.knowledge_nodes;
DROP POLICY IF EXISTS "Users can update own pending nodes" ON public.knowledge_nodes;
DROP POLICY IF EXISTS "Anyone can read experiments" ON public.experiments;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can read approved nodes"
ON public.knowledge_nodes FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Authenticated users can submit nodes"
ON public.knowledge_nodes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update own pending nodes"
ON public.knowledge_nodes FOR UPDATE
TO authenticated
USING (auth.uid() = submitted_by AND status = 'pending');

CREATE POLICY "Anyone can read experiments"
ON public.experiments FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM knowledge_nodes
  WHERE knowledge_nodes.id = experiments.node_id
  AND knowledge_nodes.status = 'approved'
));

-- Allow authenticated users to insert experiments for their own nodes
CREATE POLICY "Authenticated users can insert experiments"
ON public.experiments FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM knowledge_nodes
  WHERE knowledge_nodes.id = experiments.node_id
  AND knowledge_nodes.submitted_by = auth.uid()
));
