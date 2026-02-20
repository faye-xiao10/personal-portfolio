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
		title: "Butterfly",
		subtitle: "Watercolor, Original Creation",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/butterfly.jpg"
	},

	{
		id: "4",
		title: "Totoro",
		subtitle: "Watercolor, Reproduction Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/totoro.jpg"
	},
	{
		id: "2",
		title: "Laser-Cannon Shark",
		subtitle: "Watercolor and Ink, Original Creation",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/lasersharkimg.jpg"
	},

	
	{
		id: "3",
		title: "Year of the Horse",
		subtitle: "Watercolor, Original Creation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/redstallion.jpg"
	},

	{
		id: "6",
		title: "Space Fisherman",
		subtitle: "Photoshop, Original Creation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/SpaceFisherman.jpg"
	},





	{
		id: "6",
		title: "Wired Tailed Swallow",
		subtitle: "Watercolor and Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/swallow.jpg"
	},
	
	{
		id: "1",
		title: "Longboarder",
		subtitle: "Watercolor and Ink, Original Creation",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/alexlongboard.jpg"
	},
	{
		id: "2",
		title: "Digital Wizard",
		subtitle: "Mixed Media, Original Creation",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/aiwizard.jpg"
	},

	
	{
		id: "3",
		title: "Galapagos Petrel",
		subtitle: "Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/birb.jpg"
	},
	
	{
		id: "5",
		title: "Black Panther",
		subtitle: "Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/blackpanther.jpg"
	},
	{
		id: "3",
		title: "Chameleon",
		subtitle: "Watercolor and Ink, Original Creation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/chameleon.jpg"
	},
	{
		id: "4",
		title: "Tumultuous Waves",
		subtitle: "Acrylic on Panel, Reproduction Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/beach.jpg"
	},






	{
		id: "6",
		title: "Bunny",
		subtitle: "Watercolor, Interpretive Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/bunny.jpg"
	},
	{
		id: "6",
		title: "Butterfly",
		subtitle: "Graphite Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/butterfly.png"
	},

	{
		id: "6",
		title: "Chinese Alligator",
		subtitle: "Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/croc.png"
	},
	{
		id: "5",
		title: "Yellowstone Bison",
		subtitle: "Oil on Canvas, Reproduction Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/yellowstone.jpg"
	},
	{
		id: "1",
		title: "Deer",
		subtitle: "Graphite Study",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/deer.png"
	},


	{
		id: "3",
		title: "Golden Eagle",
		subtitle: "Graphite Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/goldeneagle.png"
	},
	{
		id: "5",
		title: "Yellowstone Horse",
		subtitle: "Oil on Canvas, Reproduction Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/horsepainting.jpg"
	},






	
	{
		id: "1",
		title: "Winter Aurora",
		subtitle: "Oil on Canvas, Reproduction Study",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/icymountainpainting.jpg"
	},
	{
		id: "2",
		title: "Lion Cubs",
		subtitle: "Watercolor and Ink Interpretation",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/lions.jpg"
	},

	{
		id: "3",
		title: "Penguin Family",
		subtitle: "Watercolor and Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/penguins.jpg"
	},
	{
		id: "5",
		title: "Polar Plunge",
		subtitle: "Watercolor, Reproduction Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/polarbear.jpg"
	},





	{
		id: "6",
		title: "Araripe Manakin",
		subtitle: "Watercolor and Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/redbird.png"
	},
	{
		id: "4",
		title: "Crying Wolf",
		subtitle: "Oil on Canvas, Reproduction Study",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/wolfpainting.jpg"
	},
	{
		id: "1",
		title: "Sad Horse",
		subtitle: "Ink, Reproduction Study",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/sadhorse.jpg"
	},
	{
		id: "2",
		title: "Chinese Junker Ship",
		subtitle: "Oil on Canvas, Reproduction Study",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/shippainting.jpg"
	},

	{
		id: "4",
		title: "Skull Media",
		subtitle: "Watercolor and Ink, Original Creation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/skull.jpg"
	},
	{
		id: "3",
		title: "Deer",
		subtitle: "Ink, Original Creation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/stylizeddeer.jpg"
	},

	{
		id: "6",
		title: "Swiss Army Horse",
		subtitle: "Ink, Original Creation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/swisshorse.png"
	},
	{
		id: "1",
		title: "Sailflish",
		subtitle: "Ink Interpretation",
		description: "This is a description of project 1.",
		imgsrc: "/artPortfolio/swordfish.jpg"
	},
	{
		id: "2",
		title: "Toothless and Hiccup",
		subtitle: "Pixel Art Interpretation",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/toothless.png"
	},

	
	{
		id: "3",
		title: "Atlantic Bluefin Tuna",
		subtitle: "Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/tuna.jpg"
	},
	{
		id: "5",
		title: "Oriental Dwarf Kingfisher",
		subtitle: "Graphite Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/twigbirb.jpeg"
	},



	{
		id: "2",
		title: "Warrior",
		subtitle: "Ink, Reproduction Study",
		description: "This is a description of project 2.",
		imgsrc: "/artPortfolio/warrior.jpg"
	},

	
	{
		id: "3",
		title: "Ivory Billed Woodpecker",
		subtitle: "Ink Interpretation",
		description: "This is a description of project 3.",
		imgsrc: "/artPortfolio/woodpecker.png"
	},

	
	
	
]



const ArtPortfolioPage = ({ node }: Props) => {
	
	const [openItem, setOpenItem] = useState<(typeof ITEMS)[number] | null> (null);



	return (
		<div className="h-full w-full p-8 ">
			<h1 className="text-6xl font-opensans font-extrabold mb-2">{node.name}</h1>

			<div className="overflow-y-auto scrollbar-hide min-h-0 h-full w-full">
				<Gallery items={ITEMS} onOpen={(item) => setOpenItem(item)} />			
				<Lightbox item={openItem} onClose={() => setOpenItem(null)} />
			</div>
	
			
			
		</div>
	)
  }

export default ArtPortfolioPage
