import React from "react";
import type { SkillNode } from "@/types/skill";

type Props = {
  node: SkillNode;
};

export default function ResumePage({ node }: Props) {
  // IMPORTANT: respects Vite base path (/faye/, /, etc.)
  const pdfUrl = `${import.meta.env.BASE_URL}resume.pdf`;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <h1 className="text-6xl font-opensans font-extrabold">{node.name}</h1>

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
        >
          Download PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="w-full h-[85vh] border rounded overflow-hidden bg-white">
        <iframe
          src={pdfUrl}
          title="Resume PDF"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
