'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { AuthGate } from "@/components/AuthGate";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { Toolbar } from "@/components/Toolbar";
import { NOTES_PAGE_SIZE, createNote, deleteNote, fetchNotes, updateNote } from "@/lib/notes";
import type { Note } from "@/types/note";
import { useSupabase } from "@/components/SupabaseProvider";
import { useToast } from "@/components/ToastProvider";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debounced;
}

function NotesApp() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { notify } = useToast();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const [starredOnly, setStarredOnly] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "" });
  const [lastSaved, setLastSaved] = useState({ title: "", content: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const getKey = useCallback(
    (pageIndex: number): ["notes", boolean, string, number] => [
      "notes",
      starredOnly,
      debouncedSearch,
      pageIndex
    ],
    [debouncedSearch, starredOnly]
  );

  const {
    data,
    size,
    setSize,
    mutate,
    isValidating
  } = useSWRInfinite<Note[], ["notes", boolean, string, number]>(
    getKey,
    ([, starred, search, page]: ["notes", boolean, string, number]) =>
      fetchNotes({ page, starred, search })
  );

  const persistDraft = useCallback(async () => {
    if (!selectedNoteId) {
      return;
    }
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      const updated = await updateNote(selectedNoteId, { title: draft.title, content: draft.content });
      setLastSaved({ title: updated.title, content: updated.content });
      setLastSavedAt(new Date(updated.updated_at));
      await mutate(
        (pages) =>
          pages?.map((page) =>
            page.map((note) => (note.id === updated.id ? { ...note, ...updated } : note))
          ),
        { revalidate: false }
      );
      void mutate();
      void mutate();
    } catch (error) {
      console.error(error);
      notify("Unable to save note.", "error");
    } finally {
      setIsSaving(false);
    }
  }, [draft.content, draft.title, isSaving, mutate, notify, selectedNoteId]);

  const notes = useMemo(() => (data ? data.flat() : []), [data]);
  const lastPageLength = data?.[data.length - 1]?.length ?? 0;
  const hasMore = notes.length === 0 ? false : lastPageLength === NOTES_PAGE_SIZE;
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;
  const isDirty = selectedNote !== null && (draft.title !== lastSaved.title || draft.content !== lastSaved.content);

  useEffect(() => {
    // reset pagination when filters change
    setSize(1);
  }, [debouncedSearch, setSize, starredOnly]);

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (selectedNoteId && selectedNote === null) {
      if (notes.length > 0) {
        setSelectedNoteId(notes[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }
  }, [notes, selectedNote, selectedNoteId]);

  useEffect(() => {
    if (selectedNote) {
      setDraft({ title: selectedNote.title, content: selectedNote.content });
      setLastSaved({ title: selectedNote.title, content: selectedNote.content });
      setLastSavedAt(new Date(selectedNote.updated_at));
    } else {
      setDraft({ title: "", content: "" });
      setLastSaved({ title: "", content: "" });
      setLastSavedAt(null);
    }
  }, [selectedNote, selectedNoteId, selectedNote?.content, selectedNote?.title, selectedNote?.updated_at]);

  useEffect(() => {
    if (!selectedNoteId || !isDirty) {
      return;
    }
    const timer = window.setTimeout(() => {
      void persistDraft();
    }, 800);

    return () => window.clearTimeout(timer);
  }, [draft, isDirty, persistDraft, selectedNoteId]);

  const handleSelectNote = useCallback(
    (id: string) => {
      if (isDirty) {
        void persistDraft();
      }
      setSelectedNoteId(id);
    },
    [isDirty, persistDraft]
  );

  const handleCreateNote = useCallback(async () => {
    try {
      const note = await createNote();
      setSelectedNoteId(note.id);
      await mutate();
    } catch (error) {
      console.error(error);
      notify("Unable to create note.", "error");
    }
  }, [mutate, notify]);

  const handleDeleteNote = useCallback(async () => {
    if (!selectedNoteId) {
      return;
    }
    const shouldDelete = window.confirm("Delete this note permanently?");
    if (!shouldDelete) {
      return;
    }
    try {
      await deleteNote(selectedNoteId);
      setSelectedNoteId(null);
      setDraft({ title: "", content: "" });
      setLastSaved({ title: "", content: "" });
      setLastSavedAt(null);
      await mutate(
        (pages) =>
          pages?.map((page) => page.filter((note) => note.id !== selectedNoteId)),
        { revalidate: true }
      );
    } catch (error) {
      console.error(error);
      notify("Unable to delete note.", "error");
    }
  }, [mutate, notify, selectedNoteId]);

  const handleToggleStar = useCallback(async () => {
    if (!selectedNote) {
      return;
    }
    try {
      const updated = await updateNote(selectedNote.id, { starred: !selectedNote.starred });
      setLastSavedAt(new Date(updated.updated_at));
      await mutate(
        (pages) =>
          pages?.map((page) =>
            page.map((note) => (note.id === updated.id ? { ...note, ...updated } : note))
          ),
        { revalidate: false }
      );
    } catch (error) {
      console.error(error);
      notify("Unable to update star.", "error");
    }
  }, [mutate, notify, selectedNote]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  }, [router, supabase]);

  const loadMore = useCallback(() => {
    if (hasMore && !isValidating) {
      setSize((current) => current + 1);
    }
  }, [hasMore, isValidating, setSize]);

  const setDraftTitle = useCallback((next: string) => {
    setDraft((prev) => ({ ...prev, title: next }));
  }, []);

  const setDraftContent = useCallback((next: string) => {
    setDraft((prev) => ({ ...prev, content: next }));
  }, []);

  useHotkeys(
    "ctrl+n,cmd+n",
    (event) => {
      event.preventDefault();
      void handleCreateNote();
    },
    [handleCreateNote]
  );

  useHotkeys(
    "ctrl+s,cmd+s",
    (event) => {
      event.preventDefault();
      void persistDraft();
    },
    [persistDraft]
  );

  useHotkeys(
    "ctrl+shift+s,cmd+shift+s",
    (event) => {
      event.preventDefault();
      void handleToggleStar();
    },
    [handleToggleStar]
  );

  useHotkeys(
    "ctrl+f,cmd+f",
    (event) => {
      event.preventDefault();
      const element = document.querySelector<HTMLInputElement>("#notepaper-search");
      element?.focus();
    },
    []
  );

  return (
    <div className="flex h-screen overflow-hidden bg-paper-background text-paper-foreground">
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelect={handleSelectNote}
        onCreate={handleCreateNote}
        search={searchTerm}
        onSearchChange={setSearchTerm}
        starredOnly={starredOnly}
        onStarToggle={setStarredOnly}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isValidating}
      />
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-black/10 px-12 py-6">
          <p className="font-serif text-lg uppercase tracking-[0.4em] text-black/60">
            {selectedNote ? "Editor" : "Select or create a note"}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-black/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-black hover:border-black hover:bg-black hover:text-white"
          >
            Sign Out
          </button>
        </div>
        {selectedNote ? (
          <div className="flex-1 overflow-hidden">
            <div className="p-12">
              <Toolbar
                isStarred={selectedNote.starred}
                onToggleStar={handleToggleStar}
                onSave={() => void persistDraft()}
                onDelete={handleDeleteNote}
                canSave={isDirty}
                isSaving={isSaving}
                lastSavedAt={lastSavedAt}
              />
            </div>
            <div className="flex-1 overflow-auto">
              <Editor
                title={draft.title}
                content={draft.content}
                onChange={(value) => {
                  if (value.title !== undefined) setDraftTitle(value.title);
                  if (value.content !== undefined) setDraftContent(value.content);
                }}
                onBlurPersist={() => {
                  if (isDirty) {
                    void persistDraft();
                  }
                }}
                disabled={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-paper-background">
            <p className="font-serif text-2xl text-black/50">Choose a note or create a new one.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGate>
      <NotesApp />
    </AuthGate>
  );
}
