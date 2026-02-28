import React from "react";
import { useNavigate } from "react-router-dom";
import PreviewTree from "@/ForceTree/PreviewTree";
import { useSkillTree } from "@/contexts/SkillTreeContext";
import { NavbarContent } from "@/components/NavbarContent";

export const NavbarDesktop: React.FC = () => {
  const navigate = useNavigate();
  const { treeData } = useSkillTree();

  return (
    <div className="hidden lg:flex w-[30%] h-screen p-8 gap-2 flex-col overflow-hidden">
      <div className="flex justify-between shrink-0 gap-2">
        <div>
          <h2
            className="font-extrabold text-3xl rounded-2xl mb-4 hover:cursor-pointer hover:text-gray-600 hover:bg-gray-50"
            onClick={() => navigate("/")}
          >
            Faye Xiao
          </h2>
          <h3 className="font-bold">CS + Business Dual Degree From Umich</h3>

          <h3 className="font-light"> Full-Stack Product Engineer | UX-Driven Creator | AI-Product Builder </h3>

        </div>

        <div className="flex-shrink-0" onClick={() => navigate("/")}>
          <div className="shimmer-overlay w-[120px] h-[120px] cursor-pointer rounded-xl transition duration-150 ease-out hover:ring-3 hover:ring-gray-200">
            <PreviewTree data={treeData} dimensions={{ width: 120, height: 120 }} />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-300 my-2 shrink-0" />

      <div className="shrink-0">
        <h3 className="font-bold text-2xl">About Me</h3>
        <p className="text-base font-bold opacity-90">
        I ship 0→1 at the intersection of AI, product, and business. 
        </p>
        <p className="text-base opacity-90">
          This site is a living map of the products, systems, and tools I’ve built and worked on.
        </p>
      </div>

      <div className="w-full h-px bg-gray-300 my-2 shrink-0" />

      <div className="flex items-center justify-between shrink-0">
        <h3 className="font-bold text-xl">Explore</h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <NavbarContent />
      </div>
    </div>
  );
};