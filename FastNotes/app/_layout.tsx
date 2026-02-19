import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name={"index"} options={{ headerTitle: "Notes" }} />
      <Stack.Screen
        name={"noteDetails/[id]"}
        options={{ headerTitle: "Note Details" }}
      />
    </Stack>
  );
}
