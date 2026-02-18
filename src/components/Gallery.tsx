import React from 'react'
import type { PortfolioItem } from "@/types/portfolio";


type GalleryProps = {
	items: PortfolioItem[];
	onOpen: (item: PortfolioItem) => void;
}

  const Gallery = ({ items, onOpen }: GalleryProps) => {



	return (
		<div className="columns-2 md:columns-3 gap-2 [column-fill:_balance] ">
			{items.map((item) => (
				<button	
					key={item.id}
					onClick={()=>onOpen(item)}
					className="group mb-4 w-full break-inside-avoid overflow-hidden bg-amber-300 text-left"
				>
					<div className="relative">
						<img
							src={item.imgsrc}
							alt={item.title}
							loading="lazy"
							className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
						/>

						{/* Hover Overlay */}
						<div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"/>
						<div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<div className="text=white font-semibold"> {item.title} </div>
							{item.subtitle && (
								<div className="text-white/80 text-sm"> {item.subtitle} </div>
							)}
							{}
						</div>
					</div>
				</button>
			))}
			
		</div>
	)
  }

export default Gallery
