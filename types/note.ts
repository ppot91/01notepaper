export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  starred: boolean;
  updated_at: string;
  created_at: string;
};

export type NoteInput = Pick<Note, "title" | "content" | "starred">;
