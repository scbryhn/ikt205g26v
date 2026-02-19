import { Note } from "@/types/note";
import { getNoteById } from "@/utils/asyncStorage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function NoteDetails() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNoteData = async () => {
      if (id) {
        const fetched = await getNoteById(id);
        setNote(fetched || null);
      }
    };
    fetchNoteData();
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>{note?.title || "Untitled Note"}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        <View style={styles.noteContainer}>
          <Text style={styles.content}>{note?.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  titleBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 34,
  },
  scrollView: {
    flex: 1,
  },
  noteContainer: {
    backgroundColor: "#ffffff",
    marginBottom: 0,
    padding: 24,
    minHeight: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    fontSize: 16,
    color: "#4a4a4a",
    lineHeight: 24,
    fontWeight: "400",
  },
});
