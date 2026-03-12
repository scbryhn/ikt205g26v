export interface Note {
  id: string;
  title: string;
  text: string;
  image_url?: string | null;
  user_id: string;
  updated_at: string;
}

export interface NoteInsert {
  title: string;
  text: string;
  image_url?: string | null;
}

export interface NoteUpdate {
  title?: string;
  text?: string;
  image_url?: string | null;
}
