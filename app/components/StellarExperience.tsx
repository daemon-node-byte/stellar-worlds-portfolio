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
  canScrollWithinSection,
  calculateScrollProgress,
  findAdjacentSection,
  findClosestSection,
  type SectionViewport,
} from "./scrollSnapMath";

const scrollSettleDelay = 180;
const wheelDeltaThreshold = 18;
const smoothScrollFallback = 1_200;

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
  const activeSectionRef = useRef<PortfolioSectionId>("origin");
  const transitioningRef = useRef(false);
  const transitionTimerRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] =
    useState<PortfolioSectionId>("origin");

  const finishTransition = useCallback(() => {
    window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = 0;
    wheelDeltaRef.current = 0;
    transitioningRef.current = false;
  }, []);

  const handleNavigate = useCallback(
    (sectionId: PortfolioSectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      transitioningRef.current = true;
      window.clearTimeout(transitionTimerRef.current);
      section.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      transitionTimerRef.current = window.setTimeout(
        finishTransition,
        reducedMotion ? scrollSettleDelay : smoothScrollFallback,
      );
    },
    [finishTransition, reducedMotion],
  );

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

      activeSectionRef.current = settledSection;
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
      finishTransition();
    };

    const handleResize = () => {
      scheduleScrollUpdate();
      scheduleSettledSection();
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      ) {
        return;
      }

      if (transitioningRef.current) {
        event.preventDefault();
        return;
      }

      const inputDirection = event.deltaY > 0 ? 1 : -1;
      const currentSection = document.getElementById(
        activeSectionRef.current,
      );
      if (currentSection) {
        const bounds = currentSection.getBoundingClientRect();
        if (
          canScrollWithinSection(
            { top: bounds.top, height: bounds.height },
            window.innerHeight,
            inputDirection,
          )
        ) {
          return;
        }
      }

      event.preventDefault();
      const deltaScale =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;
      wheelDeltaRef.current += event.deltaY * deltaScale;
      if (Math.abs(wheelDeltaRef.current) < wheelDeltaThreshold) return;

      const direction = wheelDeltaRef.current > 0 ? 1 : -1;
      wheelDeltaRef.current = 0;
      const destination = findAdjacentSection(
        portfolioSections,
        activeSectionRef.current,
        direction,
      );
      if (destination === activeSectionRef.current) return;

      handleNavigate(destination);
    };

    document.documentElement.classList.add("portfolio-scroll-snap");
    updateScrollProgress();
    commitSettledSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.documentElement.classList.remove("portfolio-scroll-snap");
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      window.clearTimeout(settleTimer);
      finishTransition();
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [finishTransition, handleNavigate]);

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
