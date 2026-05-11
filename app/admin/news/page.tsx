import { createNewsAction } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import type { News } from "@/types/database";

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-black">Управление новостями</h1>
      <Card>
        <CardTitle>Создать новость</CardTitle>
        <form action={createNewsAction} className="mt-5 grid gap-4">
          <Input name="title" placeholder="Заголовок" required />
          <Input name="image_url" placeholder="URL изображения" />
          <Textarea name="content" placeholder="Текст новости" required />
          <Button>Опубликовать</Button>
        </form>
      </Card>
      {((data as News[] | null) ?? []).map((item) => (
        <Card key={item.id}>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.content}</CardDescription>
        </Card>
      ))}
    </section>
  );
}
