import React from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SkillTree from '@/ForceTree/SkillTree'
import { useSkillTree } from '@/contexts/SkillTreeContext';
import type { SkillNode } from "@/types/skill";
import SkillNodePage from "@/pages/SkillNodePage";






const RootRouterPage: React.FC = () => {
	const { treeData, loading, error, getNodeByPath } = useSkillTree();
	const location = useLocation();
	const navigate = useNavigate();
	const splat = useParams()["*"] ?? ""; // everything after "/"


	if (loading) return <div className="p-8">Loading...</div>;
	if (error) return <div className="p-8 text-red-600">{error}</div>;
	if (!treeData) return <div className="p-8">No tree data.</div>;

	// case 1: /faye/ root node, show tree
	if (splat.trim() === "") {
		const onNodeClick = (_e: React.MouseEvent, node: SkillNode) => {
			if (!node.slug) return;
			// if you allow clicking root, make its slug empty or handle it here
			navigate(`/${node.slug}`);
		};

			return (
				<div className="w-full h-full flex flex-col bg-slate-50">
				<div className="p-12">
					<h1 className="font-extrabold font-opensans text-5xl mb-6"> 
					Hi,  I'm Faye!
					</h1>
				</div>
				
				<div className="w-full flex-1 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
				
		
					<SkillTree 
						data={treeData} 
						dimensions={{ width: 1200, height: 600 }} 
						onNodeClick={(e, d) => console.log("Explored:", d.slug)}
					/>
					</div>
				</div>
			);
	}		

	// case 2: /faye/... show content
	const node = getNodeByPath(splat);
	if (!node) {
	  return (
		<div className="p-8">
		  <h1 className="text-xl font-bold">Not found</h1>
		  <p className="text-gray-600">/{splat}</p>
		</div>
	  );
	}
  
	return <SkillNodePage node={node} path={splat} />;
};

export default RootRouterPage;