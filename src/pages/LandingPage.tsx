import React from 'react'
import SkillTree from '@/ForceTree/SkillTree'
import { useSkillTree } from '@/contexts/SkillTreeContext';


const LandingPage: React.FC = () => {
	const { treeData, loading, error } = useSkillTree();
    return (
      <div className="w-full h-full flex flex-col bg-slate-50">
		<div className="p-12">
			<h1 className="font-extrabold font-opensans text-5xl mb-6"> 
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
