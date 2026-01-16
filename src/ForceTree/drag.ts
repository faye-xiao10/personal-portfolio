import * as d3 from "d3";
import { SkillNode } from "@/types/skill";

/** * CRITICAL FIX: We extend d3.SimulationNodeDatum so that 
 * fx, fy, x, and y are officially recognized by TypeScript.
 */
export interface SkillNodeDatum extends d3.SimulationNodeDatum {
  data: SkillNode;
  depth: number; // Added to fix the depth error in SkillTree.tsx
  id?: string;
}

export default function drag(
  simulation: d3.Simulation<SkillNodeDatum, undefined>,
  getSize: () => { width: number; height: number }
) {
  function dragstarted(
    event: d3.D3DragEvent<SVGCircleElement, SkillNodeDatum, SkillNodeDatum>,
    d: SkillNodeDatum
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(
    event: d3.D3DragEvent<SVGCircleElement, SkillNodeDatum, SkillNodeDatum>,
    d: SkillNodeDatum
  ) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(
    event: d3.D3DragEvent<SVGCircleElement, SkillNodeDatum, SkillNodeDatum>,
    d: SkillNodeDatum
  ) {
    if (!event.active) simulation.alphaTarget(0);

    if (d.data.fixed) {
      d.fx = d.x;
      d.fy = d.y;

      const { width, height } = getSize();
      console.log(`Pin for ${d.data.name}:`, {
        x: Number(((d.x ?? 0) / width).toFixed(3)),
        y: Number(((d.y ?? 0) / height).toFixed(3)),
        relative: true
      });
    } else {
      d.fx = null;
      d.fy = null;
    }
  }

  return d3.drag<SVGCircleElement, SkillNodeDatum>()
    .filter(event => event.button === 0 && !event.altKey)
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}