import { Note } from "@/types/note";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeNotes(value: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem("notes", JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to set storage item", e);
    throw e;
  }
}

export async function getNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem("notes");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to get storage item", e);
    throw e;
  }
}

export async function getNoteById(id: string | string[]): Promise<Note | null> {
  try {
    const notes = await getNotes();
    return notes.find((note) => note.id === id) || null;
  } catch (e) {
    console.warn("Failed to get note by id", e);
    throw e;
  }
}

export async function removeNotes(): Promise<void> {
  try {
    await AsyncStorage.removeItem("notes");
  } catch (e) {
    console.warn("Failed to remove storage item", e);
    throw e;
  }
}
