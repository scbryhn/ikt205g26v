import { supabase } from "@/lib/supabase";
import type { Note, NoteInsert, NoteUpdate } from "@/types/note";

const NOTES_TABLE = "Notes";

export async function createNote(
  note: NoteInsert,
): Promise<{ data: Note | null; error: any }> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .insert({
      title: note.title,
      text: note.text,
      updated_at: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  return { data, error };
}

export async function getAllNotes(): Promise<{
  data: Note[] | null;
  error: any;
}> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  return { data, error };
}

export async function getNoteById(
  id: string,
): Promise<{ data: Note | null; error: any }> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function getMyNotes(): Promise<{
  data: Note[] | null;
  error: any;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "Not authenticated" } };
  }

  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return { data, error };
}

export async function updateNote(
  id: string,
  updates: NoteUpdate,
): Promise<{ data: Note | null; error: any }> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .update({
      ...updates,
      updated_at: new Date().toISOString().split("T")[0],
    })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteNote(id: string): Promise<{ error: any }> {
  const { error } = await supabase.from(NOTES_TABLE).delete().eq("id", id);

  return { error };
}
