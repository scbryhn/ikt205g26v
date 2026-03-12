import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingSpinnerProps {
  visible: boolean;
  message?: string;
}

export default function LoadingSpinner({
  visible,
  message = "Uploading an image...",
}: LoadingSpinnerProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  container: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
});
