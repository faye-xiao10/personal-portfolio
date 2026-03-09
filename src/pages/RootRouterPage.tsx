	import React, { useEffect, useState } from "react";
	import { useLocation, useNavigate, useParams } from "react-router-dom"
	// import SkillTree from '@/ForceTree/SkillTree'
	import SkillTreeWithPopup from "@/ForceTree/SkillTreeWithPopup";
	import { useSkillTree } from '@/contexts/SkillTreeContext';
	import type { SkillNode } from "@/types/skill";
	import SkillNodePage from "@/pages/SkillNodePage";
	import { nodeRouteOverrides } from "@/pages/NodeRouteOverrides";
	import { FaBoltLightning } from "react-icons/fa6";
	import { MdArrowOutward } from "react-icons/md";




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
			  label: "Skilt (AI Product)",
			  path: "career/product-builder/skilt",
			  logo: "/assets/Rix.png",
			},
			{
				label: "Portfolio (This Site!)",
				path: "career/product-builder/portfolio-showcase",
				logo: "/assets/portfoliologo.png",
			  },

			{
			  label: "Design Portfolio",
			  path: "career/creative-builder/design-work",
			  logo: "/assets/designLogo.png",
			},
			
			{
			  label: "Resume",
			  path: "career/resume",
			  logo: "/assets/resumelogo.png",
			},
		  ];

		const headlineTags: string[] = [
			"Typescript",
			"React",
			"Tailwind",
			"Node",
			"D3",
			"LLM Integration",
			"User Research",
			"Financial/Data Analysis",
		]

	



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
					<div className="w-full min-h-0 flex flex-col bg-slate-50 overflow-y-auto " >
						<div className="pt-4 px-4 md:px-8 text-lg">
							<h1 className="font-extrabold font-opensans text-3xl md:text-4xl lg:text-5xl mb-2"> 
								Hi,  I'm Faye!
							</h1>

							<p className="text-lg font-light md:font-bold md:text-xl mb-2"> I build and ship products 0→1, owning architecture, UI/UX, and AI integration. </p>

							<div className="flex flex-wrap gap-2 max-w-full ">
								{headlineTags.map((item) => (
								<div
									className="
									flex items-center gap-3
									border-gray-200 bg-gray-50 border-2
									w-fit px-1
									rounded-lg								
									flex-shrink-0
									"
								>
									<span className="truncate max-w-[18rem] text-md">
									{item}
									</span>
								</div>
								))}
							</div>

							<div className="mb-2 mt-4 border-t border-slate-200"></div>

							<p className="text-md font-bold md:font-medium md:text-xl md:hidden"> The Skill Tree below is a visual representation of my professional identity.  </p>

							<ul className="list-disc pl-6 mt-1 text-sm md:text-lg md:hidden">							
								<li><strong>Click</strong> a circle to explore an experience</li>
								<li><strong>Larger</strong> circles represent <strong> higher impact</strong> work </li>
							</ul>
						
						</div>

						<h3 className="pl-6 md:pl-10 text-lg font-bold mt-2"> Featured Work (Start Here) </h3>


						<div className="pl-4 md:pl-8 mx-2 max-w-full overflow-x-auto py-2">
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
									<div className="w-6 h-6 md:w-8 md:h-8 bg-white flex items-center justify-center rounded-md flex-shrink-0">
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

						
					
							<div
								className="
									w-full
									h-[420px] md:h-[520px] lg:h-[620px]
									border border-gray-200 rounded-lg bg-white shadow-sm 
								"
							>							
								<SkillTreeWithPopup
									data={treeData}
									onNodeClick={(_e, node) => {
										if (!node.slug) return;
										navigate(`/${node.slug}`);
									}}
								/>
							</div>

							<div className="w-full flex justify-center py-3 md:py-4 mt-2">
								<button
									type="button"
									onClick={() => {
									document.getElementById("impact")?.scrollIntoView({
										behavior: "smooth",
										block: "start",
									});
									}}
									className="flex flex-col items-center font-bold text-gray-500 text-xl
									border border-sky-300 px-10 py-1 rounded-lg
									hover:bg-gray-100 hover:cursor-pointer floaty "
								>
									<span>scroll</span>
									<span>⌄</span>
								</button>
							</div>


						

							<div className="p-4 md:p-6 lg:p-8 flex mt-4 md:mt-4 flex-col gap-4"  id="impact">
								<h3 className="text-4xl font-opensans font-extrabold mb-3 md:mb-8"> Impact Driven Work</h3>

								<div className="flex flex-col lg:flex-row w-full gap-4 items-stretch">									
									<div className="flex-6 flex">
										<div className="text-xl border-2 border-gray-300 rounded-xl p-2 md:p-4 flex flex-1 flex-col gap-2 cursor-pointer"
											onClick={() => navigate("/career/product-builder/skilt")}>
											<div className="flex justify-between">
												<p> Feb. 2024-Present   </p>
												<MdArrowOutward className="cursor-pointer text-gray-400 hover:text-gray-800"/>
											</div>
											<p className="text-2xl font-bold">Skilt - AI Learning Platform </p> 
										
											<div className="mb-2 border-t border-slate-300"></div>

											<p className="font-light">  Founder & Full Stack Product Builder </p>
											<div className="mb-2  border-t border-slate-300"></div>


											<div className="flex gap-2 text-2xl md:text-2xl xl:text-3xl font-bold">
												<p className="border-2 border-sky-200 p-1 md:p-2 rounded-lg w-fit text-center">3 MVPs Shipped </p>
												<p className="border-2 border-sky-200 p-1 md:p-2 rounded-lg w-fit text-center">$17k Raised </p>
												<p className="border-2 border-sky-200 p-1 md:p-2 rounded-lg w-fit text-center">30+ User Interviews </p>
											</div>


											<ul className="space-y-2">
												<li className="flex items-start gap-2">
													<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Architected and shipped a full-stack AI-powered microlearning platform from 0→1, deployed to live production (React + Node on Vercel).
													</span>
												</li>
												<li className="flex items-start gap-2">
													<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Designed graph-based progression architecture using D3 force-directed visualization
													</span>
												</li>
												<li className="flex items-start gap-2">
													<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Designed rubric-grounded LLM evaluation pipeline with structured scoring logic
													</span>
												</li>
												<li className="flex items-start gap-2">
													<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Engineered trial-to-authentication state migration (local → Firebase persistence)
													</span>
												</li>
												<div className="mb-2 mt-4 border-t border-slate-300"></div>

												<p className="font-bold">Technical Architecture:</p>



												<li className="flex items-start gap-2">
													<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Full-Stack React + Node • LLM Evaluation Pipeline • D3 Progression System • Firebase Schema Design
													</span>
												</li>

											</ul>
										</div>

									</div>

									<div className="flex flex-col gap-4 flex-4">
										<div className="text-xl border-2 border-gray-300 rounded-xl p-2 md:p-4 flex flex-1 flex-col gap-2 cursor-pointer"
											onClick={() => navigate("/career/business-data/federal-reserve")}>
											<div className="flex justify-between">
												<p> Summer '23   </p>
												<MdArrowOutward className="cursor-pointer text-gray-400 hover:text-gray-800"/>

											</div>
											<p className="font-bold text-2xl">Federal Reserve Bank</p>
											<p className="border-2 border-sky-200 p-1 md:p-2 rounded-lg text-center text-2xl md:text-2xl xl:text-3xl  font-bold">$2M+ Savings Identified  </p>

											<ul className="space-y-2">
												<li className="flex items-start gap-2">
												<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Processed 100k+ data points across 12 regional banks to uncover cost inefficiencies in voice & telephony systems.
													</span>
												</li>
											</ul>
											<div className="mb-2  border-t border-slate-300"></div>
											<p className="font-light"> Product Analyst</p> 


										</div>


										<div className="text-xl border-2 border-gray-300 rounded-xl p-2 md:p-4 flex flex-1 flex-col gap-4 cursor-pointer"
											onClick={() => navigate("/career/business-data/comerica")}>
											<div className="flex justify-between">
												<p> June 2022 - May 2023   </p>
												<MdArrowOutward className="cursor-pointer text-gray-400 hover:text-gray-800"/>

											</div>
											<p className="font-bold text-2xl">Comerica Bank  </p>
											<p className="border-2 border-sky-200 p-1 md:p-2 rounded-lg text-center text-2xl md:text-2xl xl:text-3xl font-bold">$1.4M+ Cost Reduction  </p>

											<ul className="space-y-2">
												<li className="flex items-start gap-2">
													<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
													<span>
													Identified fax line infrastructure redundancies through financial + technical analysis.
													</span>
												</li>
											</ul>
											<div className="mb-2  border-t border-slate-300"></div>
											<p className="font-light">  Technology & Innovation Analyst</p> 
										</div>



									</div>

								</div>
								<div className="text-xl border-2 border-gray-300 rounded-xl p-2 md:p-4 flex flex-col gap-2 cursor-pointer"
									onClick={() => navigate("/career/business-data/jp-morgan")}>
									<div className="flex justify-between">
										<p> Summer 24'   </p>
										<MdArrowOutward className="cursor-pointer text-gray-400 hover:text-gray-800"/>

									</div>
									<p className="font-bold text-2xl">JP Morgan Private Bank </p>
									<p className="border-2 border-sky-200 p-1 md:p-2 rounded-lg text-center text-xl md:text-2xl font-bold">Executive Level Pitching  </p>

									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
											<span>
												Built and presented tailored investment proposals for multimillion-dollar UHNW portfolios, including ESG-focused funds such as TPG Rise Climate II ($7B+ AUM).
											</span>
										</li>
									</ul>
									<ul className="space-y-2">
										<li className="flex items-start gap-2">
											<FaBoltLightning className="mt-1 shrink-0 text-sky-300" />
											<span>
											Supported live client pitches and new business outreach, structuring research and financial projections into decision-ready materials.
											</span>
										</li>
									</ul>
									<div className="mb-2  border-t border-slate-300"></div>
									<p className="font-light">  Summer Analyst</p> 
								</div>
								
							</div>

							
								
							<div className="p-4">
								<h3 className="text-3xl font-bold mb-3"> What I'm Looking For</h3>
								<p className="text-xl"> Looking for early-stage teams where I can own ambiguous problems, build end-to-end, and help move product and revenue. </p>
							</div>

							{/* <div
							onClick={() => {
								document.getElementById("app-scroll")?.scrollBy({ top: 400, behavior: "smooth" });
							}}
							className="
								scroll-hint floaty
								fixed bottom-10 left-1/2 -translate-x-1/2
								flex flex-col items-center cursor-pointer font-bold text-gray-500 
								border-1 border-sky-300 p-1 px-4 rounded-lg hover:bg-gray-100 "
							
							>
							<p>scroll</p>
							<p>⌄</p>
							</div> */}
														

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