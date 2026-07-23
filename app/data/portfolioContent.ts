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

export const selectedProjects = [
  {
    index: "01",
    year: "2026",
    name: "Palisade",
    type: "Creative development",
    description:
      "A spatial archive that turns cultural research into a navigable, living index.",
    tags: ["WebGL", "Interaction", "Identity"],
  },
  {
    index: "02",
    year: "2025",
    name: "Substrate",
    type: "Product system",
    description:
      "An adaptive intelligence workspace built around calm focus and material depth.",
    tags: ["Product", "Systems", "Motion"],
  },
  {
    index: "03",
    year: "2025",
    name: "Afterlight",
    type: "Digital installation",
    description:
      "A generative memorial where fragmented signals resolve into shared constellations.",
    tags: ["Generative", "3D", "Narrative"],
  },
] as const;

export const fieldNotes = [
  {
    date: "06.18.26",
    title: "Designing interfaces that feel discovered",
    category: "Field study",
  },
  {
    date: "04.02.26",
    title: "The useful friction of unfamiliar worlds",
    category: "Process",
  },
  {
    date: "01.27.26",
    title: "Light as an interaction material",
    category: "Rendering",
  },
] as const;
