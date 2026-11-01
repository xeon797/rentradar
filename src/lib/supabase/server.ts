import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

export { isSupabaseConfigured };

/**
 * Returns a Supabase server client for Server Components and Route Handlers.
 * Returns null if Supabase environment variables are missing, ensuring zero crash during offline evaluations.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const cookieStore = await cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Can happen in Server Components; safe to ignore when middleware handles sessions.
            }
          },
        },
      }
    );
  } catch (error) {
    console.warn("[RentRadar Supabase Server] Falling back to null client:", error);
    return null;
  }
}
