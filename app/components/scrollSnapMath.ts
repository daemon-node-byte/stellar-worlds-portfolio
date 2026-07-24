import type { PortfolioSectionId } from "../data/portfolioContent";

export type SectionViewport = {
  id: PortfolioSectionId;
  top: number;
  height: number;
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
