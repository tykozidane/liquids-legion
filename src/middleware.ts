// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(
    // req
  ) {}
);

// export const config = { matcher: ["/admin"] }
export const config = {
  matcher: [
    '/dashboard/:path*'
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     * 7. /auth page
     */
    // "/",
    // "/((?!api/|_next/|_proxy/|_static|_vercel|images|login|liquids|register|terms|privacy-policy|not-found|avatars/|assets/|files/|admin/sourceMap/chrome/css/|admin/administration/sourceMap/chrome/css/|firebase-messaging-sw.js|favicon.ico|sitemap.xml).*)"
    // "/"
  ],
  // matcher: [
  //   "/",
  //   "/admin/:path*",
  // //   '/auth'    ==> cause redirect panjang
  // ]
};
