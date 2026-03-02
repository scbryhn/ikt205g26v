import { deleteNote, getNoteById, updateNote } from "@/services/notesService";
import { Note } from "@/types/note";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NoteDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNoteData = async () => {
      if (id && typeof id === "string") {
        try {
          setLoading(true);
          const { data, error } = await getNoteById(id);
          if (error) {
            console.warn("Failed to load note", error);
            setNote(null);
          } else {
            setNote(data);
            setEditTitle(data?.title || "");
            setEditText(data?.text || "");
          }
        } catch (e) {
          console.warn("Failed to load note", e);
          setNote(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchNoteData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(note?.title || "");
    setEditText(note?.text || "");
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editText.trim()) {
      Alert.alert("Missing fields", "Both title and text are required.");
      return;
    }

    if (!id || typeof id !== "string") return;

    try {
      setIsSaving(true);
      const { data, error } = await updateNote(id, {
        title: editTitle.trim(),
        text: editText.trim(),
      });

      if (error) {
        Alert.alert("Error", "Failed to update note. Please try again.");
        console.warn("Failed to update note", error);
        return;
      }

      setNote(data);
      setIsEditing(false);
      Alert.alert("Success", "Note updated successfully!");
    } catch (e) {
      console.warn("Failed to update note", e);
      Alert.alert("Error", "Could not update the note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    if (!id || typeof id !== "string") return;

    try {
      const { error } = await deleteNote(id);

      if (error) {
        Alert.alert("Error", "Failed to delete note. Please try again.");
        console.warn("Failed to delete note", error);
        return;
      }

      Alert.alert("Success", "Note deleted successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      console.warn("Failed to delete note", e);
      Alert.alert("Error", "Could not delete the note.");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!note) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Note not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {isEditing ? (
          <>
            <View style={styles.titleBar}>
              <TextInput
                style={styles.titleInput}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Title"
              />
            </View>
            <ScrollView
              style={styles.scrollView}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.noteContainer}>
                <TextInput
                  style={styles.textInput}
                  value={editText}
                  onChangeText={setEditText}
                  placeholder="Note text..."
                  multiline
                />
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.saveButton,
                  isSaving && styles.buttonDisabled,
                ]}
                onPress={handleSaveEdit}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.titleBar}>
              <Text style={styles.title}>{note.title}</Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.noteContainer}>
                <Text style={styles.content}>{note.text}</Text>
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.editButton]}
                onPress={handleEdit}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
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
  titleInput: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 34,
    padding: 0,
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
  textInput: {
    fontSize: 16,
    color: "#4a4a4a",
    lineHeight: 24,
    fontWeight: "400",
    minHeight: 300,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#8E8E93",
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
