import { AuthProvider } from "@/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase";

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && segments[0] === "(protected)") {
        router.replace("/(auth)/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && segments[0] === "(protected)") {
        router.replace("/(auth)/login");
      } else if (session && segments[0] === "(auth)") {
        router.replace("/(protected)");
      }
    });

    return () => subscription.unsubscribe();
  }, [segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
