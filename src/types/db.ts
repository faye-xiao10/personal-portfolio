export type Pin = { x: number; y: number; relative: boolean };

export type SkillNodeRow = {
  id: string;
  slug: string;                 // '' for root
  parent_slug: string | null;
  name: string;
  size: number;
  fixed: boolean;
  logo: string | null;
  pin: Pin | null;
  content: Record<string, unknown> | null;
  updated_at: string;
  description: string | null;
};
