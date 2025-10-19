'use client';

import { format } from "date-fns";
import clsx from "clsx";
import type { Note } from "@/types/note";

type NoteListItemProps = {
  note: Note;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export function NoteListItem({ note, isActive, onSelect }: NoteListItemProps) {
  const title = note.title.trim() || "Untitled";
  const preview = note.content.replace(/[#*_>\-\n]/g, " ").slice(0, 120).trim() || "No content yet.";
  const formattedDate = format(new Date(note.updated_at), "MMM d, yyyy");

  return (
    <button
      type="button"
      onClick={() => onSelect(note.id)}
      className={clsx(
        "w-full border-b border-black/10 px-5 py-4 text-left transition-colors",
        isActive ? "bg-black text-white" : "hover:bg-neutral-100"
      )}
      aria-pressed={isActive}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-serif text-xl leading-tight">{title}</p>
        {note.starred ? <span className="text-lg" aria-hidden="true">★</span> : null}
      </div>
      <p className={clsx("mt-2 text-sm uppercase tracking-[0.3em]", isActive ? "text-white/70" : "text-black/60")}>
        {formattedDate}
      </p>
      <p className={clsx("mt-3 text-sm leading-relaxed", isActive ? "text-white/80" : "text-black/70")}>{preview}</p>
    </button>
  );
}
