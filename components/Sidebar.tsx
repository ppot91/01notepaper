'use client';

import { useEffect, useRef } from "react";
import clsx from "clsx";
import type { Note } from "@/types/note";
import { NoteListItem } from "./NoteListItem";

type SidebarProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  starredOnly: boolean;
  onStarToggle: (value: boolean) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

export function Sidebar({
  notes,
  selectedNoteId,
  onSelect,
  onCreate,
  search,
  onSearchChange,
  starredOnly,
  onStarToggle,
  onLoadMore,
  hasMore,
  isLoading
}: SidebarProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = listRef.current;
    const sentinel = sentinelRef.current;

    if (!container || !sentinel) {
      return;
    }

    if (!hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { root: container, rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  return (
    <aside className="flex w-80 flex-col border-r border-black/10 bg-white">
      <div className="border-b border-black/10 px-6 py-6">
        <p className="font-serif text-2xl uppercase tracking-[0.5em]">Note Paper</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-black/60">A daily ledger for thoughts</p>
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 w-full border border-black bg-black px-4 py-2 font-serif text-base uppercase tracking-[0.4em] text-white transition-colors hover:bg-white hover:text-black"
        >
          New Note
        </button>
      </div>
      <div className="border-b border-black/10 px-6 py-4">
        <label className="block text-xs uppercase tracking-[0.3em] text-black/60">
          Search
          <input
            type="search"
            id="notepaper-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Press Ctrl / Cmd + F"
            className="mt-2 w-full border border-black/20 bg-white px-3 py-2 font-sans text-sm focus:border-black/40 focus:outline-none"
          />
        </label>
        <div className="mt-4 flex gap-2 text-xs uppercase tracking-[0.3em]">
          <button
            type="button"
            onClick={() => onStarToggle(false)}
            className={clsx(
              "flex-1 border px-3 py-2 transition-colors",
              !starredOnly ? "border-black bg-black text-white" : "border-black/20 hover:border-black/40"
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onStarToggle(true)}
            className={clsx(
              "flex-1 border px-3 py-2 transition-colors",
              starredOnly ? "border-black bg-black text-white" : "border-black/20 hover:border-black/40"
            )}
          >
            ★ Starred
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto">
        {notes.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="font-serif text-lg text-black/50">No notes yet — create your first.</p>
          </div>
        ) : (
          <>
            {notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isActive={note.id === selectedNoteId}
                onSelect={onSelect}
              />
            ))}
            <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
            {isLoading ? (
              <div className="px-6 py-4 text-center text-xs uppercase tracking-[0.3em] text-black/50">Loading…</div>
            ) : null}
            {!hasMore && notes.length > 0 ? (
              <div className="px-6 py-4 text-center text-xs uppercase tracking-[0.3em] text-black/40">
                You&apos;ve reached the end.
              </div>
            ) : null}
          </>
        )}
      </div>
    </aside>
  );
}
