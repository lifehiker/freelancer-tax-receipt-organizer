import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Route group folders like (marketing) and (app) are not real URL segments.
  // If Next.js receives a request with a literal `/(name)` path it internally
  // normalises/redirects it to the collapsed URL, which makes the health
  // checker flag two routes rendering the same page. Return 404 for those
  // invalid paths so the normalisation redirect never fires.
  return NextResponse.notFound();
}

export const config = {
  // Match any path whose first segment is a parenthesised route-group name,
  // e.g. /(marketing), /(marketing)/for-creators, /(app)/receipts, etc.
  matcher: ["/\\([^)]+\\)", "/\\([^)]+\\)/(.*)"],
};
