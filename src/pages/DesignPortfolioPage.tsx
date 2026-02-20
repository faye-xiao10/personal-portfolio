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
		title: "Photoshop Summer Course Poster",
		subtitle: "Designed by me using Photoshop for a summer course I taught.",
		description: "This is a description of project 1.",
		imgsrc: "/designPortfolio/photoshopposter.png"
	},
	
	{
		id: "2",
		title: "RC Plane Poster",
		subtitle: "Designed by me using Photoshop for a planned course.",
		description: "This is a description of project 2.",
		imgsrc: "/designPortfolio/rcplanecourse.png"
	},
	{
		id: "1",
		title: "Comerica Innovation Center Promo",
		subtitle: "Designed by me using Photoshop for a promotional campaign for the Comerica Innovation Center.",
		description: "This is a description of project 1.",
		imgsrc: "/designPortfolio/comericaPurpleExplore.png"
	},
	{
		id: "2",
		title: "Ross Artifact",
		subtitle: "Designed by me using Photoshop, consisting of a gallery of student work from my Photoshop Summer Coruse.",
		description: "This is a description of project 2.",
		imgsrc: "/designPortfolio/rossartifact.png"
	},
	
	{
		id: "2",
		title: "AWS Poster",
		subtitle: "Designed by me in Canva for Comerica",
		description: "This is a description of project 2.",
		imgsrc: "/designPortfolio/awsposter.png"
	},
	{
		id: "3",
		title: "Comerica Explore",
		subtitle: "Designed by me in Photoshop, part of a series of 8 cards for the Comerica Innovation Center.",
		description: "This is a description of project 3.",
		imgsrc: "/designPortfolio/comericaSmallExplore.png"
	},
	{
		id: "3",
		title: "Innovation Portal",
		subtitle: "Designed by me in Photoshop to promote Comerica's internal Innovation Portal.",
		description: "This is a description of project 3.",
		imgsrc: "/designPortfolio/innovationportal.png"
	},
	{
		id: "3",
		title: "Graphic",
		subtitle: "A graphic for Comerica's Website, designed by me in Photoshop.",
		description: "This is a description of project 3.",
		imgsrc: "/designPortfolio/graphic.png"
	},
	

	{
		id: "2",
		title: "MyEarthly Homepage",
		subtitle: "Designed by me in Figma for MyEarthly, a sustainability-focused startup.",
		description: "This is a description of project 2.",
		imgsrc: "/designPortfolio/myearthlyhomepage.jpg"
	},
	{
		id: "3",
		title: "MyEarthly Materials Page",
		subtitle: "Designed by me in Figma for MyEarthly, a sustainability-focused startup.",
		description: "This is a description of project 3.",
		imgsrc: "/designPortfolio/myearthlymaterials.png"
	},
	{
		id: "2",
		title: "MyEarthly Comparison Page",
		subtitle: "Designed by me in Figma for MyEarthly, a sustainability-focused startup. This page allows users to compare the sustainability of different products side by side via the radial chart.",
		description: "This is a description of project 2.",
		imgsrc: "/designPortfolio/myearthlycomparison.png"
	},
	{
		id: "3",
		title: "MyEarthly Search Page",
		subtitle: "Designed by me in Figma for MyEarthly, a sustainability-focused startup.",
		description: "This is a description of project 3.",
		imgsrc: "/designPortfolio/myearthlysearch.png"
	},




	{
		id: "1",
		title: "EagleView Medical About Page",
		subtitle: "Lead UI/UX Designer for the redesign of the EagleView Medical website, designed by me in Photoshop. (About page sample)",
		description: "This is a description of project 1.",
		imgsrc: "/designPortfolio/eagleviewAbout.jpg"
	},
	{
		id: "3",
		title: "EagleView Medical Product Page",
		subtitle: "Lead UI/UX Designer for the redesign of the EagleView Medical website, designed by me in Photoshop. (Product Page page sample)",
		description: "This is a description of project 3.",
		imgsrc: "/designPortfolio/productPage.jpg"
	},

	
]



const DesignPortfolioPage = ({ node }: Props) => {
	
	const [openItem, setOpenItem] = useState<(typeof ITEMS)[number] | null> (null);



	return (
		<div className="h-full w-full p-8 ">
			<h1 className="text-6xl font-opensans font-extrabold mb-2">{node.name}</h1>

			<h3> Take a look at some of my design work. </h3>

			<div className="overflow-y-auto scrollbar-hide min-h-0 h-full w-full">
				<Gallery items={ITEMS} onOpen={(item) => setOpenItem(item)} />			
				<Lightbox item={openItem} onClose={() => setOpenItem(null)} />
			</div>
	
			
			
		</div>
	)
  }

export default DesignPortfolioPage
