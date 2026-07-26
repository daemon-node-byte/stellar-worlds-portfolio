export const portfolioSections = [
  {
    id: "origin",
    index: "01",
    navLabel: "Origin",
    specimen: "Signal",
  },
  {
    id: "about",
    index: "02",
    navLabel: "About",
    specimen: "Virelia",
  },
  {
    id: "projects",
    index: "03",
    navLabel: "Projects",
    specimen: "Khepri",
  },
  {
    id: "notes",
    index: "04",
    navLabel: "Field notes",
    specimen: "Calyx",
  },
  {
    id: "contact",
    index: "05",
    navLabel: "Contact",
    specimen: "Nox",
  },
] as const;

export type PortfolioSectionId = (typeof portfolioSections)[number]["id"];

export type PortfolioProject = {
  index: string;
  year: string;
  name: string;
  type: string;
  description: string;
  tags: readonly string[];
  liveUrl?: string;
  sourceUrl?: string;
};

export const selectedProjects: readonly PortfolioProject[] = [
  {
    index: "01",
    year: "2026",
    name: "Astarot",
    type: "Full-stack web application",
    description:
      "A tarot and astrology experience that turns symbolic systems into an approachable interactive product.",
    tags: ["Next.js", "Python", "Product"],
    liveUrl: "https://crispy-happiness-gilt.vercel.app",
    sourceUrl: "https://github.com/daemon-node-byte/crispy-happiness",
  },
  {
    index: "02",
    year: "2026",
    name: "Ableton MCP",
    type: "Creative developer tooling",
    description:
      "A local bridge that lets intelligent tools communicate with Ableton Live for exploratory music workflows.",
    tags: ["Python", "MCP", "Automation"],
    sourceUrl: "https://github.com/daemon-node-byte/ableton_mcp",
  },
  {
    index: "03",
    year: "2026",
    name: "TS Env Validator",
    type: "Open-source utility",
    description:
      "A small, type-safe environment validation layer for Node.js and Next.js applications.",
    tags: ["TypeScript", "Node.js", "DX"],
    sourceUrl: "https://github.com/daemon-node-byte/ts-env-validator",
  },
] as const;

export type SocialProfileId = "github" | "linkedin" | "facebook" | "x";

export const socialProfiles: readonly {
  id: SocialProfileId;
  label: string;
  handle: string;
  url: string;
}[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "daemon-node-byte",
    url: "https://github.com/daemon-node-byte",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "joshmclain45",
    url: "https://www.linkedin.com/in/joshmclain45",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "josh codes",
    url: "https://www.facebook.com/profile.php?id=61575475723755",
  },
  {
    id: "x",
    label: "X / Twitter",
    handle: "@daemon_node",
    url: "https://x.com/daemon_node",
  },
] as const;
