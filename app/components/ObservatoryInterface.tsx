"use client";

import Link from "next/link";
import type { FieldNoteSummary } from "../data/fieldNoteTypes";
import type { ProjectCaseStudySummary } from "../data/projectCaseStudyTypes";
import {
  portfolioSections,
  type PortfolioSectionId,
} from "../data/portfolioContent";
import { ProjectCard } from "./ProjectCard";
import { SkillsConstellation } from "./SkillsConstellation";
import { SocialLinks } from "./SocialLinks";

type ObservatoryInterfaceProps = {
  activeSection: PortfolioSectionId;
  fieldNotes: readonly FieldNoteSummary[];
  onNavigate: (sectionId: PortfolioSectionId) => void;
  projects: readonly ProjectCaseStudySummary[];
};

function OriginSection({
  onNavigate,
}: Pick<ObservatoryInterfaceProps, "onNavigate">) {
  return (
    <div className="section-content section-content--hero">
      <p className="eyebrow">
        <span>Josh Codes</span>
        Full-stack portfolio / 2026
      </p>
      <h1>
        I build web
        <br />
        experiences <em>with a pulse.</em>
      </h1>
      <div className="hero-footer">
        <p className="section-intro">
          I&apos;m Josh McLain, a full-stack web developer shaping useful
          products, expressive interfaces, and cinematic digital worlds.
        </p>
        <button
          className="descent-control"
          type="button"
          onClick={() => onNavigate("about")}
        >
          <span>Begin descent</span>
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="section-content section-content--left section-content--about">
      <div className="about-profile">
        <p className="eyebrow">
          <span>Specimen 02</span>
          Virelia / About
        </p>
        <h2>Full-stack thinking. Front-end craft.</h2>
        <div className="section-copy">
          <p>
            I&apos;m a Phoenix-based software engineer with five-plus years of
            professional experience building across the stack and mentoring
            other developers.
          </p>
          <p>
            I turn complex ideas into maintainable web products—combining
            product judgment, dependable engineering, and a visual point of
            view.
          </p>
        </div>
        <div className="resume-actions" aria-label="Résumé actions">
          <a
            className="resume-action resume-action--primary"
            href="/resume/Josh-McLain-Resume.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="View Josh McLain's résumé as a PDF in a new tab"
          >
            <span>
              <span className="resume-action__meta">Résumé / PDF</span>
              View résumé
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="resume-action"
            href="/resume/Josh-McLain-Resume.docx"
            download
          >
            <span>
              <span className="resume-action__meta">Original / DOCX</span>
              Download copy
            </span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <dl className="capability-list">
          <div>
            <dt>01</dt>
            <dd>Full-stack web applications</dd>
          </div>
          <div>
            <dt>02</dt>
            <dd>Interactive interfaces and 3D</dd>
          </div>
          <div>
            <dt>03</dt>
            <dd>Automation and AI systems</dd>
          </div>
        </dl>
      </div>
      <SkillsConstellation />
    </div>
  );
}

function ProjectsSection({
  projects,
}: Pick<ObservatoryInterfaceProps, "projects">) {
  return (
    <div className="section-content section-content--wide">
      <div className="section-heading">
        <p className="eyebrow">
          <span>Specimen 03</span>
          Khepri / Selected work
        </p>
        <h2>Selected builds.</h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.slug} />
        ))}
      </div>
      <Link className="project-archive-link" href="/projects">
        Open the orbital dossier archive <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}

function NotesSection({
  fieldNotes,
}: Pick<ObservatoryInterfaceProps, "fieldNotes">) {
  return (
    <div className="section-content section-content--right">
      <p className="eyebrow">
        <span>Specimen 04</span>
        Calyx / Field notes
      </p>
      <h2>Notes from the edge.</h2>
      <div className="notes-list">
        {fieldNotes.map((note, index) => (
          <Link href={`/field-notes/${note.slug}`} key={note.slug}>
            <article>
              <div>
                <span>{note.displayDate}</span>
                <span>{note.category}</span>
              </div>
              <h3>{note.title}</h3>
              <span aria-hidden="true">0{index + 1} ↗</span>
            </article>
          </Link>
        ))}
      </div>
      <Link className="notes-index-link" href="/field-notes">
        Open the complete field archive <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="section-content section-content--contact">
      <p className="eyebrow">
        <span>Specimen 05</span>
        Nox / Contact
      </p>
      <h2>Send a signal.</h2>
      <p className="contact-copy">
        Have an ambitious idea, a difficult interface, or a world that needs a
        pulse? I&apos;m available for full-stack product work and select
        collaborations.
      </p>
      <a
        className="contact-link"
        href="mailto:me@joshmclain.com?subject=Let%27s%20build%20something"
      >
        <span>me@joshmclain.com</span>
        <span aria-hidden="true">↗</span>
      </a>
      <SocialLinks />
      <div className="contact-meta">
        <span>Transmission window</span>
        <span>Phoenix, Arizona / Remote</span>
      </div>
    </div>
  );
}

export function ObservatoryInterface({
  activeSection,
  fieldNotes,
  onNavigate,
  projects,
}: ObservatoryInterfaceProps) {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip cinematic introduction
      </a>

      <header className="site-header">
        <button
          type="button"
          className="wordmark"
          onClick={() => onNavigate("origin")}
          aria-label="Return to Josh McLain home"
        >
          <span>JM</span>
          <span>
            Josh McLain
            <br />
            Full-stack developer
          </span>
        </button>
        <nav aria-label="Portfolio navigation">
          {portfolioSections.slice(1).map((section) => (
            <button
              type="button"
              key={section.id}
              className={activeSection === section.id ? "is-active" : ""}
              aria-current={activeSection === section.id ? "page" : undefined}
              onClick={() => onNavigate(section.id)}
            >
              <span>{section.index}</span>
              {section.navLabel}
            </button>
          ))}
        </nav>
        <div className="system-status" aria-label="Josh is available">
          <span />
          Available / remote
        </div>
      </header>

      <aside className="coordinate-rail" aria-hidden="true">
        <span>33° 26&apos; 54.0&quot; N</span>
        <span>112° 04&apos; 27.0&quot; W</span>
      </aside>

      <div className="active-specimen" aria-hidden="true">
        {portfolioSections.map((section) => (
          <span
            key={section.id}
            className={activeSection === section.id ? "is-active" : ""}
          >
            {section.index} / {section.specimen}
          </span>
        ))}
      </div>

      <div className="content-layer">
        {portfolioSections.map((section) => (
          <section
            className={`portfolio-section portfolio-section--${section.id} ${
              activeSection === section.id ? "is-active" : ""
            }`}
            id={section.id}
            key={section.id}
            aria-label={`${section.navLabel}: ${section.specimen}`}
          >
            {section.id === "origin" ? (
              <OriginSection onNavigate={onNavigate} />
            ) : null}
            {section.id === "about" ? <AboutSection /> : null}
            {section.id === "projects" ? (
              <ProjectsSection projects={projects} />
            ) : null}
            {section.id === "notes" ? (
              <NotesSection fieldNotes={fieldNotes} />
            ) : null}
            {section.id === "contact" ? <ContactSection /> : null}
          </section>
        ))}
      </div>

      <div className="viewport-frame" aria-hidden="true">
        <span className="corner corner--tl" />
        <span className="corner corner--tr" />
        <span className="corner corner--bl" />
        <span className="corner corner--br" />
      </div>
      <div className="scanlines" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
