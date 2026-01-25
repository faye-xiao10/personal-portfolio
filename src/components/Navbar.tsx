import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSkillTree } from "@/contexts/SkillTreeContext";
import type { SkillNode } from "@/types/skill";
import PreviewTree from "@/ForceTree/PreviewTree";
import { supabase } from "@/lib/supabase";

/* ---------------- utils ---------------- */

function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

function getActiveSlugFromLocation(pathname: string): string {
  return normalizePath(pathname);
}

function hasChildren(n: SkillNode): boolean {
  return Array.isArray(n.children) && n.children.length > 0;
}

function indexTreeById(root: SkillNode | null): Map<string, SkillNode> {
  const map = new Map<string, SkillNode>();
  if (!root) return map;

  const stack: SkillNode[] = [root];
  while (stack.length) {
    const n = stack.pop()!;
    if (n.id) map.set(n.id, n);
    for (const c of n.children ?? []) stack.push(c);
  }
  return map;
}

/* ---------------- NavItem ---------------- */

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
  const logo = node.logo ?? null;
  const showLogo = !!logo;
  const isBranch = hasChildren(node);

  // Auto-open the branch if current route is inside it
  useEffect(() => {
    if (!hasChildren(node)) return;
    if (isExactActive || isInSubtree) setOpen(true);
  }, [isExactActive, isInSubtree, node]);

  const indentClass =
    depth === 0 ? "" : depth === 1 ? "pl-4" : depth === 2 ? "pl-8" : "pl-12";

  const handleRowClick = () => {
    if (isBranch) {
      setOpen((o) => !o);
      return;
    }
    if (node.slug) onNavigate(node.slug);
  };

  return (
    <div className={indentClass}>
      <div
        onClick={handleRowClick}
        className={[
          "group flex items-center rounded-lg py-1 hover:cursor-pointer",
          "hover:bg-sky-100 transition-all duration-200 ease-out",
          isExactActive ? "bg-sky-50" : "",
          !isExactActive && isInSubtree ? "bg-sky-50" : "",
        ].join(" ")}
      >
        {/* logo */}
        {showLogo && (
          <div className="w-12 h-12 bg-white flex-shrink-0 ml-1">
            <img src={logo!} alt="" className="w-full h-full object-contain" />
          </div>
        )}

        {/* caret */}
        {hasChildren(node) ? (
          <button
            type="button"
            className="ml-1 text-3xl hover:cursor-pointer opacity-70 group-hover:opacity-100"
            aria-label={open ? "Collapse section" : "Expand section"}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <span className={showLogo ? "w-2" : "w-4"} />
        )}

        {/* label */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (node.slug) onNavigate(node.slug);
          }}
          className={[
            "ml-1 text-left w-full hover:cursor-pointer rounded-lg opacity-90",
            hasChildren(node) ? "font-bold" : "",
            isExactActive ? "underline font-bold" : "",
          ].join(" ")}
        >
          {node.name}
        </button>
      </div>

      {open && hasChildren(node) && (
        <div className="flex flex-col">
          {(node.children ?? []).map((child) => (
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

/* ---------------- Navbar ---------------- */

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { treeData, loading, error } = useSkillTree();

  const activeSlug = useMemo(
    () => getActiveSlugFromLocation(location.pathname),
    [location.pathname]
  );

  // view switching
  const [activeViewKey, setActiveViewKey] = useState<string>("career");
  const [views, setViews] = useState<{ key: string; name: string }[]>([]);
  const [navRootIds, setNavRootIds] = useState<string[]>([]);
  const [navErr, setNavErr] = useState<string | null>(null);

  // Load available views (Career / Personal / etc.)
  useEffect(() => {
    let cancelled = false;

    async function loadViews() {
      const { data, error } = await supabase
        .from("views")
        .select("key,name")
        .order("name", { ascending: true });

      if (cancelled) return;
      if (error) {
        console.error(error);
        setNavErr(error.message);
        return;
      }

      setViews(data ?? []);
    }

    loadViews();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load navbar roots for the active view (ordered)
  useEffect(() => {
    let cancelled = false;

    async function loadNav() {
      setNavErr(null);

      const { data, error } = await supabase
        .from("view_nav_items")
        .select("node_id")
        .eq("view_key", activeViewKey)
        .eq("is_hidden", false)
        .order("position", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error(error);
        setNavErr(error.message);
        setNavRootIds([]);
        return;
      }

      setNavRootIds((data ?? []).map((r) => r.node_id));
    }

    loadNav();
    return () => {
      cancelled = true;
    };
  }, [activeViewKey]);

  const nodeById = useMemo(() => indexTreeById(treeData ?? null), [treeData]);

  const topLevel: SkillNode[] = useMemo(() => {
    const fallback = treeData?.children ?? [];

    // If view has no configured nav items yet, fallback to the tree root children
    if (!navRootIds.length) return fallback;

    const resolved = navRootIds
      .map((id) => nodeById.get(id))
      .filter(Boolean) as SkillNode[];

    // If we couldn't resolve IDs (e.g., tree not loaded yet), still show fallback
    return resolved.length ? resolved : fallback;
  }, [navRootIds, nodeById, treeData]);

  const handleNavigate = (slug: string) => {
    navigate(`/${normalizePath(slug)}`);
  };

  return (
    <div className="w-[30%] h-screen p-8 gap-2 flex flex-col overflow-hidden">
      <div className="flex justify-between shrink-0">
        <div>
          <h2
            className="font-extrabold text-3xl rounded-2xl mb-4 hover:cursor-pointer hover:text-gray-600 hover:bg-gray-50"
            onClick={() => navigate("/")}
          >
            Faye Xiao
          </h2>
          <h3>CS + Business From Umich</h3>
          <h3>Check out my Skill Tree -</h3>
        </div>

        <div
          className="flex-shrink-0 "
          onClick={() => navigate("/")}
        >
          <div className="shimmer-overlay w-[120px] h-[120px] cursor-pointer rounded-xl transition duration-150 ease-out hover:ring-3 hover:ring-gray-200">
            <PreviewTree data={treeData} dimensions={{ width: 120, height: 120 }} />
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-300 my-2 shrink-0" />

      <div className="flex gap-2 shrink-0">
        <div>
          <h3 className="font-bold text-2xl">About Me</h3>
          <p className="text-base opacity-90">
            Hi I'm Faye, product innovator and creative. Welcome to my skill tree! Every word here is written by me, not AI.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-300 my-2 shrink-0" />

      <div className="flex items-center justify-between shrink-0">
        <h3 className="font-bold text-xl">Explore</h3>

        {/* View switcher
        <div className="flex gap-2">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setActiveViewKey(v.key)}
              className={[
                "px-2 py-1 rounded border text-sm",
                activeViewKey === v.key ? "bg-sky-100 border-sky-300" : "bg-white",
              ].join(" ")}
            >
              {v.name}
            </button>
          ))}
        </div> */}
      </div>

      {(loading || navErr) && (
        <div className="text-sm opacity-70 shrink-0">
          {loading ? "Loading…" : navErr}
        </div>
      )}
      {error && <div className="text-sm text-red-600 shrink-0">{error}</div>}

      {!loading && !error && (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-1">
            {topLevel.map((node) => (
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
    </div>
  );
};

export default Navbar;
