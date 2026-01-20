	import React, { useMemo, useState } from "react";
	import { useLocation, useNavigate } from "react-router-dom";
	import { useSkillTree } from "@/contexts/SkillTreeContext";
	import type { SkillNode } from "@/types/skill";
	import PreviewTree from '@/ForceTree/PreviewTree';
	import wolvsoftLogo from '@/assets/wolvsoftLogo.jpeg'

	function normalizePath(path: string): string {
	return path.replace(/^\/+|\/+$/g, "");
	}

	// Your app routes look like "/creative-builder/art-portfolio"
	function getActiveSlugFromLocation(pathname: string): string {
	return normalizePath(pathname);
	}

	function hasChildren(n: SkillNode): boolean {
	return Array.isArray(n.children) && n.children.length > 0;
	}

	function isSlugActive(nodeSlug: string, activeSlug: string): boolean {
		if (!nodeSlug) return activeSlug === ""; // root
		return activeSlug === nodeSlug || activeSlug.startsWith(nodeSlug + "/");
	}

	type NavItemProps = {
	node: SkillNode;
	depth: number;
	activeSlug: string;
	onNavigate: (slug: string) => void;
	};

	const NavItem: React.FC<NavItemProps> = ({ node, depth, activeSlug, onNavigate }) => {
	const [open, setOpen] = useState(true);

	const slug = node.slug ?? "";
	const isExactActive = slug !== "" && activeSlug === slug;
	const isInSubtree = slug !== "" && activeSlug.startsWith(slug + "/");
	const isActive = isExactActive || isInSubtree;
	const logo = node.logo ?? null;
	const showLogo = !!logo;
	const isBranch = hasChildren(node);
	const handleRowClick = () => {
	if (isBranch) {
		setOpen(o => !o);
		return;
	}
	if (node.slug) onNavigate(node.slug);
	};



	const indentClass =
		depth === 0 ? "" : depth === 1 ? "pl-4" : depth === 2 ? "pl-8" : "pl-12";

	return (
		<div className={indentClass}>
			<div
				onClick={handleRowClick}
				className={[
					"group flex items-center rounded-lg py-1 hover:cursor-pointer",
					"hover:bg-gray-50",
					isExactActive ? "bg-gray-100" : "",
					!isExactActive && isInSubtree ? "bg-gray-50" : "",
				].join(" ")}
				>
			{/* logo */}
			{showLogo && (
				<div className="w-12 h-12 bg-white flex-shrink-0 ml-1">
				<img src={logo!} alt="" className="w-full h-full object-contain" />
				</div>
			)}
			{hasChildren(node) ? (
				<button
					type="button"
					className="ml-1 text-3xl hover:cursor-pointer opacity-70 group-hover:opacity-100"
					aria-label={open ? "Collapse section" : "Expand section"}
					>
				{open ? "▾" : "▸"}
				</button>
			) : (
				<span className={showLogo ? "w-2" : "w-4"} />
			)}

			<button
				type="button"
				onClick={() => node.slug && onNavigate(node.slug)}
				className={[
				"ml-1 text-left w-full  hover:cursor-pointer",
				"rounded-lg", 
				hasChildren(node) ? "font-bold" : "",
				isExactActive ? "underline font-bold" : "",
				"opacity-90",
				].join(" ")}
			>
				{node.name}
			</button>
		</div>


		{open && hasChildren(node) && (
			<div className="flex flex-col">
			{(node.children ?? []).map(child => (
				<NavItem
				key={child.id ?? child.slug ?? child.name}
				node={child}
				depth={depth + 1}
				activeSlug={activeSlug}
				onNavigate={onNavigate}
				/>
			))}
			</div>
		)}
		</div>
	);
	};

	const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { treeData, loading, error } = useSkillTree();

	const activeSlug = useMemo(
		() => getActiveSlugFromLocation(location.pathname),
		[location.pathname]
	);

	const topLevel = treeData?.children ?? [];

	const handleNavigate = (slug: string) => {
		navigate(`/${normalizePath(slug)}`);
	};

	return (
		<div className="w-[30%] h-screen p-8 gap-2 flex flex-col">
			<div className="flex justify-between">

				<div>
					<h2
						className="font-extrabold text-3xl rounded-2xl mb-4 hover:cursor-pointer hover:text-gray-600 hover:bg-gray-50"
						onClick={() => navigate("/")}
					>
						Faye Xiao
					</h2>
					<h3> CS + Business From Umich</h3>
					<h3> Check out my Skill Tree -</h3>

				</div>
				<div className="flex-shrink-0 cursor-pointer rounded-xl
								transition duration-150 ease-out
								hover:ring-3 hover:ring-gray-200"
					onClick={() => navigate("/")}
					>
					<div className=" shimmer-overlay w-[120px] h-[120px] ">
						<PreviewTree 
						data={treeData} 
						dimensions={{ width: 120, height: 120 }}           
					/>
					</div>
				</div>
			</div>
			<div className="w-full h-px bg-gray-300 my-2" />
			<div className="flex gap-2">
				<div>
					<h3 className="font-bold text-2xl">About Me</h3>           
					<p className="text-base opacity-90">
						Hi I'm Faye, product innovator and creative. Welcome to my skill tree! Every word here is written by me, not AI.
					</p>
				</div>
			</div>
			<div className="w-full h-px bg-gray-300 my-2" />
			<div className="flex">     
				<div>
				<h3 className="font-bold text-xl">Explore</h3>
				<h2> Click a node on the skill tree to get started!</h2>
				</div>          
			</div>
			{loading && <div className="text-sm opacity-70">Loading…</div>}
			{error && <div className="text-sm text-red-600">{error}</div>}
			{!loading && !error && (
				<div>
					
					<div className="flex flex-col gap-1">
					{topLevel.map(node => (
						<NavItem
						key={node.id ?? node.slug ?? node.name}
						node={node}
						depth={0}
						activeSlug={activeSlug}
						onNavigate={handleNavigate}
						/>
					))}
					</div>
				</div>
				
			)}
			<div className="flex-1" />
		</div>
	);
	};

	export default Navbar;
