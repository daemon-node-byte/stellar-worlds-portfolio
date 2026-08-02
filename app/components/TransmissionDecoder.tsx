"use client";

import Link from "next/link";
import { useState } from "react";
import type { FieldNoteSummary } from "../data/fieldNoteTypes";
import { useTimedInteraction } from "./useTimedInteraction";

type TransmissionDecoderProps = {
  notes: readonly FieldNoteSummary[];
  reducedMotion: boolean;
};

/**
 * Lets visitors tune and decode a field-note preview before opening it.
 * The normal note list remains available as direct navigation.
 */
export function TransmissionDecoder({
  notes,
  reducedMotion,
}: TransmissionDecoderProps) {
  const [selectedSlug, setSelectedSlug] = useState(notes[0]?.slug ?? "");
  const { reset, start, status } = useTimedInteraction({
    duration: 1_250,
    reducedMotion,
  });
  const selectedNote =
    notes.find((note) => note.slug === selectedSlug) ?? notes[0];

  if (!selectedNote) return null;

  const selectTransmission = (slug: string) => {
    if (slug === selectedNote.slug) return;
    reset();
    setSelectedSlug(slug);
  };

  return (
    <section
      className={`planetary-interaction transmission-decoder is-${status}`}
      aria-labelledby="transmission-decoder-title"
    >
      <header className="planetary-interaction__header">
        <div>
          <span>Calyx listening post</span>
          <h3 id="transmission-decoder-title">
            Intercepted transmissions
          </h3>
        </div>
        <span>{selectedNote.readingTime}</span>
      </header>

      <div
        className="transmission-decoder__channels"
        role="group"
        aria-label="Select an intercepted field note"
      >
        {notes.map((note, index) => (
          <button
            aria-controls="transmission-decoder-output"
            aria-pressed={note.slug === selectedNote.slug}
            key={note.slug}
            onClick={() => selectTransmission(note.slug)}
            onFocus={() => selectTransmission(note.slug)}
            onPointerEnter={() => selectTransmission(note.slug)}
            type="button"
          >
            CH-{String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div
        className="transmission-decoder__output"
        id="transmission-decoder-output"
        aria-live="polite"
      >
        <div className="transmission-decoder__noise" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div>
          <span>
            {selectedNote.displayDate} / {selectedNote.category}
          </span>
          <h3>{selectedNote.title}</h3>
          <p>
            {status === "complete"
              ? selectedNote.excerpt
              : status === "running"
                ? "Reconstructing fragmented data packets…"
                : "Encrypted carrier acquired. Decode the signal to reveal its field report."}
          </p>
        </div>
      </div>

      <div className="transmission-decoder__actions">
        <button
          className="planetary-interaction__action"
          disabled={status === "running"}
          onClick={start}
          type="button"
        >
          {status === "running"
            ? "Decoding…"
            : status === "complete"
              ? "Decode again"
              : "Decode transmission"}
          <span aria-hidden="true">⌁</span>
        </button>
        {status === "complete" ? (
          <Link href={`/field-notes/${selectedNote.slug}`}>
            Open field report <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
