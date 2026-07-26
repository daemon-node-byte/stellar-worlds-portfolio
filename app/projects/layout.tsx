import Link from "next/link";
import type { ReactNode } from "react";
import { SocialLinks } from "../components/SocialLinks";

export default function ProjectsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="project-route-shell">
      <div className="project-route-cosmos" aria-hidden="true">
        <span className="project-route-cosmos__star" />
        <span className="project-route-cosmos__orbit project-route-cosmos__orbit--one" />
        <span className="project-route-cosmos__orbit project-route-cosmos__orbit--two" />
      </div>

      <header className="project-route-header">
        <Link className="project-route-wordmark" href="/#origin">
          <span>JM</span>
          <span>
            Josh McLain
            <br />
            Full-stack developer
          </span>
        </Link>
        <nav aria-label="Project case-study navigation">
          <Link href="/projects">All dossiers</Link>
          <Link href="/#projects">
            Return to Khepri <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      {children}

      <footer className="project-route-footer">
        <span>Josh Codes / Orbital project archive</span>
        <SocialLinks compact />
      </footer>

      <div className="viewport-frame" aria-hidden="true">
        <span className="corner corner--tl" />
        <span className="corner corner--tr" />
        <span className="corner corner--bl" />
        <span className="corner corner--br" />
      </div>
      <div className="scanlines" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
