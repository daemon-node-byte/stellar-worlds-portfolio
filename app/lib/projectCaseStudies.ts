/**
 * Content-layer loader for project case-study Markdown.
 *
 * Files in app/content/projects are the authoritative project source. This
 * server-only module validates their YAML front matter and exposes summaries
 * to the homepage plus complete documents to dynamic project routes.
 */

import matter from "gray-matter";
import {
  projectThemes,
  type ProjectCaseStudy,
  type ProjectCaseStudySummary,
  type ProjectTheme,
} from "../data/projectCaseStudyTypes";
import {
  getDocumentSlug,
  readOptionalHttpUrl,
  readRequiredString,
  readRequiredStringList,
} from "./markdownContent";

const projectFiles = import.meta.glob("../content/projects/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function readProjectTheme(
  value: unknown,
  sourcePath: string,
): ProjectTheme {
  const theme = readRequiredString(value, "theme", sourcePath);

  if (!projectThemes.includes(theme as ProjectTheme)) {
    throw new Error(
      `${sourcePath} must use one of these themes: ${projectThemes.join(", ")}.`,
    );
  }

  return theme as ProjectTheme;
}

function parseProjectCaseStudy(
  sourcePath: string,
  rawDocument: string,
): ProjectCaseStudy {
  const { data, content } = matter(rawDocument);
  const index = readRequiredString(data.index, "index", sourcePath);

  if (!/^\d{2}$/.test(index)) {
    throw new Error(`${sourcePath} must use a two-digit "index" value.`);
  }

  return {
    slug: getDocumentSlug(sourcePath),
    index,
    title: readRequiredString(data.title, "title", sourcePath),
    year: readRequiredString(data.year, "year", sourcePath),
    type: readRequiredString(data.type, "type", sourcePath),
    excerpt: readRequiredString(data.excerpt, "excerpt", sourcePath),
    role: readRequiredString(data.role, "role", sourcePath),
    status: readRequiredString(data.status, "status", sourcePath),
    orbit: readRequiredString(data.orbit, "orbit", sourcePath),
    theme: readProjectTheme(data.theme, sourcePath),
    tags: readRequiredStringList(data.tags, "tags", sourcePath),
    liveUrl: readOptionalHttpUrl(data.liveUrl, "liveUrl", sourcePath),
    sourceUrl: readOptionalHttpUrl(data.sourceUrl, "sourceUrl", sourcePath),
    body: content.trim(),
  };
}

const projectCaseStudies = Object.entries(projectFiles)
  .map(([sourcePath, rawDocument]) =>
    parseProjectCaseStudy(sourcePath, rawDocument),
  )
  .sort((left, right) => left.index.localeCompare(right.index));

/** Returns every complete case study in display order. */
export function getProjectCaseStudies(): readonly ProjectCaseStudy[] {
  return projectCaseStudies;
}

/** Returns card-safe project metadata without the Markdown body. */
export function getProjectCaseStudySummaries(): readonly ProjectCaseStudySummary[] {
  return projectCaseStudies.map(({ body: _body, ...summary }) => summary);
}

/** Resolves a single case study from its filename-derived route slug. */
export function getProjectCaseStudyBySlug(
  slug: string,
): ProjectCaseStudy | undefined {
  return projectCaseStudies.find((project) => project.slug === slug);
}
