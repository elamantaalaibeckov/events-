import { Navbar } from "@/components/navbar";
import { Card, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/database";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("gallery").select("*, events(title)").order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-black">Галерея</h1>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data as GalleryItem[] | null)?.map((item) => (
            <Card key={item.id} className="p-3">
              <img src={item.image_url} alt={item.title} className="aspect-[4/3] w-full rounded-xl object-cover" />
              <CardTitle className="mt-4 px-2 pb-2">{item.title}</CardTitle>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
