import type { PortfolioSectionId } from "../data/portfolioContent";

export type SectionViewport = {
  id: PortfolioSectionId;
  top: number;
  height: number;
};

type SectionReference = {
  id: PortfolioSectionId;
};

export function calculateScrollProgress(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
) {
  const scrollRange = Math.max(scrollHeight - viewportHeight, 0);
  if (scrollRange === 0) return 0;

  return Math.min(Math.max(scrollY / scrollRange, 0), 1);
}

export function findClosestSection(
  sections: readonly SectionViewport[],
  viewportHeight: number,
) {
  const viewportCenter = viewportHeight * 0.5;
  let closestSection = sections[0]?.id ?? "origin";
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const sectionCenter = section.top + section.height * 0.5;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestSection = section.id;
    }
  }

  return closestSection;
}

export function findAdjacentSection(
  sections: readonly SectionReference[],
  currentSection: PortfolioSectionId,
  direction: -1 | 1,
) {
  const currentIndex = sections.findIndex(
    (section) => section.id === currentSection,
  );
  if (currentIndex === -1) return sections[0]?.id ?? "origin";

  const nextIndex = Math.min(
    Math.max(currentIndex + direction, 0),
    sections.length - 1,
  );
  return sections[nextIndex]?.id ?? currentSection;
}

export function canScrollWithinSection(
  section: Pick<SectionViewport, "top" | "height">,
  viewportHeight: number,
  direction: -1 | 1,
) {
  const alignmentTolerance = 2;
  const sectionBottom = section.top + section.height;

  return direction > 0
    ? sectionBottom > viewportHeight + alignmentTolerance
    : section.top < -alignmentTolerance;
}
