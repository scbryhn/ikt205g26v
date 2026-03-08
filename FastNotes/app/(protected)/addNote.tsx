import { createNote, uploadNoteImage } from "@/services/notesService";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function getExtensionFromUri(uri: string): string {
  const normalizedUri = uri.split("?")[0];
  const parts = normalizedUri.split(".");
  if (parts.length < 2) {
    return "";
  }
  return parts[parts.length - 1].toLowerCase();
}

function validateImageAsset(
  asset: ImagePicker.ImagePickerAsset,
): string | null {
  const extension = getExtensionFromUri(asset.uri);

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "Unsupported format. Please use JPG, PNG, or WebP.";
  }

  if (
    typeof asset.fileSize === "number" &&
    asset.fileSize > MAX_IMAGE_SIZE_BYTES
  ) {
    return "Image is too large. Maximum size is 15MB.";
  }

  return null;
}

export default function AddNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Camera permission needed",
        "Please allow camera access to take photos for your notes.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];
    const validationError = validateImageAsset(selectedAsset);
    if (validationError) {
      Alert.alert("Invalid image", validationError);
      return;
    }

    setPhotoUri(selectedAsset.uri);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Gallery permission needed",
        "Please allow photo library access to choose images for your notes.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];
    const validationError = validateImageAsset(selectedAsset);
    if (validationError) {
      Alert.alert("Invalid image", validationError);
      return;
    }

    setPhotoUri(selectedAsset.uri);
  };

  const save = async () => {
    // Validation: no empty fields
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Both title and content are required.");
      return;
    }

    try {
      setIsSaving(true);

      let imageUrl: string | null = null;
      if (photoUri) {
        const { data: uploadData, error: uploadError } =
          await uploadNoteImage(photoUri);

        if (uploadError || !uploadData) {
          Alert.alert(
            "Upload failed",
            "Could not upload image. Please try again.",
          );
          console.warn("Failed to upload image", uploadError);
          return;
        }

        imageUrl = uploadData.publicUrl;
      }

      const { error } = await createNote({
        title: title.trim(),
        text: content.trim(),
        image_url: imageUrl,
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
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : null}

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
            style={styles.takePhoto}
            onPress={takePhoto}
            accessibilityLabel="Take photo"
          >
            <Text style={styles.takePhotoText}>Take photo</Text>
          </Pressable>

          <Pressable
            style={styles.pickPhoto}
            onPress={pickFromGallery}
            accessibilityLabel="Choose from gallery"
          >
            <Text style={styles.pickPhotoText}>Choose from gallery</Text>
          </Pressable>

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
  takePhoto: {
    height: 44,
    backgroundColor: "#E9F2FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  takePhotoText: { color: "#0A63D8", fontWeight: "600" },
  pickPhoto: {
    height: 44,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  pickPhotoText: { color: "#344054", fontWeight: "600" },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f3f3f3",
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
