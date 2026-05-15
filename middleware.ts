import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_URL = "https://jg-mobility-dashboard.vercel.app";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Blokkeer alle admin-routes — stuur door naar het aparte dashboard
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return NextResponse.redirect(`${DASHBOARD_URL}${pathname}`);
  }

  // Voeg pathname toe als header zodat layout.tsx hem kan lezen
  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });
  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
