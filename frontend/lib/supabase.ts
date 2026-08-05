/**
 * Supabase browser client — digunakan di Client Components
 * Gunakan createBrowserClient dari @supabase/ssr agar session
 * otomatis di-sync dengan cookie (diperlukan oleh middleware).
 */
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
