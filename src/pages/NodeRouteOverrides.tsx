import React from "react";
import type { SkillNode } from "@/types/skill";
import ResumePage from "@/pages/ResumePage";
import ArtPortfolioPage from "@/pages/ArtPortfolioPage";
import DesignPortfolioPage from "@/pages/DesignPortfolioPage";


type Override = (args: { node: SkillNode; path: string }) => React.ReactNode;

// key = exact splat/path you get from useParams()["*"]
export const nodeRouteOverrides: Record<string, Override> = {
  // pick whichever path your resume node actually uses
  "career/resume": ({ node }) => <ResumePage node={node} />,
  "career/creative-builder/art-portfolio": ({ node }) => <ArtPortfolioPage node={node} />,
  "career/creative-builder/design-work": ({ node }) => <DesignPortfolioPage node={node} />,
};
