import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getFieldNoteBySlug,
  getFieldNoteSummaries,
} from "../../lib/fieldNotes";

type FieldNotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getFieldNoteSummaries().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: FieldNotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);

  if (!note) {
    return notFound();
  }

  return {
    title: `${note.title} — Josh McLain`,
    description: note.excerpt,
  };
}

export default async function FieldNotePage({
  params,
}: FieldNotePageProps) {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);

  if (!note) {
    return notFound();
  }

  return (
    <main className="field-note-document">
      <Link className="field-note-document__index-link" href="/field-notes">
        <span aria-hidden="true">←</span> All field notes
      </Link>
      <article>
        <header>
          <p className="eyebrow">
            <span>{note.category}</span>
            Calyx / Document {note.displayDate}
          </p>
          <h1>{note.title}</h1>
          <p className="field-note-document__excerpt">{note.excerpt}</p>
          <div className="field-note-document__meta">
            <span>{note.displayDate}</span>
            <span>{note.readingTime}</span>
          </div>
        </header>
        <div className="field-note-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.body}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
