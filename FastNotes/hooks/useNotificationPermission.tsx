import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { supabase } from "@/lib/supabase";

// Controls how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

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

                        // Save token to Supabase so the server can send push notifications to this device
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                            await supabase
                                .from("push_tokens")
                                .upsert(
                                    { user_id: user.id, token },
                                    { onConflict: "user_id" }
                                );
                        }
        }

        requestPermission();
    }, []);

    return { permissionGranted, expoPushToken };
};