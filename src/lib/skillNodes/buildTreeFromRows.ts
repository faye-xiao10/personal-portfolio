import type { SkillNode } from "@/types/skill";
import type { SkillNodeRow } from "@/types/db";

type SkillNodeWithChildren = SkillNode & { children: SkillNode[] };

function rowToNode(row: SkillNodeRow): SkillNodeWithChildren {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    size: row.size,
    fixed: row.fixed ?? false,
    ...(row.pin ? { pin: row.pin } : {}),
    children: [],
  };
}

export function buildTreeFromRows(rows: SkillNodeRow[]): SkillNode | null {
  const map = new Map<string, SkillNodeWithChildren>();

  for (const r of rows) map.set(r.slug, rowToNode(r));

  for (const r of rows) {
    if (r.parent_slug === null) continue;
    const parent = map.get(r.parent_slug);
    const child = map.get(r.slug);
    if (parent && child) parent.children.push(child);
  }

  return map.get("") ?? null;
}
