"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  portfolioSections,
  type PortfolioSectionId,
} from "../data/portfolioContent";
import type { FieldNoteSummary } from "../data/fieldNoteTypes";
import { ObservatoryInterface } from "./ObservatoryInterface";
import { SceneCanvas } from "./SceneCanvas";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

type StellarExperienceProps = {
  fieldNotes: readonly FieldNoteSummary[];
};

export function StellarExperience({ fieldNotes }: StellarExperienceProps) {
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] =
    useState<PortfolioSectionId>("origin");

  useEffect(() => {
    let frameId = 0;

    const updateScrollState = () => {
      frameId = 0;
      const scrollRange =
        document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current =
        scrollRange > 0
          ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1)
          : 0;

      const viewportCenter = window.innerHeight * 0.5;
      let closestSection: PortfolioSectionId = portfolioSections[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      portfolioSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        const distance = Math.abs(
          bounds.top + bounds.height * 0.5 - viewportCenter,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section.id;
        }
      });

      setActiveSection((current) =>
        current === closestSection ? current : closestSection,
      );
    };

    const handleScroll = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleNavigate = useCallback(
    (sectionId: PortfolioSectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reducedMotion],
  );

  return (
    <main className="observatory-shell">
      <SceneCanvas
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
      <ObservatoryInterface
        activeSection={activeSection}
        fieldNotes={fieldNotes}
        onNavigate={handleNavigate}
      />
    </main>
  );
}
