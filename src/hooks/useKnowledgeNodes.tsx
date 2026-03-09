import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type KnowledgeNode = Tables<"knowledge_nodes">;
export type Experiment = Tables<"experiments">;

export interface NodeEdge {
  id: string;
  from_node_id: string;
  to_node_id: string;
  relationship_type: string;
  strength: number;
  created_at: string;
}

export const useKnowledgeNodes = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["knowledge_nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_nodes")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as KnowledgeNode[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("knowledge_nodes_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "knowledge_nodes" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useAllKnowledgeNodes = () => {
  return useQuery({
    queryKey: ["knowledge_nodes_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_nodes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as KnowledgeNode[];
    },
  });
};

export const useNodeEdges = () => {
  return useQuery({
    queryKey: ["node_edges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("node_edges")
        .select("*");
      if (error) throw error;
      return data as NodeEdge[];
    },
  });
};

export const useNodeExperiments = (nodeId: string | null) => {
  return useQuery({
    queryKey: ["experiments", nodeId],
    queryFn: async () => {
      if (!nodeId) return [];
      const { data, error } = await supabase
        .from("experiments")
        .select("*")
        .eq("node_id", nodeId);
      if (error) throw error;
      return data as Experiment[];
    },
    enabled: !!nodeId,
  });
};

export const useSubmitNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (node: {
      label: string;
      description: string;
      stage: "theory" | "pilot" | "validated" | "global";
      evidence_links: string[];
      submitted_by: string;
    }) => {
      const { data, error } = await supabase
        .from("knowledge_nodes")
        .insert({
          label: node.label,
          description: node.description,
          stage: node.stage,
          evidence_links: node.evidence_links,
          submitted_by: node.submitted_by,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
    },
  });
};

export const useUpdateNodeStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("knowledge_nodes")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes_all"] });
    },
  });
};

export const useUpdateNodeScores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, credibility, validation, impact }: { 
      id: string; 
      credibility?: number;
      validation?: number;
      impact?: number;
    }) => {
      const updates: Record<string, number> = {};
      if (credibility !== undefined) updates.credibility = credibility;
      if (validation !== undefined) updates.validation = validation;
      if (impact !== undefined) updates.impact = impact;
      
      const { data, error } = await supabase
        .from("knowledge_nodes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes_all"] });
    },
  });
};

export const useUpdateNodeStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: "theory" | "pilot" | "validated" | "global" }) => {
      const { data, error } = await supabase
        .from("knowledge_nodes")
        .update({ stage })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes_all"] });
    },
  });
};

export const useCreateEdge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ from_node_id, to_node_id, relationship_type, strength }: {
      from_node_id: string;
      to_node_id: string;
      relationship_type?: string;
      strength?: number;
    }) => {
      const { data, error } = await supabase
        .from("node_edges")
        .insert({
          from_node_id,
          to_node_id,
          relationship_type: relationship_type || "related",
          strength: strength || 50,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["node_edges"] });
    },
  });
};

export const useDeleteEdge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("node_edges")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["node_edges"] });
    },
  });
};

export const useCreateExperiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ node_id, title, location, status }: {
      node_id: string;
      title: string;
      location?: string;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("experiments")
        .insert({
          node_id,
          title,
          location: location || "",
          status: status || "ongoing",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["experiments", vars.node_id] });
    },
  });
};

export const useUserRole = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user_role", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data?.role ?? null;
    },
    enabled: !!userId,
  });
};

export const useValidateEvidence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nodeId: string) => {
      const { data, error } = await supabase.functions.invoke("validate-evidence", {
        body: { nodeId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes_all"] });
    },
  });
};

export const useCalculateImpact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nodeId: string) => {
      const { data, error } = await supabase.functions.invoke("calculate-impact", {
        body: { nodeId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes"] });
      queryClient.invalidateQueries({ queryKey: ["knowledge_nodes_all"] });
    },
  });
};
