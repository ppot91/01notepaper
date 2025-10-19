'use client';

import clsx from "clsx";

type ToolbarProps = {
  isStarred: boolean;
  onToggleStar: () => void;
  onSave: () => void;
  onDelete: () => void;
  canSave: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
};

export function Toolbar({ isStarred, onToggleStar, onSave, onDelete, canSave, isSaving, lastSavedAt }: ToolbarProps) {
  const savedLabel = lastSavedAt
    ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Not yet saved";

  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleStar}
          className={clsx(
            "border px-4 py-2 font-serif text-sm uppercase tracking-[0.3em] transition-colors",
            isStarred ? "border-black bg-black text-white" : "border-black/30 hover:border-black hover:bg-black hover:text-white"
          )}
          aria-pressed={isStarred}
        >
          {isStarred ? "★ Starred" : "☆ Star"}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className={clsx(
            "border px-4 py-2 font-serif text-sm uppercase tracking-[0.3em] transition-colors",
            canSave
              ? "border-black bg-black text-white hover:bg-white hover:text-black"
              : "border-black/20 text-black/40"
          )}
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
      <p className="font-sans text-xs uppercase tracking-[0.3em] text-black/50">
        {isSaving ? "Saving…" : savedLabel}
      </p>
      <button
        type="button"
        onClick={onDelete}
        className="border border-black/20 px-4 py-2 font-serif text-sm uppercase tracking-[0.3em] text-black transition-colors hover:border-red-500 hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
