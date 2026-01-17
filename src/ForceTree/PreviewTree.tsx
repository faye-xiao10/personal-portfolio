import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SkillNode } from "@/types/skill";

type SkillTreeProps = {
  data: SkillNode | null;
  dimensions: { width: number; height: number };
};

type NodeDatum = d3.HierarchyNode<SkillNode> & {
  x?: number;
  y?: number;
};

type LinkDatum = d3.HierarchyLink<SkillNode> & {
  source: NodeDatum;
  target: NodeDatum;
};

const PreviewTree: React.FC<SkillTreeProps> = ({ data, dimensions }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !dimensions.width || !dimensions.height) return;

    const { width, height } = dimensions;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3.hierarchy<SkillNode>(data) as unknown as NodeDatum;
    const nodes = root.descendants() as unknown as NodeDatum[];
    const links = root.links() as unknown as LinkDatum[];

    const simulation = d3
      .forceSimulation<NodeDatum>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(links)
          .distance(6)
          .strength(1)
      )
      .force("charge", d3.forceManyBody<NodeDatum>().strength(-40))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const g = svg.append("g");

    const link = g
      .append("g")
      .selectAll<SVGLineElement, LinkDatum>("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.7);

    const node = g
      .append("g")
      .selectAll<SVGCircleElement, NodeDatum>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => Math.max(2, 6 - d.depth * 1.8))
      .attr("fill", "#3b82f6");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x ?? 0)
        .attr("y1", (d) => d.source.y ?? 0)
        .attr("x2", (d) => d.target.x ?? 0)
        .attr("y2", (d) => d.target.y ?? 0);

      node
        .attr("cx", (d) => d.x ?? 0)
        .attr("cy", (d) => d.y ?? 0);
    });

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  return <svg ref={svgRef} className="w-full h-full bg-slate-50" />;
};

export default PreviewTree;
