import { reviewAchievementAction } from "@/actions/achievements";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import type { Achievement } from "@/types/database";

export default async function AdminAchievementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("achievements")
    .select("*, profiles(full_name, group_name), events(title)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <section>
      <h1 className="text-3xl font-black">Заявки на проверку</h1>
      <div className="mt-6 grid gap-5">
        {((data as Achievement[] | null) ?? []).map((item) => (
          <Card key={item.id}>
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <p className="mt-4 text-sm font-semibold">{item.profiles?.full_name} · {item.profiles?.group_name}</p>
                {item.events?.title ? <p className="text-sm text-slate-600">Событие: {item.events.title}</p> : null}
                {item.file_url ? <a href={item.file_url} target="_blank" className="mt-4 inline-flex text-sm font-semibold text-blue-700">Preview файла</a> : null}
              </div>
              <form action={reviewAchievementAction} className="grid gap-3">
                <input type="hidden" name="id" value={item.id} />
                <Textarea name="rejection_reason" placeholder="Причина отклонения" />
                <div className="flex gap-2">
                  <Button name="status" value="approved" className="flex-1">Approve</Button>
                  <Button name="status" value="rejected" variant="destructive" className="flex-1">Reject</Button>
                </div>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
