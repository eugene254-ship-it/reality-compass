import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type KnowledgeNode = Tables<"knowledge_nodes">;
export type Experiment = Tables<"experiments">;

export const useKnowledgeNodes = () => {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
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

  return useQuery({
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
