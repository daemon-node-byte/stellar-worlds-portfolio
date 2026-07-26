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
