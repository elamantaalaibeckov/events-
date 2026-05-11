import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminRole } from "@/lib/utils";

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return { user, profile };
}

export async function requireUser() {
  const auth = await getCurrentUserProfile();
  if (!auth.user) redirect("/auth/login");
  return auth;
}

export async function requireAdmin() {
  const auth = await requireUser();
  if (!isAdminRole(auth.profile?.role)) redirect("/dashboard");
  return auth;
}
