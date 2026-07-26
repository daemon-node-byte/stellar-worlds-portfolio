import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import type { ProjectCaseStudySummary } from "../data/projectCaseStudyTypes";

type ProjectCardProps = {
  project: ProjectCaseStudySummary;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__meta">
        <span>{project.index}</span>
        <span>{project.year}</span>
      </div>
      <Link
        className="project-card__main-link"
        href={`/projects/${project.slug}`}
        aria-label={`Read the ${project.title} case study`}
      >
        <p>{project.type}</p>
        <span className="project-card__title">
          <h3>{project.title}</h3>
          <FiArrowUpRight aria-hidden="true" />
        </span>
        <p className="project-card__description">{project.excerpt}</p>
        <span className="project-card__dossier-link">
          Orbital dossier <span aria-hidden="true">↗</span>
        </span>
      </Link>
      <div>
        <ul aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="project-card__actions">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Live project
              <FiArrowUpRight aria-hidden="true" />
            </a>
          ) : null}
          {project.sourceUrl ? (
            <a href={project.sourceUrl} target="_blank" rel="noreferrer">
              <FaGithub aria-hidden="true" />
              Source code
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
