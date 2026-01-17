import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SkillNode } from "@/types/skill";
import type { SkillNodeRow } from "@/types/db";
import { buildTreeFromRows } from "@/lib/skillNodes/buildTreeFromRows";

type SkillTreeState = {
  treeData: SkillNode | null;
  loading: boolean;
  error: string | null;
  getNodeByPath: (relativePath: string) => SkillNode | undefined;
};

function normalizePath(path: string): string {
  return path.trim().replace(/^\/+|\/+$/g, "");
}

const SkillTreeContext = createContext<SkillTreeState | null>(null);

export const SkillTreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [treeData, setTreeData] = useState<SkillNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeBySlug, setNodeBySlug] = useState<Map<string, SkillNode>>(new Map());

  useEffect(() => {
    const fetchTree = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from("skill_nodes").select("*");
        if (error) throw error;

        const rows = (data ?? []) as SkillNodeRow[];
        const built = buildTreeFromRows(rows);
        setTreeData(built);

        const map = new Map<string, SkillNode>();
        if (built) {
          const stack: SkillNode[] = [built];
          while (stack.length) {
            const n = stack.pop()!;
            map.set(n.slug ?? "", n);
            for (const c of n.children ?? []) stack.push(c);
          }
        }
        setNodeBySlug(map);

        console.log("RAW ROWS:", (data ?? []).map(r => ({
            slug: r.slug,
            parent_slug: r.parent_slug,
            parent_slug_type: typeof r.parent_slug,
          })));
      } catch (err) {
        setTreeData(null);
        setNodeBySlug(new Map());
        setError("Failed to fetch skill tree.");
        console.error("Failed to fetch tree:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchTree();
  }, []);

  const getNodeByPath = (relativePath: string): SkillNode | undefined => {
    const key = normalizePath(relativePath);
    return nodeBySlug.get(key);
  };

  return (
    <SkillTreeContext.Provider value={{ treeData, loading, error, getNodeByPath }}>
      {children}
    </SkillTreeContext.Provider>
  );
};

export function useSkillTree(): SkillTreeState {
  const ctx = useContext(SkillTreeContext);
  if (!ctx) throw new Error("useSkillTree must be used within a SkillTreeProvider");
  return ctx;
}

export default SkillTreeContext;
