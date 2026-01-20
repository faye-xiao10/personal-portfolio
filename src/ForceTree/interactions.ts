import * as d3 from "d3";
import type { SkillNodeDatum } from "./drag";

export type HoverLinkDatum = {
  source: SkillNodeDatum;
  target: SkillNodeDatum;
};

export function attatchInteractions(opts: {
  node: d3.Selection<SVGCircleElement, SkillNodeDatum, SVGGElement, unknown>;
  label: d3.Selection<SVGTextElement, SkillNodeDatum, SVGGElement, unknown>;
  link: d3.Selection<SVGLineElement, HoverLinkDatum, SVGGElement, unknown>;
  linksData: HoverLinkDatum[];
  fadedOpacity?: number;
  getRadius?: (d: SkillNodeDatum) => number;
}) {
  const {
    node,
    label,
    link,
    linksData,
    fadedOpacity = 0.5,
    getRadius = (d) => (d.data.size || 20) - d.depth * 2,
  } = opts;

  /* ---------------- adjacency ---------------- */

  const adjacent = new Set<string>();
  for (const l of linksData) {
    adjacent.add(`${l.source.id}|${l.target.id}`);
    adjacent.add(`${l.target.id}|${l.source.id}`);
  }

  const isNeighbor = (a: SkillNodeDatum, b: SkillNodeDatum) =>
    a.id === b.id || adjacent.has(`${a.id}|${b.id}`);

  /* ---------------- constants ---------------- */

  const DURATION = 320;
  const SPOT = "spotlight";

  /* ---------------- cache base fill (once) ---------------- */

  node.each(function () {
    const el = this as SVGCircleElement;
    if (!el.hasAttribute("data-base-fill")) {
      el.setAttribute("data-base-fill", el.getAttribute("fill") ?? "#2081bd");
    }
  });

  /* ---------------- halo filter ---------------- */

  const glowId = "skilltree-glow";
  const svgEl = node.node()?.ownerSVGElement;

  if (svgEl) {
    const svg = d3.select(svgEl);
    const defs = svg.selectAll("defs").data([null]).join("defs");

    const filter = defs
      .selectAll<SVGFilterElement, null>(`filter#${glowId}`)
      .data([null])
      .join("filter")
      .attr("id", glowId)
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter.selectAll("*").remove();

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceGraphic")
      .attr("stdDeviation", 4)
      .attr("result", "blur");

    filter.append("feMerge").call((merge) => {
      merge.append("feMergeNode").attr("in", "blur");
      merge.append("feMergeNode").attr("in", "SourceGraphic");
    });
  }

  /* ---------------- halo pulse ---------------- */

  function startHaloPulse(
	hovered: d3.Selection<SVGCircleElement, SkillNodeDatum, any, any>
  ) {
	const el = hovered.node();
	if (!el || el.getAttribute("data-hovered") !== "true") return;
  
	const r0 = getRadius(hovered.datum());
  
	hovered
	  .attr("filter", `url(#${glowId})`)
	  .attr("r", r0)
	  .transition()
	  .duration(700)
	  .ease(d3.easeCubicInOut)
	  .attr("r", r0 * 1.3)
	  .transition()
	  .duration(700)
	  .ease(d3.easeCubicInOut)
	  .attr("r", r0)
	  .on("end", () => {
		if (el.getAttribute("data-hovered") === "true") {
		  startHaloPulse(hovered);
		}
	  });
  }
  
  function stopHaloPulse(
	hovered: d3.Selection<SVGCircleElement, SkillNodeDatum, any, any>
  ) {
	const r0 = getRadius(hovered.datum());
  
	hovered
	  .interrupt()
	  .transition()
	  .duration(200)
	  .ease(d3.easeCubicOut)
	  .attr("r", r0)
	  .on("end", () => hovered.attr("filter", null));
  }

  /* ---------------- declarative spotlight ---------------- */

  function applySpotlight(focus: SkillNodeDatum | null) {
	const isActive = (n: SkillNodeDatum) =>
	  !focus || isNeighbor(focus, n);
  
	// Nodes: opacity + fill in ONE transition
	node
	  .transition(SPOT)
	  .duration(DURATION)
	  .ease(d3.easeCubicInOut)
	  .style("opacity", n => (isActive(n) ? 1 : fadedOpacity))
	  .attr("fill", function (n) {
		const base = this.getAttribute("data-base-fill")!;
  
		if (!focus || n.id !== focus.id) {
		  return base; // always restore base fill smoothly
		}
  
		return d3.color(base)!.brighter(0.35).toString();
	  });
  
	// Labels
	label
	  .transition(SPOT)
	  .duration(DURATION)
	  .ease(d3.easeCubicInOut)
	  .style("opacity", n => (isActive(n) ? 1 : fadedOpacity));
  
	// Links
	link
	  .transition(SPOT)
	  .duration(DURATION)
	  .ease(d3.easeCubicInOut)
	  .attr("stroke-opacity", l =>
		!focus || l.source.id === focus.id || l.target.id === focus.id
		  ? 1
		  : 0.25
	  )
	  .attr("stroke-width", l =>
		focus && (l.source.id === focus.id || l.target.id === focus.id)
		  ? 2.5
		  : 1
	  );
  }
  

  /* ---------------- event handlers ---------------- */

  node
    .on("mouseenter.hover", function (_event, d) {
		this.setAttribute("data-hovered", "true");
		applySpotlight(d);
		startHaloPulse(d3.select(this));
    })
    .on("mouseleave.hover", function () {
		this.removeAttribute("data-hovered");
		applySpotlight(null);
		stopHaloPulse(d3.select(this));
    });
}
