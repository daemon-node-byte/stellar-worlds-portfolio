/** Stable identifiers for every selectable skill signal. */
export type SkillConstellationNodeId =
  | "typescript"
  | "react"
  | "nextjs"
  | "nodejs"
  | "python"
  | "postgresql"
  | "cloud"
  | "ai";

/** Content and normalized map coordinates for a skill signal. */
export type SkillConstellationNode = {
  id: SkillConstellationNodeId;
  label: string;
  category: string;
  summary: string;
  signals: readonly string[];
  position: {
    x: number;
    y: number;
  };
};

/** The skill selected when the constellation first enters the viewport. */
export const defaultSkillConstellationNodeId: SkillConstellationNodeId =
  "typescript";

/** Portfolio skills and their normalized positions around the full-stack core. */
export const skillConstellationNodes: readonly SkillConstellationNode[] = [
  {
    id: "typescript",
    label: "TypeScript",
    category: "Core language",
    summary:
      "Type-safe application architecture that keeps ambitious products understandable as they grow.",
    signals: ["JavaScript", "TypeScript", "Architecture"],
    position: { x: 50, y: 10 },
  },
  {
    id: "react",
    label: "React",
    category: "Interface systems",
    summary:
      "Responsive component systems for expressive web and mobile experiences with dependable state flow.",
    signals: ["React", "React Native", "Expo"],
    position: { x: 21, y: 25 },
  },
  {
    id: "nextjs",
    label: "Next.js",
    category: "Product delivery",
    summary:
      "Production web applications spanning server rendering, content systems, APIs, and polished interaction.",
    signals: ["Next.js", "SvelteKit", "Web UX"],
    position: { x: 79, y: 23 },
  },
  {
    id: "nodejs",
    label: "Node.js",
    category: "Backend systems",
    summary:
      "Maintainable services and integrations built around clear domain boundaries and observable failure modes.",
    signals: ["Node.js", "Express", "REST + GraphQL"],
    position: { x: 25, y: 75 },
  },
  {
    id: "python",
    label: "Python",
    category: "Automation",
    summary:
      "Automation, AI tooling, and backend workflows designed to turn repetitive operations into reliable systems.",
    signals: ["Python", "FastAPI", "Tooling"],
    position: { x: 75, y: 73 },
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    category: "Data layer",
    summary:
      "Durable data models and query paths that keep application state consistent, inspectable, and fast.",
    signals: ["PostgreSQL", "Prisma", "Supabase"],
    position: { x: 50, y: 84 },
  },
  {
    id: "cloud",
    label: "Cloud",
    category: "Operations",
    summary:
      "Practical delivery infrastructure with automated checks, repeatable environments, and production visibility.",
    signals: ["AWS + GCP", "Docker", "CI/CD"],
    position: { x: 13, y: 51 },
  },
  {
    id: "ai",
    label: "AI systems",
    category: "Applied intelligence",
    summary:
      "Useful AI features grounded in product context, retrieval, structured tools, and intentional human control.",
    signals: ["OpenAI", "Claude + Gemini", "RAG"],
    position: { x: 87, y: 49 },
  },
] as const;
