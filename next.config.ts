import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * The `connect-src` entry MUST be an origin (`scheme://host[:port]`), never
 * a URL with a path. Per the CSP3 source-expression matching algorithm, a
 * source whose path does not end in `/` requires an EXACT path match — so a
 * path-bearing value like `https://api.scripe.org/api` would allow requests
 * to that literal `/api` path only and block every other path under it
 * (e.g. `/api/v1/auth/signup/pricing-context`, which
 * `src/lib/pricing/pricing-context.ts` actually fetches). The documented
 * production value of `NEXT_PUBLIC_API_BASE_URL` (`.env.example`) IS
 * path-bearing (`https://api.scripe.org/api`), so the header must derive
 * just the origin from it rather than interpolating the raw env value.
 * `new URL(...).origin` does that regardless of whether the configured base
 * carries a path, and keeps this fallback aligned with
 * `pricing-context.ts`'s own fallback (`https://api.scripe.org/api`) — both
 * now resolve to the same origin instead of silently diverging.
 */
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.scripe.org/api").origin;

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      `connect-src 'self' ${apiOrigin}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  /**
   * `next dev` and `next build`/`next start` must never share one output
   * directory. Next's own dev server already nests its per-process state a
   * layer deeper (`{distDir}/dev/...`) than a production build, but both
   * still read/write the SAME top-level `{distDir}/cache` (webpack/turbopack
   * persistent cache, image-optimization cache) by default — a `next build`
   * running while a stray `next dev` is still alive on the same checkout
   * corrupts that shared cache and can leave a production `.next` missing
   * its manifests (observed: `.next/server` + `.next/cache` present with no
   * `BUILD_ID`/`static`, from exactly this collision). Giving dev its own
   * top-level directory removes the shared cache entirely; `next start`
   * always runs with `NODE_ENV=production` (never "development"), so it
   * reliably resolves back to the real build's `.next`.
   */
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    // AVIF first (best compression), WebP fallback for browsers/paths that
    // skip AVIF — Next negotiates via the request's `Accept` header and
    // serves the original format for anything that accepts neither.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
