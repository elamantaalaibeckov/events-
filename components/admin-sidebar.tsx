import Link from "next/link";
import { BarChart3, CalendarDays, Newspaper, ShieldCheck, Users } from "lucide-react";

const items = [
  ["Dashboard", "/admin", BarChart3],
  ["Заявки", "/admin/achievements", ShieldCheck],
  ["События", "/admin/events", CalendarDays],
  ["Новости", "/admin/news", Newspaper],
  ["Пользователи", "/admin/users", Users]
];

export function AdminSidebar() {
  return (
    <aside className="rounded-2xl border bg-white p-3 shadow-sm">
      <nav className="grid gap-1">
        {items.map(([label, href, Icon]) => (
          <Link key={href as string} href={href as string} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            <Icon className="size-4 text-blue-700" />
            {label as string}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
