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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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

    const evidenceLinks = node.evidence_links || [];
    
    if (evidenceLinks.length === 0) {
      // No evidence to validate
      await supabase
        .from("knowledge_nodes")
        .update({ credibility: 10, validation: 5 })
        .eq("id", nodeId);

      return new Response(JSON.stringify({ 
        credibility: 10, 
        validation: 5,
        analysis: "No evidence links provided. Score reflects lack of supporting documentation."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Lovable AI to analyze the evidence
    const prompt = `You are an evidence validation AI for a scientific knowledge platform. Analyze this submission:

Title: ${node.label}
Description: ${node.description}
Stage: ${node.stage}
Evidence Links: ${evidenceLinks.join(", ")}

Evaluate:
1. Credibility (0-100): How trustworthy are the sources? Consider domain authority, peer review status, recentness.
2. Validation (0-100): How well do the evidence links support the claims? Consider relevance, methodology quality, reproducibility.
3. Impact (0-100): Potential real-world impact if validated. Consider scale, urgency, feasibility.

Provide brief reasoning for each score.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a scientific evidence evaluator. Return structured scores and reasoning." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_validation_scores",
              description: "Submit the validation scores for the knowledge node",
              parameters: {
                type: "object",
                properties: {
                  credibility: { type: "number", minimum: 0, maximum: 100, description: "Source credibility score" },
                  validation: { type: "number", minimum: 0, maximum: 100, description: "Evidence validation score" },
                  impact: { type: "number", minimum: 0, maximum: 100, description: "Potential impact score" },
                  reasoning: { type: "string", description: "Brief explanation of the scores" },
                },
                required: ["credibility", "validation", "impact", "reasoning"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_validation_scores" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const scores = JSON.parse(toolCall.function.arguments);

    // Update the node with the scores
    await supabase
      .from("knowledge_nodes")
      .update({
        credibility: Math.round(scores.credibility),
        validation: Math.round(scores.validation),
        impact: Math.round(scores.impact),
      })
      .eq("id", nodeId);

    return new Response(JSON.stringify({
      credibility: Math.round(scores.credibility),
      validation: Math.round(scores.validation),
      impact: Math.round(scores.impact),
      analysis: scores.reasoning,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("validate-evidence error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
