import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const [profiles, events, pending, approved] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("achievements").select("id", { count: "exact", head: true }).eq("status", "approved")
  ]);

  const stats = [
    ["Пользователи", profiles.count],
    ["События", events.count],
    ["Ожидают проверки", pending.count],
    ["Опубликовано", approved.count]
  ];

  return (
    <section>
      <h1 className="text-3xl font-black">Админ-панель</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label as string}>
            <CardDescription>{label as string}</CardDescription>
            <CardTitle className="mt-2 text-3xl">{value ?? 0}</CardTitle>
          </Card>
        ))}
      </div>
    </section>
  );
}
