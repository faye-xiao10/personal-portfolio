import React, { createContext, useContext, useEffect, useState } from 'react'
import  { supabase }from '@/lib/supabase' 
import type { SkillNode } from '@/types/skill'

type SkillTreeState = {
    treeData: SkillNode | null;
    loading: boolean;
    error: string | null;
    getNodeByPath: (relativePath: string) => SkillNode | undefined;

};

// A small slug fallback in case a node is missing `slug`.
function slugifyFallback(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
}


// Walk down the tree following path segments.
function findNodeByPath(root: SkillNode, relativePath: string): SkillNode | undefined {
    const clean = relativePath.trim();
  
    // "/faye" case → relativePath is ""
    if (!clean) return root;
  
    const segments = clean.split('/').filter(Boolean);
  
    let current: SkillNode | undefined = root;
  
    for (const seg of segments) {
        const children: SkillNode[] = current?.children ?? [];
        current = children.find((c) => (c.slug ?? slugifyFallback(c.name)) === seg);
  
      if (!current) return undefined;
    }
  
    return current;
  }
  

const SkillTreeContext = createContext<SkillTreeState | null>(null);

export const SkillTreeProvider: React.FC< {children: React.ReactNode }> = ({ children }) => {
    const [treeData, setTreeData] = useState<SkillNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTree = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Reach out to the Supabase table we created
                // In Supabase, 'data' is the column name. 
                // We tell TS that the result of this query is our SkillNode type.
                    const { data, error } = await supabase
                    .from('skilltree')
                    .select('data')
                    .single() // Get the one JSONB row we saved
                
                if (error) throw error;
                if (data && data.data) {
                    setTreeData((data.data as SkillNode) ?? null);
                }
            } catch (error) {
                setTreeData(null);
                setError("Failed to fetch skill tree.");
                console.error("Failed to fetch tree:", error);
            } finally {
                setLoading(false)
            }    
        };
        void fetchTree()
      }, [])

    const getNodeByPath = (relativePath: string): SkillNode | undefined => {
        if (!treeData) return undefined;
        return findNodeByPath(treeData, relativePath);
    };


    return (
       <SkillTreeContext.Provider value={{ treeData, loading, error, getNodeByPath }}>
            {children}
        </SkillTreeContext.Provider>
    );
};

export function useSkillTree(): SkillTreeState {
    const ctx = useContext(SkillTreeContext);
    if (!ctx) {
        throw new Error("useSkillTree must be used within a SkillTreeProvider");
    }
    return ctx;
}

export default SkillTreeContext


