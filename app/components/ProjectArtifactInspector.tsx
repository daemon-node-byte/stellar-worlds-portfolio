"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProjectCaseStudySummary } from "../data/projectCaseStudyTypes";

type ProjectArtifactInspectorProps = {
  projects: readonly ProjectCaseStudySummary[];
};

/**
 * Presents project summaries as selectable holographic artifacts.
 * The full cards and dossier links remain the authoritative navigation.
 */
export function ProjectArtifactInspector({
  projects,
}: ProjectArtifactInspectorProps) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const activeProject =
    projects.find((project) => project.slug === activeSlug) ?? projects[0];

  if (!activeProject) return null;

  return (
    <section
      className={`planetary-interaction project-artifact project-artifact--${activeProject.theme}`}
      aria-labelledby="project-artifact-title"
    >
      <div className="project-artifact__visual" aria-hidden="true">
        <span className="project-artifact__orbit project-artifact__orbit--outer" />
        <span className="project-artifact__orbit project-artifact__orbit--inner" />
        <span className="project-artifact__object">
          <span />
        </span>
        <small>{activeProject.index}</small>
      </div>

      <div
        className="project-artifact__readout"
        id="project-artifact-readout"
        aria-live="polite"
      >
        <header className="planetary-interaction__header">
          <div>
            <span>Khepri artifact array</span>
            <h3 id="project-artifact-title">
              Holographic inspection
            </h3>
          </div>
          <span>{activeProject.orbit}</span>
        </header>
        <div className="project-artifact__summary">
          <div>
            <span>{activeProject.type}</span>
            <h3>{activeProject.title}</h3>
          </div>
          <p>{activeProject.excerpt}</p>
          <Link href={`/projects/${activeProject.slug}`}>
            Inspect dossier <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div
          className="project-artifact__controls"
          role="group"
          aria-label="Choose a project artifact"
        >
          {projects.map((project) => (
            <button
              aria-controls="project-artifact-readout"
              aria-pressed={project.slug === activeProject.slug}
              key={project.slug}
              onClick={() => setActiveSlug(project.slug)}
              onFocus={() => setActiveSlug(project.slug)}
              onPointerEnter={() => setActiveSlug(project.slug)}
              type="button"
            >
              <span>{project.index}</span>
              {project.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
