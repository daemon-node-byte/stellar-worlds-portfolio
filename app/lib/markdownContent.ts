/**
 * Shared validation for file-driven Markdown content.
 *
 * This module owns only front-matter primitives and filename-to-slug rules.
 * Field Notes and project case studies keep their domain-specific parsing in
 * separate loaders.
 */

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function readRequiredString(
  value: unknown,
  field: string,
  sourcePath: string,
) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${sourcePath} is missing a valid "${field}" value.`);
  }

  return value.trim();
}

export function readRequiredStringList(
  value: unknown,
  field: string,
  sourcePath: string,
) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(
      `${sourcePath} is missing a valid "${field}" string list.`,
    );
  }

  return value.map((item) => item.trim());
}

export function readOptionalHttpUrl(
  value: unknown,
  field: string,
  sourcePath: string,
) {
  if (value === undefined || value === null || value === "") return undefined;

  const urlValue = readRequiredString(value, field, sourcePath);
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlValue);
  } catch {
    throw new Error(`${sourcePath} has an invalid "${field}" URL.`);
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error(`${sourcePath} must use an HTTP(S) "${field}" URL.`);
  }

  return parsedUrl.toString();
}

export function getDocumentSlug(sourcePath: string) {
  const fileName = sourcePath.split("/").at(-1) ?? "";
  const slug = fileName.replace(/\.md$/, "");

  if (!slugPattern.test(slug)) {
    throw new Error(
      `${sourcePath} must use a lowercase, hyphenated filename for its URL slug.`,
    );
  }

  return slug;
}
