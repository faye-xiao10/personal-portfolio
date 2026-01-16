export interface SkillNode {
    name: string;
    size: number;
    fixed?: boolean; 
    pin?: {
      x: number;
      y: number;
      relative: boolean;
    };
    children?: SkillNode[]; // Recursive!
  }