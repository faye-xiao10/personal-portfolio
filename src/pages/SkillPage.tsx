import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SkillNode } from '@/types/skill';


const SkillPage: React.FC = () => {
	const navigate = useNavigate();

	const handleNodeClick = (event: React.MouseEvent, nodeData: SkillNode) => {
		const slug = nodeData.name.toLowerCase().replace(/\s+/g, '-');
		navigate(`/skill/${slug}`)
	};
	return (
		<div className="flex h-screen">
			
		
		</div>
	)
}

export default SkillPage
