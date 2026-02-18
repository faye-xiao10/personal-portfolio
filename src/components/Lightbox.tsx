import React, { useEffect } from 'react'
import type { PortfolioItem } from "@/types/portfolio";

import { FaWindowClose } from "react-icons/fa";


type LightboxProps = {
    item: PortfolioItem | null;
    onClose: () => void;
}

const Lightbox = ({ item, onClose }: LightboxProps ) => {

    useEffect(()=> {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        // lock scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = item ? "hidden" : prev;
        
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prev;
        };
    }, [item, onClose]);

    if (!item) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onMouseDown={onClose}
        >
            <div className="relative w-full max-w-5xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <FaWindowClose className="absolute -top-3 -right-3" onClick={onClose} />
                <div className="overflow-hidden" >
                    <img
                        src={item.imgsrc}
                        alt={item.title}
                        className="max-h-[80vh] w-full object-contain"
                    />
                    <div className="border-t border-white/10 p-4">
                        <div className="text-white font-semibold"> {item.title} </div>
                        {item.subtitle && (
                            <div className="text-white/70 txt-sm"> {item.subtitle} </div>
                        )}
                    </div>
                </div>

                
            </div>
        
        </div>
    )
}

export default Lightbox
