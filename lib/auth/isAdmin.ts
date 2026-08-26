import { supabase } from "@/lib/supabase/client";

export async function isAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("ADMIN ROLE CHECK ERROR:", error);
    return false;
  }

  return data?.role === "admin";
}