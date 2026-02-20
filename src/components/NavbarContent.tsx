import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSkillTree } from "@/contexts/SkillTreeContext";
import type { SkillNode } from "@/types/skill";
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
          "hover:bg-sky-100 transition-all duration-200 ease-out text-md md:text-lg",
          isExactActive ? "bg-sky-50" : "",
          !isExactActive && isInSubtree ? "bg-sky-50" : "",
        ].join(" ")}
      >
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

/* ---------------- NavbarContent ---------------- */

export type NavbarContentProps = {
  onNavigateDone?: () => void; // mobile drawer closes after link tap
};

export const NavbarContent: React.FC<NavbarContentProps> = ({ onNavigateDone }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { treeData, loading, error } = useSkillTree();

  const activeSlug = useMemo(
    () => getActiveSlugFromLocation(location.pathname),
    [location.pathname]
  );

  const [activeViewKey] = useState<string>("career");
  const [navRootIds, setNavRootIds] = useState<string[]>([]);
  const [navErr, setNavErr] = useState<string | null>(null);

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
    if (!navRootIds.length) return fallback;

    const resolved = navRootIds
      .map((id) => nodeById.get(id))
      .filter(Boolean) as SkillNode[];

    return resolved.length ? resolved : fallback;
  }, [navRootIds, nodeById, treeData]);

  const handleNavigate = (slug: string) => {
    navigate(`/${normalizePath(slug)}`);
    onNavigateDone?.();
  };

  if (loading || navErr) return <div className="text-sm opacity-70">{loading ? "Loading…" : navErr}</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
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
  );
};