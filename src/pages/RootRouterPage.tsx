	import React from 'react'
	import { useLocation, useNavigate, useParams } from "react-router-dom"
	// import SkillTree from '@/ForceTree/SkillTree'
	import SkillTreeWithPopup from "@/ForceTree/SkillTreeWithPopup";
	import { useSkillTree } from '@/contexts/SkillTreeContext';
	import type { SkillNode } from "@/types/skill";
	import SkillNodePage from "@/pages/SkillNodePage";
	import { nodeRouteOverrides } from "@/pages/NodeRouteOverrides";


	type HotLink = {
		label: string;
		path: string;
		logo?: string;
	  };


	const RootRouterPage: React.FC = () => {
		const { treeData, loading, error, getNodeByPath } = useSkillTree();
		const location = useLocation();
		const navigate = useNavigate();
		const splat = useParams()["*"] ?? ""; // everything after "/"

		const hotLinks: HotLink[] = [
			{
			  label: "Skilt (Flagship Product)",
			  path: "career/product-builder/skilt",
			  logo: "/assets/Rix.png",
			},
			{
			  label: "Design Portfolio",
			  path: "career/creative-builder/design-work",
			  logo: "/assets/designLogo.png",
			},
			{
			  label: "Comerica Internship",
			  path: "career/business-data/comerica",
			  logo: "/assets/comericalogo.jpg",
			},
			{
			  label: "Teaching Experience",
			  path: "career/learning-architect/teaching-practice",
			  logo: "/assets/teachingLogo.png",
			},
			{
			  label: "Resume",
			  path: "career/resume",
			  logo: "/assets/resumelogo.png",
			},
		  ];


		if (loading) return <div className="p-8">Loading...</div>;
		if (error) return <div className="p-8 text-red-600">{error}</div>;
		if (!treeData) return <div className="p-8">No tree data.</div>;

		// case 1: /faye/ root node, show tree
		if (splat.trim() === "") {
			const onNodeClick = (_e: React.MouseEvent, node: SkillNode) => {
				if (!node.slug) return;
				// if you allow clicking root, make its slug empty or handle it here
				navigate(`/${node.slug}`);
			};

				return (
					<div className="w-full h-full flex flex-col bg-slate-50">
						<div className="p-6  md:px-8 text-lg">
							<h1 className="font-extrabold font-opensans text-5xl mb-3"> 
								Hi,  I'm Faye!
							</h1>
							<h2 className="hidden md:flex md:text-3xl font-light mb-3"> Product Builder | Creative Thinker | Learning Architect. </h2>
							<p className="text-xl md:text-2xl font-bold  mb-3"> I thrive in fast-moving, ambiguous, product roles where I can build hands-on, exercise creative judgement, and take full ownership. </p>

							<p className="text-lg md:text-xl"> The Skill Tree below is a visual representation of my professional identity.  </p>

							<ul className="list-disc pl-6 mt-4">							
								<li><strong>Click</strong> a circle to explore an experience</li>
								<li><strong>Larger</strong> circles represent <strong> higher impact</strong> work </li>
							</ul>
						
						</div>

						<h3 className="pl-6 md:pl-12 text-2xl font-bold"> Featured Work (Start Here) </h3>

						<div className="pl-4 md:pl-8 m- max-w-full overflow-x-auto py-2">
							<div className="flex gap-4 w-max">
								{hotLinks.map((item) => (
								<div
									key={item.path}
									onClick={() => navigate(item.path)}
									className="
									flex items-center gap-3
									ring-sky-200 ring-2
									w-fit p-2
									rounded-lg
									cursor-pointer
									hover:bg-sky-50
									transition
									flex-shrink-0
									"
								>
									{item.logo && (
									<div className="w-6 h-6 md:w-12 md:h-12 bg-white flex items-center justify-center rounded-md flex-shrink-0">
										<img
										src={item.logo}
										alt=""
										className="max-w-full max-h-full object-contain"
										/>
									</div>
									)}

									<span className="truncate max-w-[18rem] font-medium">
									{item.label}
									</span>
								</div>
								))}
							</div>
							</div>
					
						<div className="w-full flex-1 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
							<SkillTreeWithPopup
								data={treeData}
								dimensions={{ width: 1200, height: 600 }}
								onNodeClick={(_e, node) => {
									if (!node.slug) return;
									navigate(`/${node.slug}`);
								}}
							/>
						</div>
					</div>
				);
		}		

		// case 2: /faye/... show content
		const node = getNodeByPath(splat);

		if (!node) {
		return (
			<div className="p-8">
			<h1 className="text-xl font-bold">Not found</h1>
			<p className="text-gray-600">/{splat}</p>
			</div>
		);
		}

		const normalized = splat.replace(/^\/+|\/+$/g, "");
		const override = nodeRouteOverrides[normalized];
		if (override) return <>{override({ node, path: normalized })}</>;

		return <SkillNodePage node={node} path={normalized} />;
	};

	export default RootRouterPage;