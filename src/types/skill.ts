export interface SkillNode {
  id: string;
  slug: string;
  name: string;
  size: number;
  fixed?: boolean;
  pin?: { x: number; y: number; relative: boolean };
  children?: SkillNode[];
  logo?: string;
  description?: string | null;
}
