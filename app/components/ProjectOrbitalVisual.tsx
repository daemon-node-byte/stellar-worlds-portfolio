import type { ProjectTheme } from "../data/projectCaseStudyTypes";

type ProjectOrbitalVisualProps = {
  compact?: boolean;
  orbit: string;
  theme: ProjectTheme;
};

export function ProjectOrbitalVisual({
  compact = false,
  orbit,
  theme,
}: ProjectOrbitalVisualProps) {
  return (
    <div
      className={`project-orbital-visual project-orbital-visual--${theme} ${
        compact ? "project-orbital-visual--compact" : ""
      }`}
      aria-hidden="true"
    >
      <span className="project-orbital-visual__orbit project-orbital-visual__orbit--outer" />
      <span className="project-orbital-visual__orbit project-orbital-visual__orbit--inner" />
      <span className="project-orbital-visual__body">
        <span className="project-orbital-visual__terminator" />
      </span>
      <span className="project-orbital-visual__moon" />
      <span className="project-orbital-visual__signal" />
      <span className="project-orbital-visual__label">{orbit}</span>
    </div>
  );
}
