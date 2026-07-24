"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  portfolioSections,
  type PortfolioSectionId,
} from "../data/portfolioContent";
import type { FieldNoteSummary } from "../data/fieldNoteTypes";
import { ObservatoryInterface } from "./ObservatoryInterface";
import { SceneCanvas } from "./SceneCanvas";
import {
  calculateScrollProgress,
  findClosestSection,
  type SectionViewport,
} from "./scrollSnapMath";

const scrollSettleDelay = 180;

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
    let settleTimer = 0;

    const updateScrollProgress = () => {
      frameId = 0;
      progressRef.current = calculateScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
    };

    const commitSettledSection = () => {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
      const sectionViewports = portfolioSections.flatMap<SectionViewport>(
        (section) => {
          const element = document.getElementById(section.id);
          if (!element) return [];

          const bounds = element.getBoundingClientRect();
          return [{ id: section.id, top: bounds.top, height: bounds.height }];
        },
      );
      const settledSection = findClosestSection(
        sectionViewports,
        window.innerHeight,
      );

      setActiveSection((current) =>
        current === settledSection ? current : settledSection,
      );
    };

    const scheduleScrollUpdate = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateScrollProgress);
      }
    };

    const scheduleSettledSection = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(
        commitSettledSection,
        scrollSettleDelay,
      );
    };

    const handleScroll = () => {
      scheduleScrollUpdate();
      scheduleSettledSection();
    };

    const handleScrollEnd = () => {
      updateScrollProgress();
      commitSettledSection();
    };

    const handleResize = () => {
      scheduleScrollUpdate();
      scheduleSettledSection();
    };

    document.documentElement.classList.add("portfolio-scroll-snap");
    updateScrollProgress();
    commitSettledSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      document.documentElement.classList.remove("portfolio-scroll-snap");
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(settleTimer);
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
