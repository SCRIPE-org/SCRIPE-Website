/**
 * English content for the Privacy Policy page (`/privacy`).
 *
 * Task G4: a launch blocker, not a feature — the Contact page's demo-request
 * form (`ContactForm.tsx` / `submit-lead.ts`) collects a visitor's name,
 * email, organization, phone and message, and until this page existed there
 * was no policy anywhere on the site describing that. This is a standard,
 * honest, plain-language policy the SCRIPE team wrote in-house so the site
 * would not go on collecting PII with no policy at all — explicitly NOT a
 * substitute for a counsel-drafted one (see `banner`, and every section of
 * kind `"note"` below).
 *
 * Every factual claim here was verified against this codebase before being
 * written, not assumed:
 * - Contact form fields: `parseLeadInput` in `src/lib/leads/submit-lead.ts`
 *   reads exactly name/email/organization/phone/type/message; phone is the
 *   only optional one (`ContactContent["form"]["hints"]["phone"]`).
 * - The honeypot (`company_website`) and time-trap (`startedAt`) fields:
 *   `parseLeadInput` reads them, but `toLeadPayload` deliberately excludes
 *   both from the outbound POST body, and `validateLead`'s spam path never
 *   surfaces a distinct status (see `submit-lead.ts`'s own header, "SPAM ->
 *   'sent'").
 * - "Not yet connected" / nothing stored today: `submitLead` returns
 *   `{ status: "not-connected" }` whenever `process.env.LEADS_ENDPOINT` is
 *   unset, without writing anywhere — there is no database call in this
 *   codebase at all.
 * - PII-free logging: `submit-lead.ts`'s two `console.error` call sites log
 *   only a fixed string plus `response.status` or `error.name` — see that
 *   file's "PII-FREE LOGGING" header section.
 * - `scripe-theme` / `scripe-currency` are `localStorage` keys, never
 *   cookies, never read server-side — confirmed by grepping every
 *   `localStorage` call site (`ThemeGuard.tsx`, `theme-script.ts`,
 *   `PricingCurrencyProvider.tsx`).
 * - Zero cookies sitewide: `src/i18n/routing.ts` sets `localeCookie: false`
 *   explicitly, and there is no other `cookies()`/`Set-Cookie` call anywhere
 *   in `src/`.
 * - Zero third-party scripts: no `next/script` pointed at an external host,
 *   no analytics/ad-pixel/chat-widget package, no Google Fonts / CDN font —
 *   every face is `next/font/local` from `src/fonts/*.woff2`; the two inline
 *   `<script>` tags in `src/app/[locale]/layout.tsx` are this codebase's own
 *   theme-flash-prevention and no-JS-detection scripts, neither of which
 *   contacts a server.
 * - Pricing-page geo call: `src/lib/pricing/pricing-context.ts` documents a
 *   public, unauthenticated `GET` with no request body/cookies; country is
 *   detected server-side from Cloudflare's `CF-IPCountry` header, not from
 *   anything the client sends, and the website itself never stores an IP.
 *
 * No fact is invented: there is no legal entity name, registration number,
 * registered address, DPO name, or jurisdiction anywhere in this codebase or
 * its docs, so each is a clearly bracketed `"note"`-kind block instead of a
 * guess (see `LegalBlock`'s own doc comment in `src/content/types.ts`).
 */
import type { LegalPageContent } from "../types";

