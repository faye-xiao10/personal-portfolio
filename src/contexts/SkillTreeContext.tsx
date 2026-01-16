import React, { createContext, useContext, useEffect, useState } from 'react'
import  { supabase }from '@/lib/supabase' 
import type { SkillNode } from '@/types/skill'

type SkillTreeState = {
    treeData: SkillNode | null;
    loading: boolean;
    error: string | null;
};

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



    return (
       <SkillTreeContext.Provider value={{ treeData, loading, error }}>
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
