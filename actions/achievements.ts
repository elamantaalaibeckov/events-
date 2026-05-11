"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { achievementSchema } from "@/lib/validations";
import { requireAdmin, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function uploadAchievementFile(file: File, userId: string) {
  if (!file || file.size === 0) return null;

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("achievement-files").upload(path, file, {
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("achievement-files").getPublicUrl(path);
  return data.publicUrl;
}

export async function createAchievementAction(formData: FormData) {
  const { user } = await requireUser();
  const parsed = achievementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    event_id: formData.get("event_id") || ""
  });

  if (!parsed.success) redirect("/dashboard?error=invalid-achievement");

  const file = formData.get("file") as File | null;
  const fileUrl = file ? await uploadAchievementFile(file, user!.id) : null;
  const supabase = await createClient();

  const { error } = await supabase.from("achievements").insert({
    student_id: user!.id,
    title: parsed.data.title,
    description: parsed.data.description,
    event_id: parsed.data.event_id || null,
    file_url: fileUrl,
    status: "pending"
  });

  if (error) redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/dashboard");
  redirect("/dashboard?created=1");
}

export async function reviewAchievementAction(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const rejectionReason = String(formData.get("rejection_reason") ?? "").trim();

  if (status !== "approved" && status !== "rejected") redirect("/admin/achievements?error=bad-status");

  const { data: achievement, error: fetchError } = await supabase
    .from("achievements")
    .select("id, student_id, title")
    .eq("id", id)
    .single();

  if (fetchError || !achievement) redirect("/admin/achievements?error=not-found");

  const { error } = await supabase
    .from("achievements")
    .update({
      status,
      rejection_reason: status === "rejected" ? rejectionReason || "Заявка отклонена" : null,
      reviewed_by: user!.id,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", id);

  if (!error) {
    await supabase.from("notifications").insert({
      user_id: achievement.student_id,
      title: status === "approved" ? "Достижение подтверждено" : "Достижение отклонено",
      message:
        status === "approved"
          ? `Ваше достижение "${achievement.title}" опубликовано.`
          : `Ваше достижение "${achievement.title}" отклонено. Причина: ${rejectionReason || "не указана"}`
    });
  }

  revalidatePath("/admin");
  revalidatePath("/achievements");
  revalidatePath("/dashboard");
  redirect("/admin/achievements");
}
