// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const referer = req.headers.get('referer');
  console.log(referer, "referer")
  // If no referer, just continue
  if (!referer) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  // Don't re-add if ref already exists
  if (url.searchParams.has('ref')) {
    return NextResponse.next();
  }

  try {
    const refHost = new URL(referer).hostname;
    url.searchParams.set('ref', refHost);
    return NextResponse.redirect(url);
  } catch {
    // If referer isn't a valid URL, skip
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/' // Adjust matcher for the pages you want this to run on
};
