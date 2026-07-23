import type { Metadata } from "next";
import Link from "next/link";
import { getFieldNoteSummaries } from "../lib/fieldNotes";

export const metadata: Metadata = {
  title: "Field Notes — Josh McLain",
  description:
    "Writing about web development, interactive systems, rendering, and the design decisions behind digital experiences.",
};

export default function FieldNotesIndex() {
  const notes = getFieldNoteSummaries();

  return (
    <main className="field-notes-index">
      <p className="eyebrow">
        <span>Archive 04</span>
        Calyx / Field notes
      </p>
      <h1>
        Notes from
        <br />
        the <em>edge.</em>
      </h1>
      <p className="field-notes-lede">
        Working notes on full-stack development, creative systems, interface
        design, and rendering digital worlds with intention.
      </p>

      <div className="field-notes-index__list">
        {notes.map((note, index) => (
          <Link href={`/field-notes/${note.slug}`} key={note.slug}>
            <span>0{index + 1}</span>
            <div>
              <p>
                {note.displayDate} / {note.category}
              </p>
              <h2>{note.title}</h2>
              <p>{note.excerpt}</p>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
