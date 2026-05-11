import { Navbar } from "@/components/navbar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Achievement } from "@/types/database";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("achievements")
    .select("*, profiles(full_name, group_name), events(title)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-black">Достижения студентов</h1>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(data as Achievement[] | null)?.map((item) => (
            <Card key={item.id}>
              {item.file_url ? <a href={item.file_url} className="text-sm font-semibold text-blue-700" target="_blank">Открыть файл</a> : null}
              <CardTitle className="mt-3">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <p className="mt-4 font-semibold">{item.profiles?.full_name}</p>
              <p className="text-sm text-slate-500">{item.profiles?.group_name}</p>
              {item.events?.title ? <p className="mt-3 text-sm text-slate-700">Событие: {item.events.title}</p> : null}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
