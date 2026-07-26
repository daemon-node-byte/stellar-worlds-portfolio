import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { FaGithub } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import remarkGfm from "remark-gfm";
import { ProjectOrbitalVisual } from "../../components/ProjectOrbitalVisual";
import {
  getProjectCaseStudyBySlug,
  getProjectCaseStudySummaries,
} from "../../lib/projectCaseStudies";

type ProjectCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectCaseStudySummaries().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug(slug);

  if (!project) {
    return notFound();
  }

  return {
    title: `${project.title} Case Study — Josh McLain`,
    description: project.excerpt,
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: ProjectCaseStudyPageProps) {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug(slug);

  if (!project) {
    return notFound();
  }

  const projectSummaries = getProjectCaseStudySummaries();
  const projectIndex = projectSummaries.findIndex(
    (candidate) => candidate.slug === project.slug,
  );
  const nextProject =
    projectSummaries[(projectIndex + 1) % projectSummaries.length];

  return (
    <main
      className={`project-dossier project-dossier--${project.theme}`}
    >
      <Link className="project-dossier__back" href="/projects">
        <span aria-hidden="true">←</span> All project dossiers
      </Link>

      <section className="project-dossier__hero">
        <div className="project-dossier__intro">
          <p className="eyebrow">
            <span>Case study {project.index}</span>
            {project.orbit} / {project.status}
          </p>
          <h1>{project.title}</h1>
          <p className="project-dossier__excerpt">{project.excerpt}</p>
          <div className="project-dossier__actions">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Live project <FiArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
            {project.sourceUrl ? (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                <FaGithub aria-hidden="true" /> Source code
              </a>
            ) : null}
          </div>
        </div>
        <ProjectOrbitalVisual
          orbit={project.orbit}
          theme={project.theme}
        />
      </section>

      <dl className="project-dossier__telemetry">
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt>Orbit</dt>
          <dd>{project.orbit}</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
      </dl>

      <article className="project-dossier__document">
        <div className="project-dossier__document-label">
          <span>Mission record</span>
          <span>{project.type}</span>
        </div>
        <div className="field-note-prose project-dossier__prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.body}
          </ReactMarkdown>
        </div>
      </article>

      {nextProject ? (
        <Link
          className="project-dossier__next"
          href={`/projects/${nextProject.slug}`}
        >
          <span>Next orbital dossier</span>
          <strong>{nextProject.title}</strong>
          <span aria-hidden="true">↗</span>
        </Link>
      ) : null}
    </main>
  );
}
