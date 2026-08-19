/**
 * English content for the Terms of Service page (`/terms`).
 *
 * Task G4, written alongside `src/content/en/privacy.ts` — see that file's
 * header for the full evidence trail behind the shared claims (sales-assisted
 * onboarding, indicative pricing, no third-party links). Two claims specific
 * to this document, both verified before writing:
 * - "Sales-assisted onboarding, not self-service": `CompanyContent["legal"]`
 *   (`src/content/en/company.ts`) already states "There is no self-service
 *   provisioning" — carried forward here, not invented for this page.
 * - "Indicative pricing... confirmed with your operations team before
 *   signing": quotes `PricingContent["plansFootnote"]`
 *   (`src/content/en/pricing.ts`) near-verbatim, per this task's instruction
 *   to match the site's existing copy rather than restate the same fact in
 *   different words.
 * - "This Site does not link out to third-party websites": confirmed by
 *   grepping every `href="http`/`href={...https` literal in `src/` — the
 *   only external destination anywhere in the chrome is `SIGN_IN_CTA` in
 *   `src/components/chrome/ia.ts`, which points at `NEXT_PUBLIC_APP_URL`
 *   (the SCRIPE product application itself, not a third party).
 *
 * No governing law, jurisdiction, or legal entity is invented — both are
 * bracketed `"note"`-kind blocks instead (see `LegalBlock`'s doc comment in
 * `src/content/types.ts`).
 */
import type { LegalPageContent } from "../types";

