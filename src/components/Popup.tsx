// src/components/Popup.tsx
import React, { useEffect, useRef } from "react";
import type { SkillNode } from "@/types/skill";

type PopupProps = {
    x: number;
    y: number;
    nodeData: SkillNode;
    onClose: () => void;
    visible?: boolean;
};

const Popup: React.FC<PopupProps> = ({
    x,
    y,
    nodeData,
    onClose,
    visible = true,
  }) => {
  if (!nodeData) return null;

  // Keep your offsets (same idea as before)
  const yOffset = 50;
  const xOffset = -100;

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const el = popupRef.current;
      if (el && !el.contains(event.target as Node)) onClose();
    }

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  return (
    <div
  ref={popupRef}
  style={{ top: y + 50, left: x - 100 }}
  className={`
    absolute pointer-events-none
    bg-white border-3 border-gray-400
    rounded-lg w-56 min-h-40 p-3 gap-2
    flex flex-col justify-around z-50
    transition-all duration-200 ease-out
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
  `}
>
      <h2 className="font-bold text-xl">
        {nodeData.name || nodeData.slug || "Untitled Node"}
      </h2>

      <div
        className={[
          // .popup-reading equivalent
          "flex flex-col justify-between",
          "text-base",
          "rounded-lg",
          "min-h-16",
          "p-2",
        
        ].join(" ")}
      >
        <div>{nodeData.description}</div>
      </div>

    
    </div>
  );
};

export default Popup;
