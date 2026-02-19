import type { Note } from "@/types/note";
import { getNotes, storeNotes } from "@/utils/asyncStorage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function AddNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const save = async () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || "Untitled",
      content: content || "",
    };

    try {
      const current = (await getNotes()) ?? [];
      const updated = [...current, newNote];
      await storeNotes(updated);
      router.back();
    } catch (e) {
      console.warn("Failed to save note", e);
      Alert.alert("Save failed", "Could not save the note.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TextInput
            style={styles.title}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.content}
            placeholder="Write your note..."
            value={content}
            onChangeText={setContent}
            multiline
            scrollEnabled
          />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.save}
            onPress={save}
            accessibilityLabel="Save"
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    padding: 8,
  },
  content: {
    textAlignVertical: "top",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 12,
    minHeight: 160,
    maxHeight: 420,
  },
  save: {
    height: 48,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  saveText: { color: "#fff", fontWeight: "600" },
  footer: { padding: 16, backgroundColor: "transparent" },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
  },
});
