import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function ProtectedLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Jobb Notater",
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <Text style={{ color: "#007AFF", fontSize: 16 }}>Log Out</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="addNote" options={{ title: "Add Note" }} />
      <Stack.Screen
        name="noteDetails/[id]"
        options={{ title: "Note Details" }}
      />
    </Stack>
  );
}
