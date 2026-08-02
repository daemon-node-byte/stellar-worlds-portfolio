"use client";

import { useTimedInteraction } from "./useTimedInteraction";

type ProfileScannerProps = {
  reducedMotion: boolean;
};

/**
 * Adds an optional résumé scan to the About planet without gating its links.
 * It owns only a short visual sequence and exposes the same profile facts.
 */
export function ProfileScanner({ reducedMotion }: ProfileScannerProps) {
  const { start, status } = useTimedInteraction({
    duration: 1_450,
    reducedMotion,
  });
  const statusMessage =
    status === "running"
      ? "Mapping engineering profile"
      : status === "complete"
        ? "Identity confirmed"
        : "Profile signature available";

  return (
    <section
      className={`planetary-interaction profile-scanner is-${status}`}
      aria-labelledby="profile-scanner-title"
    >
      <header className="planetary-interaction__header">
        <div>
          <span>Virelia biometric array</span>
          <h3 id="profile-scanner-title">Résumé scanner</h3>
        </div>
        <span aria-live="polite">{statusMessage}</span>
      </header>

      <div className="profile-scanner__body">
        <div className="profile-scanner__viewport" aria-hidden="true">
          <span className="profile-scanner__reticle" />
          <span className="profile-scanner__portrait">
            <span />
          </span>
          <span className="profile-scanner__sweep" />
        </div>

        <div className="profile-scanner__console">
          <dl className="capability-list profile-scanner__capabilities">
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
          <button
            className="planetary-interaction__action"
            disabled={status === "running"}
            onClick={start}
            type="button"
          >
            {status === "running"
              ? "Scanning profile…"
              : status === "complete"
                ? "Scan again"
                : "Run profile scan"}
            <span aria-hidden="true">◎</span>
          </button>
        </div>
      </div>
    </section>
  );
}
