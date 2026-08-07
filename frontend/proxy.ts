import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy — proteksi rute via Supabase session cookie.
 *
 * Rute yang dilindungi (LOGIN required):
 *   /dashboard, /chat, /invoice-matching, /demand-intelligence,
 *   /agent-logs, /data-connections, /explainability
 *
 * Rute publik → redirect ke /dashboard jika sudah login:
 *   /login
 */

const PROTECTED_PATHS = [
  "/dashboard",
  "/chat",
  "/invoice-matching",
  "/demand-intelligence",
  "/agent-logs",
  "/data-connections",
  "/explainability",
];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Buat server-side Supabase client yang bisa baca/tulis cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: Selalu panggil getUser() agar cookie session di-refresh otomatis
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Jika user belum login dan mengakses rute yang dilindungi → redirect ke /login
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Jika user sudah login dan mengakses /login → redirect ke /dashboard
  if (user && pathname === "/login") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match semua request path KECUALI:
     * - _next/static, _next/image (file statis Next.js)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public folder (aset gambar/media)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm)$).*)",
  ],
};
