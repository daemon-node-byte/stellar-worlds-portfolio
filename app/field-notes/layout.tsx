import Link from "next/link";
import type { ReactNode } from "react";
import { SocialLinks } from "../components/SocialLinks";

export default function FieldNotesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="field-notes-shell">
      <div className="field-notes-cosmos" aria-hidden="true">
        <span className="field-notes-planet" />
        <span className="field-notes-orbit field-notes-orbit--one" />
        <span className="field-notes-orbit field-notes-orbit--two" />
      </div>

      <header className="field-notes-header">
        <Link className="field-notes-wordmark" href="/#origin">
          <span>JM</span>
          <span>
            Josh McLain
            <br />
            Full-stack developer
          </span>
        </Link>
        <Link className="field-notes-return" href="/#notes">
          Return to orbit <span aria-hidden="true">↗</span>
        </Link>
      </header>

      {children}

      <footer className="field-notes-footer">
        <span>Josh Codes / Field Notes</span>
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
