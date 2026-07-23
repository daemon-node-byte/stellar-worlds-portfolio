import { FaGithub } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import type { PortfolioProject } from "../data/portfolioContent";

type ProjectCardProps = {
  project: PortfolioProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const primaryUrl = project.liveUrl ?? project.sourceUrl;

  return (
    <article className="project-card">
      <div className="project-card__meta">
        <span>{project.index}</span>
        <span>{project.year}</span>
      </div>
      <a
        className="project-card__main-link"
        href={primaryUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.name}`}
      >
        <p>{project.type}</p>
        <span className="project-card__title">
          <h3>{project.name}</h3>
          <FiArrowUpRight aria-hidden="true" />
        </span>
        <p className="project-card__description">{project.description}</p>
      </a>
      <div>
        <ul aria-label={`${project.name} technologies`}>
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
