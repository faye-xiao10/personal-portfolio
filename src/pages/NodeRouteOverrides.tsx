import React from "react";
import type { SkillNode } from "@/types/skill";
import ResumePage from "@/pages/ResumePage";

type Override = (args: { node: SkillNode; path: string }) => React.ReactNode;

// key = exact splat/path you get from useParams()["*"]
export const nodeRouteOverrides: Record<string, Override> = {
  // pick whichever path your resume node actually uses
  "career/resume": ({ node }) => <ResumePage node={node} />,
  // "career/resume": ({ node }) => <ResumePage node={node} />,
};
