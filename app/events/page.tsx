import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types/database";

const types = ["все", "олимпиада", "хакатон", "спорт", "конкурс", "другое"];

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("events").select("*").order("event_date", { ascending: true });
  if (params.type && params.type !== "все") query = query.eq("event_type", params.type);
  const { data } = await query;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-3xl font-black">События</h1>
        <div className="my-6 flex flex-wrap gap-2">
          {types.map((type) => (
            <Link key={type} href={type === "все" ? "/events" : `/events?type=${type}`} className="rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-blue-50">
              {type}
            </Link>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(data as Event[] | null)?.map((event) => (
            <Card key={event.id}>
              {event.image_url ? <img src={event.image_url} alt="" className="mb-4 aspect-video w-full rounded-xl object-cover" /> : null}
              <p className="mb-2 text-sm font-semibold text-blue-700">{event.event_type}</p>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
              <div className="mt-4 text-sm text-slate-700">
                <p>{formatDate(event.event_date)} {event.event_time?.slice(0, 5)}</p>
                <p>{event.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
