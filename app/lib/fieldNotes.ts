import matter from "gray-matter";
import type {
  FieldNote,
  FieldNoteSummary,
} from "../data/fieldNoteTypes";

const fieldNoteFiles = import.meta.glob("../content/field-notes/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function readRequiredString(
  value: unknown,
  field: string,
  sourcePath: string,
) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${sourcePath} is missing a valid "${field}" value.`);
  }

  return value.trim();
}

function getSlug(sourcePath: string) {
  const fileName = sourcePath.split("/").at(-1) ?? "";
  const slug = fileName.replace(/\.md$/, "");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `${sourcePath} must use a lowercase, hyphenated filename for its URL slug.`,
    );
  }

  return slug;
}

function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function parseFieldNote(sourcePath: string, rawDocument: string): FieldNote {
  const { data, content } = matter(rawDocument);

  return {
    slug: getSlug(sourcePath),
    title: readRequiredString(data.title, "title", sourcePath),
    excerpt: readRequiredString(data.excerpt, "excerpt", sourcePath),
    date: readRequiredString(data.date, "date", sourcePath),
    displayDate: readRequiredString(
      data.displayDate,
      "displayDate",
      sourcePath,
    ),
    category: readRequiredString(data.category, "category", sourcePath),
    readingTime:
      typeof data.readingTime === "string" && data.readingTime.trim()
        ? data.readingTime.trim()
        : estimateReadingTime(content),
    body: content.trim(),
  };
}

const fieldNotes = Object.entries(fieldNoteFiles)
  .map(([sourcePath, rawDocument]) =>
    parseFieldNote(sourcePath, rawDocument),
  )
  .sort((left, right) => right.date.localeCompare(left.date));

export function getFieldNotes(): readonly FieldNote[] {
  return fieldNotes;
}

export function getFieldNoteSummaries(): readonly FieldNoteSummary[] {
  return fieldNotes.map(({ body: _body, ...summary }) => summary);
}

export function getFieldNoteBySlug(slug: string): FieldNote | undefined {
  return fieldNotes.find((note) => note.slug === slug);
}
