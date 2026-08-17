/**
 * Renders a JSON-LD payload as an inline `<script type="application/ld+json">` tag.
 *
 * A Server Component — no hooks, no client JS shipped. This is the ONLY
 * sanctioned way to inject a `src/lib/seo/jsonld.ts` builder's output into
 * the page: it always goes through {@link serializeJsonLd}, which escapes
 * `<` so a `</script>` substring in the data (e.g. an untrusted title) can
 * never close the tag early. Never hand-roll `JSON.stringify` +
 * `dangerouslySetInnerHTML` at a call site instead of using this component.
 */
import { serializeJsonLd } from "@/lib/seo/jsonld";

export interface JsonLdProps {
  /** Any JSON-serializable JSON-LD payload — typically the return value of
   *  `buildOrganization`, `buildSoftwareApplication`, or `buildBreadcrumb`. */
  data: object;
}

/**
 * Emits `data` as a `<script type="application/ld+json">` tag.
 *
 * @param props - See {@link JsonLdProps}.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Sole sanctioned use of dangerouslySetInnerHTML: serializeJsonLd
      // escapes `<` before this string ever reaches the DOM.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
