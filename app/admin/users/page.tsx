import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <section>
      <h1 className="text-3xl font-black">Пользователи</h1>
      <div className="mt-6 grid gap-4">
        {((data as Profile[] | null) ?? []).map((profile) => (
          <Card key={profile.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{profile.full_name || "Без имени"}</CardTitle>
                <CardDescription>{profile.group_name || "Группа не указана"}</CardDescription>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{profile.role}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
