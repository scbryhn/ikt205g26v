import { signInWithEmail } from "@/services/authService";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    return email.trim().length > 0 && password.trim().length >= 6;
  }, [email, password]);

  const handleLogin = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await signInWithEmail(email.trim(), password.trim());
      router.replace("/");
    } catch (error) {
      console.warn("Failed to sign in", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in with your email.</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              textContentType="password"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              (!isValid || isSubmitting) && styles.primaryButtonDisabled,
              pressed && isValid && !isSubmitting && styles.buttonPressed,
            ]}
            onPress={handleLogin}
            disabled={!isValid || isSubmitting}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? "Signing in..." : "Log In"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.linkButton}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.linkText}>New here? Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1c1c1c",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b6b6b",
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  linkButton: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
