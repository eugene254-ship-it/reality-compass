import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const { nodeId } = await req.json();
    if (!nodeId) {
      return new Response(JSON.stringify({ error: "nodeId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch the node
    const { data: node, error: nodeError } = await supabase
      .from("knowledge_nodes")
      .select("*")
      .eq("id", nodeId)
      .single();

    if (nodeError || !node) {
      return new Response(JSON.stringify({ error: "Node not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch related experiments
    const { data: experiments } = await supabase
      .from("experiments")
      .select("*")
      .eq("node_id", nodeId);

    const experimentCount = experiments?.length || 0;
    const completedExperiments = experiments?.filter(e => e.status === "completed").length || 0;
    const ongoingExperiments = experiments?.filter(e => e.status === "ongoing").length || 0;

    // Fetch edge connections (influence)
    const { data: edges } = await supabase
      .from("node_edges")
      .select("*")
      .or(`from_node_id.eq.${nodeId},to_node_id.eq.${nodeId}`);

    const connectionCount = edges?.length || 0;

    // Calculate composite impact score
    const evidenceCount = node.evidence_links?.length || 0;
    const baseCredibility = node.credibility || 0;
    const baseValidation = node.validation || 0;

    // Stage multiplier
    const stageMultiplier: Record<string, number> = {
      theory: 0.5,
      pilot: 0.75,
      validated: 1.0,
      global: 1.25,
    };

    const stageMult = stageMultiplier[node.stage] || 0.5;

    // Impact formula:
    // - Base: average of credibility and validation
    // - Evidence bonus: +2 per evidence link (max +20)
    // - Experiment bonus: +5 per completed experiment, +2 per ongoing
    // - Connection bonus: +3 per edge connection (max +15)
    // - Stage multiplier applied at the end

    let impactScore = (baseCredibility + baseValidation) / 2;
    impactScore += Math.min(evidenceCount * 2, 20);
    impactScore += completedExperiments * 5 + ongoingExperiments * 2;
    impactScore += Math.min(connectionCount * 3, 15);
    impactScore = Math.round(impactScore * stageMult);
    impactScore = Math.min(Math.max(impactScore, 0), 100);

    // Update the node
    await supabase
      .from("knowledge_nodes")
      .update({ impact: impactScore })
      .eq("id", nodeId);

    return new Response(JSON.stringify({
      impact: impactScore,
      breakdown: {
        baseScore: Math.round((baseCredibility + baseValidation) / 2),
        evidenceBonus: Math.min(evidenceCount * 2, 20),
        experimentBonus: completedExperiments * 5 + ongoingExperiments * 2,
        connectionBonus: Math.min(connectionCount * 3, 15),
        stageMultiplier: stageMult,
        experimentCount,
        completedExperiments,
        connectionCount,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("calculate-impact error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