export const privacyContent: LegalPageContent = {
  meta: {
    title: "Privacy Policy",
    description:
      "What SCRIPE's marketing website collects, why, and the choices you have — a plain-language policy covering this Site, pending review by outside counsel before commercial launch.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Privacy Policy",
  },
  hero: {
    label: "Legal",
    title: "Privacy Policy",
    subtitle:
      "What this website collects, why, and the choices you have — in plain language, covering the marketing site you're on right now.",
  },
  banner:
    "This is a standard, in-house draft — SCRIPE has not yet had it reviewed by outside counsel. It will be revised before commercial launch.",
  effective: "Effective August 19, 2026",
  tocLabel: "On this page",
  tbdLabel: "Placeholder — pending counsel review",
  sections: [
    {
      id: "introduction",
      heading: "Introduction & Scope",
      blocks: [
        {
          kind: "paragraph",
          text: 'This Privacy Policy explains what personal data the SCRIPE marketing website ("this Site" — the pages under scripe.org you are reading right now) collects, why, how it is handled, and what choices you have. It covers this Site only. The SCRIPE product application used by onboarded organizations is governed by its own agreement, issued directly to your organization during onboarding — not by this document.',
        },
        {
          kind: "note",
          text: 'Legal entity name, company registration details, and registered address — to be added here once finalized and reviewed by outside counsel. Until then, "SCRIPE", "we", "us" and "our" refer to the SCRIPE team operating this Site.',
        },
        {
          kind: "paragraph",
          text: "We wrote this policy in-house, in plain language, so this Site would not go live collecting information with no policy at all. As the notice at the top of this page says, it is scheduled for review by outside counsel before commercial launch, and may change as a result.",
        },
      ],
    },
    {
      id: "information-we-collect",
      heading: "Information We Collect",
      blocks: [
        {
          kind: "paragraph",
          text: "We collect personal data in exactly two ways, both described below. We do not buy data about you from anyone else, and we never combine what you give us with data purchased from a third party.",
        },
        {
          kind: "list",
          items: [
            "Contact form — when you submit the demo-request form on our Contact page, we collect your name, email address, organization name, organization type, an optional phone number, and the message you write. Every field except phone is required.",
            "Anti-spam signals — the same form quietly carries two anti-abuse mechanics: a hidden field a genuine visitor never sees or fills in, and a minimum-time check. Both exist only to tell a human submission from an automated one; neither is sent to our backend or stored anywhere.",
            'Device-local preferences — your color-theme choice, and, on the Pricing page, a currency override if you pick one, are saved only in your own browser\'s local storage. See "Local Storage, Not Cookies" below.',
            "Standard hosting logs — like almost every website, our hosting provider (Vercel) automatically records basic request information (IP address, browser identifier, requested page, timestamp) for security and reliability. We do not query these logs for marketing or profiling.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      heading: "How We Use Your Information",
      blocks: [
        {
          kind: "paragraph",
          text: "We use contact-form information for exactly one purpose: to respond to your enquiry and, if you are interested, to arrange a sales-assisted onboarding conversation. We do not add you to a marketing list from a form submission, we do not sell or rent your information, and we do not use it to build an advertising profile.",
        },
        {
          kind: "paragraph",
          text: 'As of the effective date below, this Site\'s contact form is not yet connected to a live inbox. Submitted details reach our website\'s own server to be validated, but are not forwarded to any CRM or lead-management system and are not written to a database — nothing is retained once that request completes. The form tells you this honestly ("not yet connected") rather than pretending your message reached a team. We intend to connect a live backend before commercial launch; this section will be updated the moment that happens.',
        },
        {
          kind: "paragraph",
          text: "We never log the contents of a submission, including when delivery fails — at most a non-personal status code, never your name, email, organization, phone number, or message.",
        },
      ],
    },
    {
      id: "legal-basis",
      heading: "Legal Basis for Processing",
      blocks: [
        {
          kind: "paragraph",
          text: "We rely on two lawful bases, in the framing most data-protection laws use:",
        },
        {
          kind: "list",
          items: [
            'Consent — submitting the contact form is a deliberate, informed action: you choose to give us your details in order to be contacted. You can withdraw that consent at any time by asking us to delete what you sent (see "Your Rights" below).',
            "Legitimate interest — standard hosting logs are processed under our legitimate interest in keeping this Site secure, reliable, and free of abuse, an interest we believe does not override your own privacy interests given how limited and short-lived that data is.",
          ],
        },
        {
          kind: "paragraph",
          text: "We do not rely on any other legal basis for this Site — it does not perform a contract with individual visitors, and it does not process data under a specific law that requires it to.",
        },
      ],
    },
    {
      id: "local-storage",
      heading: "Local Storage, Not Cookies",
      blocks: [
        {
          kind: "paragraph",
          text: "This Site sets no cookies. We built it that way deliberately — even the language you are reading this in is resolved from the page's URL and your browser's language settings, never stored in a cookie.",
        },
        {
          kind: "paragraph",
          text: "Two small preferences live in your browser's own local storage instead, and never leave your device:",
        },
        {
          kind: "list",
          items: [
            "scripe-theme — remembers whether you last chose light or dark mode.",
            "scripe-currency — remembers a currency you manually chose on the Pricing page, if any.",
          ],
        },
        {
          kind: "paragraph",
          text: "Local storage is not a cookie: it is never sent to our server, or anyone else's, with a page request; it is not visible to us in any log; and it is entirely under your control — clearing your browser's site data removes it instantly.",
        },
      ],
    },
    {
      id: "no-tracking",
      heading: "No Third-Party Tracking",
      blocks: [
        {
          kind: "paragraph",
          text: "This Site loads no analytics package, no advertising pixel, no chat widget, and no third-party font or script of any kind. Every font is hosted on our own server; the only two inline scripts on the page are ours, and both exist purely to apply your saved theme before the page paints and to detect whether JavaScript is enabled — neither one contacts any server.",
        },
        {
          kind: "paragraph",
          text: "We think this is worth stating plainly rather than in boilerplate: most marketing websites quietly load a dozen third-party trackers before a visitor makes a single click. This one does not, today — and it will not without this policy being updated first.",
        },
      ],
    },
    {
      id: "storage-retention",
      heading: "Storage, Retention & Security",
      blocks: [
        {
          kind: "paragraph",
          text: "We keep the little personal data this Site handles for only as long as the purpose above requires:",
        },
        {
          kind: "list",
          items: [
            "Contact-form data, once a live backend is connected, will be retained only for as long as needed to respond to your enquiry and complete a resulting sales conversation, then deleted or anonymized.",
            "Device-local preferences persist only in your own browser, under your control, until you clear them.",
            "Standard hosting logs are retained on Vercel's own standard schedule, which we have not overridden with a longer retention period.",
          ],
        },
        {
          kind: "paragraph",
          text: 'We use security measures appropriate to the small amount of data involved: this Site is served entirely over HTTPS, the contact form is protected against automated abuse (see "Information We Collect" above), and no personal data is ever written to our error-tracking output.',
        },
        {
          kind: "note",
          text: "The exact retention period for contact-form data, and a full security policy, will be documented here once a live backend and a formal data-processing framework are in place and reviewed by outside counsel.",
        },
      ],
    },
    {
      id: "international-transfers",
      heading: "International Data Transfers",
      blocks: [
        {
          kind: "paragraph",
          text: "This Site is hosted on Vercel's global infrastructure, which may process a request through servers located in a different country from where you are browsing. Separately, our Pricing page may call the SCRIPE backend to suggest a currency for your region; that backend detects your country from a network-level header supplied by our infrastructure provider, not from anything this Site sends it — this Site itself does not store your IP address.",
        },
        {
          kind: "note",
          text: "The specific countries involved in hosting and backend processing, and the legal safeguards that apply to any cross-border transfer of personal data, are still being finalized and will be documented here once our infrastructure footprint and legal entity are settled and reviewed by outside counsel.",
        },
      ],
    },
    {
      id: "your-rights",
      heading: "Your Rights",
      blocks: [
        {
          kind: "paragraph",
          text: "Wherever you are located, and whichever specific data-protection law applies to you, we will honor reasonable requests to:",
        },
        {
          kind: "list",
          items: [
            "Access the personal data we hold about you.",
            "Correct any of it that is inaccurate or out of date.",
            "Delete it, including a contact-form submission you no longer want us to have.",
            "Object to, or ask us to restrict, how we use it.",
          ],
        },
        {
          kind: "paragraph",
          text: 'To exercise any of these rights, use the route described in "Contact Us" below. We will respond as quickly as we reasonably can.',
        },
      ],
    },
    {
      id: "children",
      heading: "Children's Privacy",
      blocks: [
        {
          kind: "paragraph",
          text: "This Site is a business-to-business marketing website addressed to owners, directors and operations leaders of sports organizations. It is not directed at children, and we do not knowingly collect personal data from anyone submitting the contact form on behalf of a child. If you believe a child has submitted personal data to us, contact us using the route below and we will delete it.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to This Policy",
      blocks: [
        {
          kind: "paragraph",
          text: "We may update this policy as this Site, our data practices, or the law change — most immediately once outside counsel reviews it before commercial launch (see the notice at the top of this page). We will update the effective date below whenever we do, and for any change we consider material, we will make it clearly visible on this page rather than editing it quietly.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact Us",
      blocks: [
        {
          kind: "paragraph",
          text: 'The most reliable way to reach us about this policy, or to exercise any of the rights above, is the form on our Contact page. As of the effective date, this Site does not yet have a published, monitored email address for privacy requests specifically — see "How We Use Your Information" above for why the form itself is not yet connected to a live inbox. Until both of those are in place: if you already have a SCRIPE contact from an onboarding conversation, reach them directly; otherwise, please check back, as this section will name a monitored inbox the moment one exists.',
        },
      ],
    },
  ],
};
