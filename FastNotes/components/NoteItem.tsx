import { Pressable, StyleSheet, Text } from "react-native";
import { Note } from "../types/note";

interface Props {
  note: Note;
  onPress: () => void;
}

export default function NoteItem({ note, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text numberOfLines={1} style={styles.title}>
        {note.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
});
