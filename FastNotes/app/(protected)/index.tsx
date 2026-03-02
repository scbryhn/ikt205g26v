import NotesItem from "@/components/NoteItem";
import type { Note } from "@/types/note";
import { getAllNotes } from "@/services/notesService";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [notes, setNotes] = useState<Note[] | []>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      async function loadNotes() {
        try {
          setLoading(true);
          const { data, error } = await getAllNotes();
          if (error) {
            console.warn("Failed to load notes", error);
            setNotes([]);
          } else {
            setNotes(data ?? []);
          }
        } catch (e) {
          console.warn("Failed to load notes", e);
          setNotes([]);
        } finally {
          setLoading(false);
        }
      }

      loadNotes();
    }, []),
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : notes && notes.length > 0 ? (
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
          <Text>No notes yet. Press + to add one.</Text>
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
  headerContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
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
