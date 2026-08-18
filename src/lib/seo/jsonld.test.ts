/**
 * Tests for the JSON-LD structured data builders.
 *
 * Covers the shape contract each builder must satisfy (Task 12 and page
 * tasks depend on these exact field names) and the escaping contract
 * `serializeJsonLd` guarantees before `JsonLd.tsx` injects a builder's
 * output into a `<script>` tag.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildOrganization,
  buildSoftwareApplication,
  buildBreadcrumb,
  serializeJsonLd,
} from "./jsonld";

const SITE_URL = "https://www.scripe.org";

test("buildOrganization derives @type, url, and logo from siteUrl", () => {
  const org = buildOrganization(SITE_URL);

  assert.equal(org["@context"], "https://schema.org");
  assert.equal(org["@type"], "Organization");
  assert.equal(org.name, "SCRIPE");
  assert.equal(org.url, SITE_URL);
  assert.equal(org.logo, `${SITE_URL}/brand/mark/scripe-logo-512.png`);
  assert.deepEqual(org.sameAs, []);
});

test("buildSoftwareApplication url includes the locale and inLanguage matches it", () => {
  const app = buildSoftwareApplication(SITE_URL, "ar");

  assert.equal(app["@type"], "SoftwareApplication");
  assert.equal(app.name, "SCRIPE");
  assert.equal(app.applicationCategory, "BusinessApplication");
  assert.equal(app.operatingSystem, "Web");
  assert.equal(app.url, `${SITE_URL}/ar`);
  assert.equal(app.inLanguage, "ar");
  assert.equal("offers" in app, false);
});

test("buildBreadcrumb assigns 1-based sequential positions for a 3-item input", () => {
  const breadcrumb = buildBreadcrumb([
    { name: "Home", url: `${SITE_URL}/en` },
    { name: "Venue", url: `${SITE_URL}/en/venue` },
    { name: "Booking", url: `${SITE_URL}/en/venue/booking` },
  ]);

  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.deepEqual(
    breadcrumb.itemListElement.map((item) => item.position),
    [1, 2, 3],
  );
  assert.deepEqual(
    breadcrumb.itemListElement.map((item) => item["@type"]),
    ["ListItem", "ListItem", "ListItem"],
  );
  assert.equal(breadcrumb.itemListElement[1].name, "Venue");
  assert.equal(breadcrumb.itemListElement[1].item, `${SITE_URL}/en/venue`);
});

test("serializeJsonLd escapes '<' so a '</script>' substring never appears raw", () => {
  const payload = { name: '</script><script>alert(1)</script>' };

  const serialized = serializeJsonLd(payload);

  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("\\u003cscript>alert(1)\\u003c/script>"), true);
});
