import { createClient } from "@supabase/supabase-js";

// Tambahkan PUBLIC_ di sini
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabaseLTUrl = import.meta.env.PUBLIC_SUPABASE_LT_URL;
const supabaseLTKey = import.meta.env.PUBLIC_SUPABASE_LT_ANON_KEY;

// Validasi
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
}

if (!supabaseLTUrl || !supabaseLTKey) {
  throw new Error(
    "Missing PUBLIC_SUPABASE_LT_URL or PUBLIC_SUPABASE_LT_ANON_KEY",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseLT = createClient(supabaseLTUrl, supabaseLTKey);

// Tambahan agar bisa dibaca sama Layout.astro lu nanti
if (typeof window !== "undefined") {
  window.supabase = supabase;
  window.supabaseLT = supabaseLT;
}
