import NotesItem from "@/components/NoteItem";
import type { Note } from "@/types/note";
import { getNotes, removeNotes } from "@/utils/asyncStorage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [notes, setNotes] = useState<Note[] | []>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function loadNote() {
        try {
          const stored = await getNotes();
          setNotes(stored ?? []);
        } catch (e) {
          console.warn("Failed to load note", e);
        }
      }

      loadNote();
    }, []),
  );

  const handleRemove = async () => {
    try {
      await removeNotes();
      setNotes([]);
    } catch (e) {
      console.warn("Failed to remove notes", e);
    }
  };

  return (
    <View style={styles.container}>
      {notes && notes.length > 0 ? (
        <View style={{ padding: 16, width: "100%" }}>
          <FlatList
            data={notes}
            keyExtractor={(note) => note.id}
            contentContainerStyle={{ paddingBottom: 180, paddingTop: 8 }}
            renderItem={({ item }) => (
              <NotesItem
                note={item}
                onPress={() =>
                  router.push({
                    pathname: "/noteDetails/[id]",
                    params: { id: item.id },
                  })
                }
              />
            )}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No note stored. Press + to add one.</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push("/addNote")}
        accessibilityLabel="Add"
      >
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
  plus: {
    color: "#fff",
    fontSize: 36,
    lineHeight: 36,
  },
});
