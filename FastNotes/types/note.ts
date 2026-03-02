export interface Note {
  id: string;
  title: string;
  text: string;
  user_id: string;
  updated_at: string;
}

export interface NoteInsert {
  title: string;
  text: string;
}

export interface NoteUpdate {
  title?: string;
  text?: string;
}
