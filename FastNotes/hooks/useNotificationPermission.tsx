import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

// Controls how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Schedules an immediate local notification with the note title.
 * Call this after a successful note save.
 */
export async function sendLocalNoteNotification(noteTitle: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nytt notat: ${noteTitle}`,
    },
    trigger: null,
  });
}

export const useNotificationPermission = () => {
  const [permissionGranted, setPermissionGranted] =
    useState<Notifications.PermissionStatus | null>(null);

  useEffect(() => {
    async function requestPermission() {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
        Alert.alert(
          "Tillatelse nektet",
          "Aktiver varsler i innstillingene for å motta notifikasjoner.",
        );
        setPermissionGranted(Notifications.PermissionStatus.DENIED);
        return;
      }

      setPermissionGranted(Notifications.PermissionStatus.GRANTED);
    }

    requestPermission();
  }, []);

  return { permissionGranted };
};
