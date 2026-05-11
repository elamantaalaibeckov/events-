import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin")) {
    const hasSessionCookie = request.cookies.getAll().some((cookie) => cookie.name.includes("auth-token"));
    if (!hasSessionCookie) {
      url.pathname = "/auth/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
