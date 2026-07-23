"use client";

import {
  fieldNotes,
  portfolioSections,
  selectedProjects,
  type PortfolioSectionId,
} from "../data/portfolioContent";

type ObservatoryInterfaceProps = {
  activeSection: PortfolioSectionId;
  onNavigate: (sectionId: PortfolioSectionId) => void;
};

function OriginSection({
  onNavigate,
}: Pick<ObservatoryInterfaceProps, "onNavigate">) {
  return (
    <div className="section-content section-content--hero">
      <p className="eyebrow">
        <span>Signal 01</span>
        Portfolio / 2026
      </p>
      <h1>
        I build digital
        <br />
        worlds <em>with a pulse.</em>
      </h1>
      <div className="hero-footer">
        <p className="section-intro">
          A creative developer shaping strange interfaces, tactile systems, and
          cinematic experiences.
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
    <div className="section-content section-content--left">
      <p className="eyebrow">
        <span>Specimen 02</span>
        Virelia / About
      </p>
      <h2>Built between systems and stories.</h2>
      <div className="section-copy">
        <p>
          I work where product thinking, visual design, and engineering overlap.
          The goal is not novelty for its own sake—it is making digital work feel
          unmistakably alive.
        </p>
        <p>
          From early concept to the final interaction pass, I translate complex
          ideas into experiences with clarity, atmosphere, and a point of view.
        </p>
      </div>
      <dl className="capability-list">
        <div>
          <dt>01</dt>
          <dd>Creative development</dd>
        </div>
        <div>
          <dt>02</dt>
          <dd>Interactive systems</dd>
        </div>
        <div>
          <dt>03</dt>
          <dd>Visual direction</dd>
        </div>
      </dl>
    </div>
  );
}

function ProjectsSection() {
  return (
    <div className="section-content section-content--wide">
      <div className="section-heading">
        <p className="eyebrow">
          <span>Specimen 03</span>
          Khepri / Selected work
        </p>
        <h2>Selected transmissions.</h2>
      </div>
      <div className="project-grid">
        {selectedProjects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className="project-card__meta">
              <span>{project.index}</span>
              <span>{project.year}</span>
            </div>
            <div>
              <p>{project.type}</p>
              <h3>{project.name}</h3>
              <p className="project-card__description">
                {project.description}
              </p>
            </div>
            <ul aria-label={`${project.name} disciplines`}>
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function NotesSection() {
  return (
    <div className="section-content section-content--right">
      <p className="eyebrow">
        <span>Specimen 04</span>
        Calyx / Field notes
      </p>
      <h2>Notes from the edge.</h2>
      <div className="notes-list">
        {fieldNotes.map((note, index) => (
          <article key={note.title}>
            <div>
              <span>{note.date}</span>
              <span>{note.category}</span>
            </div>
            <h3>{note.title}</h3>
            <span aria-hidden="true">0{index + 1} ↗</span>
          </article>
        ))}
      </div>
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
        pulse? I am available for select collaborations.
      </p>
      <a
        className="contact-link"
        href="mailto:hello@xenobiology.studio?subject=New%20signal"
      >
        <span>hello@xenobiology.studio</span>
        <span aria-hidden="true">↗</span>
      </a>
      <div className="contact-meta">
        <span>Transmission window</span>
        <span>Open / Q3 2026</span>
      </div>
    </div>
  );
}

export function ObservatoryInterface({
  activeSection,
  onNavigate,
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
          aria-label="Return to origin"
        >
          <span>XO</span>
          <span>
            Xenobiology
            <br />
            Observatory
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
        <div className="system-status" aria-label="System online">
          <span />
          System live
        </div>
      </header>

      <aside className="coordinate-rail" aria-hidden="true">
        <span>34° 02&apos; 17.1&quot; N</span>
        <span>118° 14&apos; 37.8&quot; W</span>
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
            {section.id === "projects" ? <ProjectsSection /> : null}
            {section.id === "notes" ? <NotesSection /> : null}
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
