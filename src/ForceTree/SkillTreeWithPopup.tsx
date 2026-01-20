import React, { useRef, useState } from "react";
import SkillTree from "@/ForceTree/SkillTree";
import Popup from "@/components/Popup";
import type { SkillNode } from "@/types/skill";

type Props = {
  data: SkillNode;
  dimensions: { width: number; height: number };
  onNodeClick?: (event: React.MouseEvent, node: SkillNode) => void;
};

export default function SkillTreeWithPopup({ data, dimensions, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [popupNode, setPopupNode] = useState<SkillNode | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);



  const handleNodeHover = (event: React.MouseEvent, node: SkillNode) => {
    const container = containerRef.current;
    if (!container) return;
  
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    // clear any previous hover delay
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  
    hoverTimeoutRef.current = window.setTimeout(() => {
      setPopupPos({ x, y });
      setPopupNode(node);
    
      // mount hidden first so fade-in can animate
      setPopupVisible(false);
    
      // next frame: flip to visible -> triggers transition
      requestAnimationFrame(() => {
        setPopupVisible(true);
      });
    }, 180);
  };
  

  const handleNodeHoverEnd = () => {
    // cancel any delayed show
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  
    // start fade-out
    setPopupVisible(false);
  
    // unmount AFTER transition finishes
    window.setTimeout(() => {
      setPopupNode(null);
      setPopupPos(null);
    }, 200); // must match Popup transition duration
  };
  

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <SkillTree
        data={data}
        dimensions={dimensions}
        onNodeHover={handleNodeHover}
        onNodeHoverEnd={handleNodeHoverEnd}
        {...(onNodeClick ? { onNodeClick } : {})}
        />
      {popupPos && popupNode && (
        <Popup
          x={popupPos.x}
          y={popupPos.y}
          nodeData={popupNode}
          onClose={handleNodeHoverEnd}
          visible={popupVisible}
        />
      )}
    </div>
  );
}
