import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import drag, { SkillNodeDatum } from './drag'; // Import the type we made in the last step
import { SkillNode } from '@/types/skill';
import { attatchInteractions } from "./interactions";


// 1. Define the Props Interface
interface SkillTreeProps {
  data: SkillNode | null;
  dimensions: { width: number; height: number };
  onNodeClick?: (event: React.MouseEvent, data: SkillNode) => void;
  onNodeHover?: (event: React.MouseEvent, data: SkillNode) => void;
  onNodeHoverEnd?: () => void;
}

// 2. Define the Link Type for D3
interface SkillLinkDatum extends d3.SimulationLinkDatum<SkillNodeDatum> {
  source: SkillNodeDatum;
  target: SkillNodeDatum;
}

const SkillTree: React.FC<SkillTreeProps> = ({
    data,
    dimensions,
    onNodeClick,
    onNodeHover,
    onNodeHoverEnd,
  }) => {
    useEffect(() => {
    console.log("SkillTree effect mount");
    
    return () => console.log("SkillTree effect cleanup");
  }, []);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<SkillNodeDatum, undefined> | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !dimensions.width) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    // 3. Hierarchy & Data Transformation
    // We cast the hierarchy to our SkillNodeDatum to ensure D3 properties are tracked
    const root = d3.hierarchy(data) as unknown as d3.HierarchyNode<SkillNodeDatum>;
    const links = root.links() as unknown as SkillLinkDatum[];
    const nodes = root.descendants() as unknown as SkillNodeDatum[];
    nodes.forEach((n, i) => {
      n.id = n.data.slug ?? n.data.name ?? String(i);
    });

    // BASE COLORS 
    const DARK_BLUE = "#2081bd";   
    const LIGHT_BLUE = "#74d4fc";  
    const colorScale = d3.interpolateHcl(LIGHT_BLUE, DARK_BLUE);

    console.log(
      "D3 nodes after hierarchy:",
      nodes.map(n => ({
        name: n.data.name,
        slug: n.data.slug,
        depth: n.depth,
        fixed: n.data.fixed,
        pin: n.data.pin,
        x: n.x,
        y: n.y,
      }))
    );

    // 4. Pinning Logic (The "Founder" System Logic)
    nodes.forEach(n => {
      const pin = n.data.pin;
      if (n.data.fixed && pin) {
        n.fx = pin.relative ? pin.x * width : pin.x;
        n.fy = pin.relative ? pin.y * height : pin.y;
      }
    });

    // 5. Physics Simulation
    const simulation = d3.forceSimulation<SkillNodeDatum>(nodes)
      .force("link", d3.forceLink<SkillNodeDatum, SkillLinkDatum>(links)
      .id(d => d.id)
      .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulationRef.current = simulation;

    const g = svg.append("g"); 

    // 6. Visualization Layers
    const link = g.append("g")
      .selectAll<SVGLineElement, SkillLinkDatum>("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 1);

    const node = g.append("g")
      .selectAll<SVGCircleElement, SkillNodeDatum>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => (d.data.size || 20) - d.depth * 2)
      .attr("fill", d => colorScale(1 - d.depth * 0.6))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(drag(simulation, () => ({ width, height })) as any)      
      .on("mouseenter", (e, d) => {
        onNodeHover?.(e as unknown as React.MouseEvent, d.data);
      })
      .on("mouseleave", () => {
        onNodeHoverEnd?.();
      })
      .on("click", (e, d) => {
        onNodeClick?.(e as unknown as React.MouseEvent, d.data);
      });
      const radius = (d: SkillNodeDatum) => (d.data.size || 20) - d.depth * 2;

      // Bigger near root, smaller as depth increases (clamped so it doesn’t get silly)
      const fontSizePx = (d: SkillNodeDatum) =>Math.max(10, 26 * Math.pow(0.7, d.depth));
      const labelDy = (d: SkillNodeDatum) => radius(d) + 10 + Math.max(0, 10 - d.depth * 2); 
      
      const label = g.append("g")
        .selectAll<SVGTextElement, SkillNodeDatum>("text")
        .data(nodes)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("dy", d => labelDy(d))
        .attr("font-size", d => `${fontSizePx(d)}px`)
        .text(d => d.data.name)
        .attr("class", "font-bold fill-gray-700 pointer-events-none")
        .style("paint-order", "stroke")
        .style("stroke", "#fff")
        .style("stroke-width", "3px");
      

    // attach interactions
    attatchInteractions({
      node,
      label,
      link: link as any,
      linksData: links as any,
      fadedOpacity: 0.4,
      getRadius: (d) => (d.data.size || 20) - d.depth * 2,
    });


    // 7. Tick Handler (The Animation loop)
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x ?? 0)
        .attr("y1", d => d.source.y ?? 0)
        .attr("x2", d => d.target.x ?? 0)
        .attr("y2", d => d.target.y ?? 0);

      node
        .attr("cx", d => d.x ?? 0)
        .attr("cy", d => d.y ?? 0);

      label
        .attr("x", d => d.x ?? 0)
        .attr("y", d => d.y ?? 0);
    });

    // Zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>().on("zoom", (e) => {
      g.attr("transform", e.transform);
    }));

    // Cleanup on unmount
    return () => {
      simulation.stop();
      svg.on(".zoom", null); // remove zoom listeners
    };
  }, [data, dimensions, onNodeClick]);

  return <svg ref={svgRef} className="w-full h-full bg-slate-50" />;
};

export default SkillTree;