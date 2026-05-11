import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUserProfile } from "@/lib/auth";
import { signOutAction } from "@/actions/auth";

const links = [
  ["Главная", "/"],
  ["События", "/events"],
  ["Достижения", "/achievements"],
  ["Новости", "/news"],
  ["Галерея", "/gallery"]
];

export async function Navbar() {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-white">
            <GraduationCap className="size-5" />
          </span>
          <span className="hidden sm:inline">University Events</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-blue-700">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={profile?.role === "admin" ? "/admin" : "/dashboard"}>Кабинет</Link>
              </Button>
              <form action={signOutAction}>
                <Button variant="ghost" size="sm">Выйти</Button>
              </form>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
