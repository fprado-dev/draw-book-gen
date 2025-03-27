const protectedRoutes = ["/dashboard", "/projects", "/outlines"];
const authRoutes = ["/sign-in", "/sign-up"];

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

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
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    const isProtectedRoute = protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );
    console.log("request.nextUrl.pathname", request.nextUrl.pathname);
    console.log({ isAuthRoute })

    if (isProtectedRoute && error) {
      const currentPath = request.nextUrl.pathname;
      return NextResponse.redirect(new URL(`/sign-in?redirect=${encodeURIComponent(currentPath)}`, request.url));
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (request.nextUrl.pathname === "/" && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