export const termsContent: LegalPageContent = {
  meta: {
    title: "Terms of Service",
    description:
      "The terms governing your use of SCRIPE's marketing website — plain language, pending review by outside counsel before commercial launch.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Terms of Service",
  },
  hero: {
    label: "Legal",
    title: "Terms of Service",
    subtitle:
      "The rules for using this website — plain language, covering the marketing site you're on right now, not the SCRIPE product itself.",
  },
  banner:
    "This is a standard, in-house draft — SCRIPE has not yet had it reviewed by outside counsel. It will be revised before commercial launch.",
  effective: "Effective August 19, 2026",
  tocLabel: "On this page",
  tbdLabel: "Placeholder — pending counsel review",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance of These Terms",
      blocks: [
        {
          kind: "paragraph",
          text: 'These Terms of Service ("Terms") govern your use of the SCRIPE marketing website ("this Site" — the pages under scripe.org you are reading right now). By browsing this Site or submitting the contact form, you agree to these Terms. If you do not agree, please do not use this Site.',
        },
        {
          kind: "paragraph",
          text: "These Terms cover this Site only. If your organization becomes a SCRIPE customer, your use of the SCRIPE product application is governed by a separate agreement issued directly to your organization during onboarding — not by this document.",
        },
        {
          kind: "note",
          text: 'Legal entity name, company registration details, and registered address — to be added here once finalized and reviewed by outside counsel. Until then, "SCRIPE", "we", "us" and "our" refer to the SCRIPE team operating this Site.',
        },
      ],
    },
    {
      id: "about-this-site",
      heading: "About This Site",
      blocks: [
        {
          kind: "paragraph",
          text: "This Site is marketing and informational: it describes SCRIPE's sports-operations platform, its solutions, and its pricing, and lets you request a conversation with our team through the Contact page.",
        },
        {
          kind: "paragraph",
          text: "SCRIPE is sold through sales-assisted onboarding, not self-service signup. There is no account to create and no purchase to complete on this Site — every organization is onboarded directly with our team, who map programs, surfaces and staff before anything goes live. Nothing on this Site is an offer you can accept simply by clicking a button; it is the start of a conversation.",
        },
      ],
    },
    {
      id: "pricing-information",
      heading: "Pricing Information",
      blocks: [
        {
          kind: "paragraph",
          text: "Prices shown on the Pricing page are indicative pricing — every plan is confirmed with your operations team before signing, based on your branches, sports and volume, exactly as that page itself already says. A currency other than SAR shown on that page is a converted or manually selected estimate, not a separate quote.",
        },
        {
          kind: "paragraph",
          text: "We may change the figures shown on the Pricing page at any time without notice. A previously displayed price is not a commitment and does not carry forward into a contract.",
        },
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual Property",
      blocks: [
        {
          kind: "paragraph",
          text: "The SCRIPE name, logo, and every other trademark shown on this Site are ours. Each page's design, layout, text, and graphics are our copyrighted work, or used under license, unless stated otherwise.",
        },
        {
          kind: "paragraph",
          text: "You may view and print pages of this Site for your own personal, non-commercial reference, or to share internally within your organization while you evaluate SCRIPE. You may not otherwise copy, reproduce, republish, or distribute any part of this Site, or use our name or marks, without our prior written permission.",
        },
      ],
    },
    {
      id: "acceptable-use",
      heading: "Acceptable Use",
      blocks: [
        {
          kind: "paragraph",
          text: "When using this Site, you agree not to:",
        },
        {
          kind: "list",
          items: [
            "Submit false, misleading, or someone else's personal information through the contact form.",
            "Attempt to bypass, probe, or defeat this Site's anti-spam or security mechanisms.",
            "Use an automated means (a bot, scraper, or crawler outside normal search-engine indexing) to access this Site at a volume or in a manner that could disrupt it.",
            "Attempt to gain unauthorized access to any part of this Site, its underlying infrastructure, or any account, system, or network connected to it.",
            "Use this Site to transmit anything unlawful, harmful, or infringing.",
          ],
        },
      ],
    },
    {
      id: "no-warranty",
      heading: "No Warranty",
      blocks: [
        {
          kind: "paragraph",
          text: 'This Site, and everything on it, is provided "as is" and "as available," without warranty of any kind, express or implied. We do not warrant that this Site will be uninterrupted, error-free, or free of harmful components, or that any information on it — including illustrative pricing, illustrative product screenshots, or any figure labeled as an example — is complete, current, or free of mistakes.',
        },
        {
          kind: "paragraph",
          text: "Nothing on this Site is professional, legal, or financial advice.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation of Liability",
      blocks: [
        {
          kind: "paragraph",
          text: "To the fullest extent permitted by law, SCRIPE is not liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, or data, arising from your use of, or inability to use, this Site — even if we have been advised of the possibility of such damages.",
        },
        {
          kind: "paragraph",
          text: 'Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited under the law that ultimately governs these Terms (see "Governing Law" below).',
        },
      ],
    },
    {
      id: "third-party-links",
      heading: "Third-Party Links",
      blocks: [
        {
          kind: "paragraph",
          text: "This Site does not link out to third-party websites. The one external destination linked from this Site is the SCRIPE product application itself — a SCRIPE product, not a third party. If that ever changes, this section will be updated to describe how we handle links to sites we do not control.",
        },
      ],
    },
    {
      id: "governing-law",
      heading: "Governing Law",
      blocks: [
        {
          kind: "note",
          text: "The governing law and jurisdiction for these Terms have not yet been finalized and will be added once determined by outside counsel, before commercial launch. Until this section names one, treat these Terms as a good-faith draft rather than a jurisdiction-specific legal instrument.",
        },
      ],
    },
    {
      id: "changes-to-terms",
      heading: "Changes to These Terms",
      blocks: [
        {
          kind: "paragraph",
          text: "We may update these Terms as this Site or our business practices change — most immediately once outside counsel reviews them before commercial launch (see the notice at the top of this page). We will update the effective date below whenever we do, and for any change we consider material, we will make it clearly visible on this page rather than editing it quietly. Continuing to use this Site after an update means you accept the revised Terms.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact Us",
      blocks: [
        {
          kind: "paragraph",
          text: 'Questions about these Terms are welcome through the form on our Contact page. As of the effective date, that form is not yet connected to a live inbox — see our Privacy Policy\'s "How We Use Your Information" section for the honest detail. If you already have a SCRIPE contact from an onboarding conversation, reach them directly in the meantime.',
        },
      ],
    },
  ],
};
