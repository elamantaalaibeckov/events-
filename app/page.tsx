import Link from "next/link";
import { Award, CalendarDays, ChevronRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Achievement, Event } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: events }, { data: achievements }] = await Promise.all([
    supabase.from("events").select("*").order("event_date", { ascending: true }).limit(3),
    supabase
      .from("achievements")
      .select("*, profiles(full_name, group_name), events(title)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(3)
  ]);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-100">
                University Events & Student Achievements
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                События университета и достижения студентов в одном месте
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Следите за олимпиадами, хакатонами, конкурсами и спортивными событиями. Студенты могут отправлять
                достижения на модерацию, а подтвержденные работы становятся частью публичной витрины университета.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/events">Смотреть события</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <Link href="/dashboard">Добавить достижение</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                [CalendarDays, "Публичный календарь", "События, даты, место проведения и формат"],
                [Award, "Витрина достижений", "Только подтвержденные заявки студентов"],
                [ShieldCheck, "Модерация", "Проверка админом, преподавателем или модератором"]
              ].map(([Icon, title, text]) => (
                <div key={title as string} className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl">
                  <Icon className="mb-4 size-7 text-blue-300" />
                  <h2 className="text-xl font-bold">{title as string}</h2>
                  <p className="mt-2 text-slate-300">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950">Последние события</h2>
            <Link href="/events" className="flex items-center gap-1 text-sm font-semibold text-blue-700">
              Все события <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {(events as Event[] | null)?.map((event) => (
              <Card key={event.id}>
                <p className="mb-3 text-sm font-semibold text-blue-700">{event.event_type}</p>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
                <p className="mt-4 text-sm font-medium text-slate-700">{formatDate(event.event_date)}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">Подтвержденные достижения</h2>
              <Link href="/achievements" className="flex items-center gap-1 text-sm font-semibold text-blue-700">
                Все достижения <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {(achievements as Achievement[] | null)?.map((item) => (
                <Card key={item.id}>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{item.profiles?.full_name}</p>
                  <p className="text-sm text-slate-500">{item.profiles?.group_name}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
