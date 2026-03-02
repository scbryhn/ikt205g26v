import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import { secureStorage } from "../utils/secureStorage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
