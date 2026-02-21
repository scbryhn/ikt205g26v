import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name={"index"} options={{ headerTitle: "Notes" }} />
        <Stack.Screen
          name={"noteDetails/[id]"}
          options={{ headerTitle: "Note Details" }}
        />
      </Stack>
    </AuthProvider>
  );
}
