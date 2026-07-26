import type { Metadata } from "next";
import Link from "next/link";
import { ProjectOrbitalVisual } from "../components/ProjectOrbitalVisual";
import { getProjectCaseStudySummaries } from "../lib/projectCaseStudies";

export const metadata: Metadata = {
  title: "Project Dossiers — Josh McLain",
  description:
    "Orbital case studies covering Josh McLain's full-stack products, creative developer tools, and open-source work.",
};

export default function ProjectArchive() {
  const projects = getProjectCaseStudySummaries();

  return (
    <main className="project-archive">
      <p className="eyebrow">
        <span>Archive 03</span>
        Khepri / Selected work
      </p>
      <h1>
        Orbital
        <br />
        <em>dossiers.</em>
      </h1>
      <p className="project-archive__lede">
        Each project occupies its own orbit: a closer look at the problem,
        architecture, decisions, and next frontier behind the build.
      </p>

      <div className="project-archive__grid">
        {projects.map((project) => (
          <Link
            className={`project-archive-card project-archive-card--${project.theme}`}
            href={`/projects/${project.slug}`}
            key={project.slug}
          >
            <article>
              <div className="project-archive-card__meta">
                <span>{project.index}</span>
                <span>{project.orbit}</span>
                <span>{project.year}</span>
              </div>
              <ProjectOrbitalVisual
                compact
                orbit={project.orbit}
                theme={project.theme}
              />
              <p>{project.type}</p>
              <h2>{project.title}</h2>
              <p>{project.excerpt}</p>
              <ul aria-label={`${project.title} technologies`}>
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <span className="project-archive-card__action">
                Enter orbit <span aria-hidden="true">↗</span>
              </span>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
