import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";


export const useNotificationPermission = () => {
    const [permissionGranted, setPermissionGranted] = useState<Notifications.PermissionStatus | null>(null);
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

    useEffect(() => {
        async function requestPermission() {
            if (!Device.isDevice) {
                Alert.alert("Info", "Push notifications require a physical device.");
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
                Alert.alert(
                "Tillatelse nektet",
                "Aktiver varsler i innstillingene for å motta notifikasjoner."
                );
                setPermissionGranted(Notifications.PermissionStatus.DENIED);
                return;
            }

            setPermissionGranted(Notifications.PermissionStatus.GRANTED);

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
            console.log("Expo Push Token:", token);
        }

        requestPermission();
    }, []);

    return { permissionGranted, expoPushToken };
};