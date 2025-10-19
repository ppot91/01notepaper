import type { Note } from "@/types/note";
import { createBrowserClient } from "./supabaseClient";

export const NOTES_PAGE_SIZE = 20;

export type NotesQuery = {
  page?: number;
  search?: string;
  starred?: boolean;
};

export async function fetchNotes({ page = 0, search, starred }: NotesQuery): Promise<Note[]> {
  const supabase = createBrowserClient();
  const from = page * NOTES_PAGE_SIZE;
  const to = from + NOTES_PAGE_SIZE - 1;
  let query = supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (search) {
    const term = `%${search}%`;
    query = query.or(`title.ilike.${term},content.ilike.${term}`);
  }

  if (starred) {
    query = query.eq("starred", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createNote(): Promise<Note> {
  const supabase = createBrowserClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({ title: "", content: "", starred: false, user_id: user.id })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateNote(
  noteId: string,
  payload: Partial<Pick<Note, "title" | "content" | "starred">>
): Promise<Note> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("notes")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteNote(noteId: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) {
    throw error;
  }
}
