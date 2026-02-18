import React, { useState } from 'react'
import type { PortfolioItem } from "@/types/portfolio";
import type { SkillNode } from "@/types/skill";
import Gallery from "@/components/Gallery";
import Lightbox from "@/components/Lightbox";


type Props = {
	node: SkillNode;
  };

const ITEMS: PortfolioItem[] = [
	{
		id: "1",
		title: "Project 1ASDF",
		subtitle: "A cool project",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/artLogo.png"
	},
	{
		id: "2",
		title: "Project 2",
		subtitle: "Another cool project",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/lasersharkimg.jpg"
	},
	{
		id: "3",
		title: "Project 3",
		subtitle: "Yet another cool project",
		description: "This is a description of project 3.",
		imgsrc: "https://via.placeholder.com/600x400?text=Project+3"
	},
	{
		id: "3",
		title: "Project 3",
		subtitle: "Yet another cool project",
		description: "This is a description of project 3.",
		imgsrc: "https://via.placeholder.com/600x400?text=Project+3"
	},
	{
		id: "3",
		title: "Project 3",
		subtitle: "Yet another cool project",
		description: "This is a description of project 3.",
		imgsrc: "https://via.placeholder.com/600x400?text=Project+3"
	},
	
	
]



const ArtPortfolioPage = ({ node }: Props) => {
	
	const [openItem, setOpenItem] = useState<(typeof ITEMS)[number] | null> (null);



	return (
		<div className="mx-auto max-w-6xl p-6 ">
			<h1 className="text-6xl font-opensans font-extrabold mb-2">{node.name}</h1>
	
			
			<Gallery items={ITEMS} onOpen={(item) => setOpenItem(item)} />			
			<Lightbox item={openItem} onClose={() => setOpenItem(null)} />
		</div>
	)
  }

export default ArtPortfolioPage
