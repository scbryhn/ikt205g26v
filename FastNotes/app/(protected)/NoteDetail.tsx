import { Note } from "@/types/note";

interface Props {
  note: Note;
}

export default function NoteDetail({ note }: Props) {
  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.text}</p>
    </div>
  );
}
