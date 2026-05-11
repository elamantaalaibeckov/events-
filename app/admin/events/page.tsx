import { createEventAction } from "@/actions/content";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types/database";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-black">Управление событиями</h1>
      <Card>
        <CardTitle>Создать событие</CardTitle>
        <form action={createEventAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="title" placeholder="Название" required />
          <Select name="event_type" required>
            <option value="олимпиада">олимпиада</option>
            <option value="хакатон">хакатон</option>
            <option value="спорт">спорт</option>
            <option value="конкурс">конкурс</option>
            <option value="другое">другое</option>
          </Select>
          <Input name="event_date" type="date" required />
          <Input name="event_time" type="time" />
          <Input name="location" placeholder="Место" />
          <Input name="image_url" placeholder="URL изображения" />
          <Textarea name="description" placeholder="Описание" className="md:col-span-2" required />
          <Button className="md:col-span-2">Создать</Button>
        </form>
      </Card>
      <div className="grid gap-4">
        {((data as Event[] | null) ?? []).map((event) => (
          <Card key={event.id}>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
            <p className="mt-3 text-sm">{formatDate(event.event_date)} · {event.location}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
