/**
 * Tests for the shared SEO metadata builder.
 *
 * Covers the canonical/hreflang contract every page's `generateMetadata`
 * relies on, and locks in the `og:image`/`twitter:image` regression found
 * during Task 25 verification: every page (not just the home page) must
 * carry an absolute, locale-scoped OpenGraph/Twitter image, because Next's
 * `[locale]/opengraph-image.tsx` file convention only auto-attaches to the
 * page.tsx in that exact segment folder — every other page's own
 * `openGraph` object (built here) silently replaced it with no image at
 * all until `pageMetadata` set `images` explicitly.
 *
 * Also locks in Task G6's per-locale OG image contract: `en` uses the
 * dynamic Satori route, `ar` uses the static Chromium-rendered PNG
 * (`public/og/og-ar.png`) — see `metadata.ts`'s `ogImageUrl` comment for
 * why the two locales diverge (Satori cannot shape Arabic script).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { pageMetadata, ROUTES, siteUrl } from "./metadata";

const SITE_URL = "https://www.scripe.org";

test("pageMetadata builds a self-referential canonical and both-locale alternates with x-default", () => {
  const meta = pageMetadata({
    locale: "en",
    path: "/pricing",
    title: "Pricing",
    description: "Plans and pricing.",
  });

  assert.equal(meta.alternates?.canonical, `${SITE_URL}/en/pricing`);
  assert.deepEqual(meta.alternates?.languages, {
    en: `${SITE_URL}/en/pricing`,
    ar: `${SITE_URL}/ar/pricing`,
    "x-default": `${SITE_URL}/en/pricing`,
  });
});

test("pageMetadata sets an absolute, locale-scoped og:image and twitter:image for a non-home page", () => {
  const meta = pageMetadata({
    locale: "ar",
    path: "/pricing",
    title: "الأسعار",
    description: "الخطط والأسعار.",
  });

  const ogImages = meta.openGraph && "images" in meta.openGraph ? meta.openGraph.images : undefined;
  assert.ok(Array.isArray(ogImages) && ogImages.length === 1);
  const [image] = ogImages as Array<{ url: string; width: number; height: number; alt: string }>;
  assert.equal(image.url, `${SITE_URL}/og/og-ar.png`);
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
  assert.ok(image.alt.length > 0);

  assert.deepEqual(meta.twitter && "images" in meta.twitter ? meta.twitter.images : undefined, [
    `${SITE_URL}/og/og-ar.png`,
  ]);
});

test("pageMetadata's og:image locale matches the page locale, not always 'en'", () => {
  const en = pageMetadata({ locale: "en", path: "/", title: "t", description: "d" });
  const ar = pageMetadata({ locale: "ar", path: "/", title: "t", description: "d" });

  const enImages = en.openGraph && "images" in en.openGraph ? en.openGraph.images : undefined;
  const arImages = ar.openGraph && "images" in ar.openGraph ? ar.openGraph.images : undefined;
  const enUrl = (enImages as Array<{ url: string }>)[0].url;
  const arUrl = (arImages as Array<{ url: string }>)[0].url;

  assert.equal(enUrl, `${SITE_URL}/en/opengraph-image`);
  assert.equal(arUrl, `${SITE_URL}/og/og-ar.png`);
});

test("pageMetadata's ar og:image is the static Chromium-rendered PNG, not the Satori route (Task G6 — Satori cannot shape Arabic)", () => {
  const ar = pageMetadata({ locale: "ar", path: "/pricing", title: "t", description: "d" });
  const arImages = ar.openGraph && "images" in ar.openGraph ? ar.openGraph.images : undefined;
  const arUrl = (arImages as Array<{ url: string }>)[0].url;

  assert.equal(arUrl, `${SITE_URL}/og/og-ar.png`);
  assert.ok(!arUrl.includes("/opengraph-image"), "ar og:image must not point at the dynamic Satori route");
});

test("ROUTES excludes notFound and has 13 indexable entries", () => {
  assert.equal(ROUTES.length, 13);
  assert.equal(
    ROUTES.some((route) => route.id === "notFound"),
    false,
  );
});

test("siteUrl falls back to the production origin and strips a trailing slash", () => {
  const original = process.env.SITE_URL;
  try {
    process.env.SITE_URL = "https://example.com/";
    assert.equal(siteUrl(), "https://example.com");
    delete process.env.SITE_URL;
    assert.equal(siteUrl(), SITE_URL);
  } finally {
    if (original === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = original;
  }
});
