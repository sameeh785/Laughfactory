// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const referer = req.headers.get('referer');
  // If no referer, just continue
  if (!referer || referer.includes("localhost")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  // Don't re-add if ref already exists
  if (url.searchParams.has('ref')) {
    return NextResponse.next();
  }

  try {
    const ref = new URL(referer).host;
    url.searchParams.set('ref', ref);
    return NextResponse.redirect(url);
  } catch {
    // If referer isn't a valid URL, skip
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/' // Adjust matcher for the pages you want this to run on
};
