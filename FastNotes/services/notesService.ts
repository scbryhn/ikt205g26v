import { supabase } from "@/lib/supabase";
import type { Note, NoteInsert, NoteUpdate } from "@/types/note";

const NOTES_TABLE = "Notes";
const NOTE_IMAGES_BUCKET = "Note images";
const ALLOWED_UPLOAD_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export async function uploadNoteImage(imageUri: string): Promise<{
  data: { path: string; publicUrl: string } | null;
  error: any;
}> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        data: null,
        error: userError ?? { message: "Not authenticated" },
      };
    }

    const uriWithoutQuery = imageUri.split("?")[0];
    if (!uriWithoutQuery.includes(".")) {
      return {
        data: null,
        error: { message: "Image must have a file extension" },
      };
    }

    const extension = uriWithoutQuery
      .substring(uriWithoutQuery.lastIndexOf(".") + 1)
      .toLowerCase();

    if (!ALLOWED_UPLOAD_EXTENSIONS.includes(extension)) {
      return {
        data: null,
        error: { message: "Unsupported image format. Use JPG, PNG, or WebP." },
      };
    }

    const normalizedExtension = extension === "jpeg" ? "jpg" : extension;
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${normalizedExtension}`;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(NOTE_IMAGES_BUCKET)
      .upload(filePath, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: blob.type || undefined,
      });

    if (uploadError || !uploadData) {
      console.error("Failed to upload image", uploadError);
      return { data: null, error: uploadError ?? { message: "Upload failed" } };
    }

    const { data: publicData } = supabase.storage
      .from(NOTE_IMAGES_BUCKET)
      .getPublicUrl(uploadData.path);

    return {
      data: {
        path: uploadData.path,
        publicUrl: publicData.publicUrl,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNote(
  note: NoteInsert,
): Promise<{ data: Note | null; error: any }> {
  const { data, error } = await supabase
    .from(NOTES_TABLE)
    .insert({
      title: note.title,
      text: note.text,
      image_url: note.image_url ?? null,
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
