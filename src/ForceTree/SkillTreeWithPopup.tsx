import React, { useEffect, useRef, useState } from "react";
import SkillTree from "@/ForceTree/SkillTree";
import Popup from "@/components/Popup";
import type { SkillNode } from "@/types/skill";

type Props = {
  data: SkillNode;
  onNodeClick?: (event: React.MouseEvent, node: SkillNode) => void;
};

export default function SkillTreeWithPopup({ data, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dims, setDims] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      const w = Math.round(width);
      const h = Math.round(height);

      setDims((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = window.setTimeout(() => {
      setPopupPos({ x, y });
      setPopupNode(node);
      setPopupVisible(false);
      requestAnimationFrame(() => setPopupVisible(true));
    }, 180);
  };

  const handleNodeHoverEnd = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setPopupVisible(false);
    window.setTimeout(() => {
      setPopupNode(null);
      setPopupPos(null);
    }, 200);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div className="hidden lg:flex absolute top-1/2 left-6 -translate-y-1/2 z-20 pointer-events-none ">
        <ul className="list-disc pl-6 text-sm md:text-lg rounded-lg p-3">
          <li><strong>Click</strong> a circle to explore an experience</li>
          <li><strong>Larger</strong> circles represent <strong>higher impact</strong> work</li>
        </ul>
      </div>
      {dims.width > 0 && dims.height > 0 && (
        <SkillTree
          data={data}
          dimensions={dims}
          onNodeHover={handleNodeHover}
          onNodeHoverEnd={handleNodeHoverEnd}
          {...(onNodeClick ? { onNodeClick } : {})}
        />
      )}

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