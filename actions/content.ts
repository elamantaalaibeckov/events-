"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { eventSchema, newsSchema } from "@/lib/validations";

export async function createEventAction(formData: FormData) {
  const { user } = await requireAdmin();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/events?error=invalid");

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    ...parsed.data,
    event_time: parsed.data.event_time || null,
    location: parsed.data.location || null,
    image_url: parsed.data.image_url || null,
    created_by: user!.id
  });

  if (error) redirect(`/admin/events?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function createNewsAction(formData: FormData) {
  const { user } = await requireAdmin();
  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/news?error=invalid");

  const supabase = await createClient();
  const { error } = await supabase.from("news").insert({
    ...parsed.data,
    image_url: parsed.data.image_url || null,
    created_by: user!.id
  });

  if (error) redirect(`/admin/news?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/news");
  redirect("/admin/news");
}
