import { createNote } from "@/services/notesService";
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
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    // Validation: no empty fields
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Both title and content are required.");
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await createNote({
        title: title.trim(),
        text: content.trim(),
      });

      if (error) {
        Alert.alert("Error", "Failed to save note. Please try again.");
        console.warn("Failed to save note", error);
        return;
      }

      // Success feedback
      Alert.alert("Success", "Note saved successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      console.warn("Failed to save note", e);
      Alert.alert("Error", "Could not save the note.");
    } finally {
      setIsSaving(false);
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
            style={[styles.save, isSaving && styles.saveDisabled]}
            onPress={save}
            disabled={isSaving}
            accessibilityLabel="Save"
          >
            <Text style={styles.saveText}>
              {isSaving ? "Saving..." : "Save"}
            </Text>
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
  saveDisabled: {
    opacity: 0.6,
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
