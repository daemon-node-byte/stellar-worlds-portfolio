import matter from "gray-matter";
import type {
  FieldNote,
  FieldNoteSummary,
} from "../data/fieldNoteTypes";
import {
  getDocumentSlug,
  readRequiredString,
} from "./markdownContent";

const fieldNoteFiles = import.meta.glob("../content/field-notes/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function parseFieldNote(sourcePath: string, rawDocument: string): FieldNote {
  const { data, content } = matter(rawDocument);

  return {
    slug: getDocumentSlug(sourcePath),
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
