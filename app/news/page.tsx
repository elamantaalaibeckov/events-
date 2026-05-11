import { Navbar } from "@/components/navbar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { News } from "@/types/database";

export default async function NewsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-black">Новости университета</h1>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {(data as News[] | null)?.map((item) => (
            <Card key={item.id}>
              {item.image_url ? <img src={item.image_url} alt="" className="mb-4 aspect-video w-full rounded-xl object-cover" /> : null}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.content}</CardDescription>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
