import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SkillNode } from '@/types/skill';

type SkillPageProps = {
	node: SkillNode;
	path: string; // e.g. "hobbies/art"
  };


const SkillNodePage: React.FC<SkillPageProps> = ({ node, path }) => {
	const navigate = useNavigate();

	const handleNodeClick = ( child: SkillNode ) => {
		navigate(`/${child.slug}`);
	};
	return (
		<div className="flex h-screen">
			<h2> {node.name}</h2>
			
		
		</div>
	)
}

export default SkillNodePage
