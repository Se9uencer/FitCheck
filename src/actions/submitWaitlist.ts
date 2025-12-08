"use server";

// Env values must come from Supabase → Settings → API.
// Only the anon public key should be used client-side.
import { supabase } from "@/lib/supabaseClient";

export async function submitWaitlist(email: string) {
  const { error } = await supabase.from("waitlist").insert({ email });
  return { success: !error, error };
}


