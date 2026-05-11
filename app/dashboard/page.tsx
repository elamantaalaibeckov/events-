import { Bell, CheckCircle2, Clock, XCircle } from "lucide-react";
import { AchievementForm } from "@/components/achievement-form";
import { Navbar } from "@/components/navbar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Achievement, Event } from "@/types/database";

const statusIcon = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle
};

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const [{ data: events }, { data: achievements }, { data: notifications }] = await Promise.all([
    supabase.from("events").select("*").order("event_date", { ascending: true }),
    supabase
      .from("achievements")
      .select("*, events(title)")
      .eq("student_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase.from("notifications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5)
  ]);

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="grid gap-6">
          <Card>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>{profile?.full_name || user?.email}</CardDescription>
            <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm">
              <p>Группа: {profile?.group_name || "не указана"}</p>
              <p>Роль: {profile?.role}</p>
            </div>
          </Card>
          <Card>
            <CardTitle>Загрузить достижение</CardTitle>
            <CardDescription>После отправки заявка получит статус pending.</CardDescription>
            <div className="mt-5">
              <AchievementForm events={(events as Event[] | null) ?? []} />
            </div>
          </Card>
        </section>

        <section className="grid gap-6">
          <Card>
            <CardTitle>Уведомления</CardTitle>
            <div className="mt-4 grid gap-3">
              {notifications?.map((note) => (
                <div key={note.id} className="flex gap-3 rounded-xl bg-slate-100 p-3">
                  <Bell className="mt-1 size-4 text-blue-700" />
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm text-slate-600">{note.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Мои заявки</CardTitle>
            <div className="mt-4 grid gap-4">
              {((achievements as Achievement[] | null) ?? []).map((item) => {
                const Icon = statusIcon[item.status];
                return (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        <Icon className="size-3" />
                        {item.status}
                      </span>
                    </div>
                    {item.status === "rejected" ? (
                      <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{item.rejection_reason}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}
