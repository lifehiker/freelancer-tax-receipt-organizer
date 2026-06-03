import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Route group folders like (marketing) and (app) are not real URL segments.
  // If Next.js receives a request with a literal `/(name)` path it internally
  // normalises/redirects it to the collapsed URL, which makes the health
  // checker flag two routes rendering the same page. Return 404 for those
  // invalid paths so the normalisation redirect never fires.
  //
  // The check is done in the function body (not the matcher) because
  // Next.js 15's path-to-regexp parser does not reliably handle character
  // classes like [^)] inside matcher strings.
  if (/^\/\([^)]+\)/.test(new URL(request.url).pathname)) {
    return NextResponse.notFound();
  }
}

export const config = {
  // Exclude only Next.js internals; everything else (including literal
  // parenthesised route-group paths) must reach the middleware function.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
