export const projectThemes = ["amber", "cyan", "violet"] as const;

export type ProjectTheme = (typeof projectThemes)[number];

export type ProjectCaseStudySummary = {
  slug: string;
  index: string;
  title: string;
  year: string;
  type: string;
  excerpt: string;
  role: string;
  status: string;
  orbit: string;
  theme: ProjectTheme;
  tags: readonly string[];
  liveUrl?: string;
  sourceUrl?: string;
};

export type ProjectCaseStudy = ProjectCaseStudySummary & {
  body: string;
};
