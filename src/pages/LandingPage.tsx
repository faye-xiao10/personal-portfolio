import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase' // Import the agent
import SkillTree from '@/ForceTree/SkillTree'
import dummyData from '@/data/dummy.json'
import { SkillNode } from '@/types/skill'

const LandingPage: React.FC = () => {

    const [treeData, setTreeData] = useState<SkillNode | null>(null)
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const fetchTree = async () => {
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
				// type casting "as SkillNode" tells TS "i trust this json matches my interface"
				setTreeData(data.data as SkillNode)
			}
		} catch (error) {
			console.error("Failed to fetch tree:", error)
		} finally {
			setLoading(false)
		}    
	}
      fetchTree()
    }, [])

  
    if (loading) return <div className="p-20 text-center">Loading your Identity Nexus...</div>
    return (
      <div className="w-full h-full flex flex-col bg-slate-50">
		<div className="p-12">
			<h1 className="font-extrabold text-5xl mb-6"> 
			Hi,  I'm Faye!
			</h1>

		</div>
      
        
        {/* Container to give the SVG space to breathe */}
		<div className="w-full flex-1 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
		{
				treeData ? (
					<SkillTree 
						data={treeData} 
						dimensions={{ width: 800, height: 600 }} 
						onNodeClick={(e, d) => console.log("Explored:", d.name)}
					/>

			) : (
				<div className="flex items-center justify-center h-full">
					<p className="text-gray-400">No data found in the archive.</p>
				</div>
			)}
         
        </div>
      </div>
    )
  }
  
  export default LandingPage
