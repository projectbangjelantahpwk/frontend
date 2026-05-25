import { createClient } from "@supabase/supabase-js";

// Tambahkan PUBLIC_ di sini
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tambahan agar bisa dibaca sama Layout.astro lu nanti
if (typeof window !== "undefined") {
  window.supabase = supabase;
}
