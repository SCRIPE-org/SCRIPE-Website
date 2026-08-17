/**
 * Site chrome information architecture.
 *
 * The single typed source of navigation and footer data for the whole site
 * shell — `NavBar`, `MegaMenu`, `MobileNav` and `Footer` all read from the
 * consts below instead of hand-authoring their own link lists, so the IA
 * changes in exactly one place. Mirrors the legacy static site's
 * `backup/scripe-static/js/navbar.js` (`SOLUTIONS`, `PRIMARY_NAV`,
 * `FOOTER_COLUMNS`, `SOCIAL`, `LEGAL_LINKS`) with two deliberate departures
 * from that source, both requested for this rebuild rather than carried over
 * by accident:
 *
 * 1. `PRIMARY_NAV` adds `company` as a fifth top-level item (the legacy
 *    desktop bar only surfaced it in the mobile sheet).
 * 2. `MegaMenu` is scoped to Solutions only — Resources is a plain link here
 *    instead of a second dropdown, and the footer's "Resources" column is
 *    dropped in favor of a dedicated "Legal" column (Privacy/Terms), which
 *    the legacy site rendered as a separate un-columned row rather than a
 *    footer column.
 *
 * Every label/description is a dot-path message key (e.g. `"nav.platform"`),
 * never literal copy — components resolve them with next-intl's root-level
 * translator (`useTranslations()` / `getTranslations()` with no namespace
 * argument, so a full `"nav.foo"` path works directly against
 * `messages/{locale}.json`). Hrefs are internal, locale-less route paths;
 * `Link` from `@/i18n/navigation` adds the locale prefix.
 */
import type { CardAccent } from "@/components/ui/Card";

/** A primary top-level navigation entry. */
export interface NavLink {
  /** Stable identifier, used as React key and for menu-item matching. */
  key: string;
  /** Dot-path message key for the visible label. */
  labelKey: string;
  /** Locale-less internal route path. */
  href: string;
  /** True for the one item (`solutions`) that opens a dropdown/accordion
   *  instead of navigating directly — `NavBar` swaps it for `MegaMenu`,
   *  `MobileNav` swaps it for a collapsible group. */
  hasMenu?: boolean;
}

/** One Solutions mega-menu entry: a customer "shape" SCRIPE configures for. */
export interface SolutionItem {
  /** Stable identifier, used as React key. */
  key: string;
  /** Dot-path message key for the item title. */
  labelKey: string;
  /** Dot-path message key for the one-line description. */
  descriptionKey: string;
  /** Locale-less internal route path. */
  href: string;
  /** Product-world accent, rendered as a small color dot (see
   *  `ACCENT_DOT_CLASS`). `"fi"` (indigo) is reused here for the
   *  multi-sports-organizations shape — it is the same indigo the legacy
   *  site called `--accent-football`; Fusion's token set renamed it to
   *  `--accent-fi` for the Football Intelligence product line, but the
   *  color itself is unchanged and this website IA (customer shape, not
   *  product module) predates that rename. */
  accent: CardAccent;
}

/** A single footer link, optionally carrying a Solutions accent dot. */
export interface FooterLink {
  /** Dot-path message key for the visible label. */
  labelKey: string;
  /** Locale-less internal route path. */
  href: string;
  /** Product-world accent dot, shown for the Solutions column's links. */
  accent?: CardAccent;
}

/** One footer column: a title plus its links. */
export interface FooterColumn {
  /** Stable identifier, used as React key. */
  key: string;
  /** Dot-path message key for the column heading. */
  titleKey: string;
  links: FooterLink[];
}

/** A call-to-action link (a nav/footer button or text link). */
export interface CtaLink {
  /** Dot-path message key for the visible label. */
  labelKey: string;
  /** Destination href — an internal route path, or an absolute URL when
   *  `external` is true. */
  href: string;
  /** True when `href` is an absolute URL outside the site (renders as a
   *  plain `<a>` rather than the locale-aware `Link`). */
  external?: boolean;
}

/** A social channel entry. `href: null` means the channel is not yet
 *  published — rendered as muted text instead of a link, never a guessed
 *  or placeholder URL (see `footer.socialNote`). */
export interface SocialLink {
  /** Platform name. A proper noun, so it is not a translation key. */
  label: string;
  href: string | null;
}

/**
 * Primary desktop/mobile navigation, left to right: Platform, Solutions
 * (menu), Pricing, Resources, Company.
 */
export const PRIMARY_NAV: NavLink[] = [
  { key: "platform", labelKey: "nav.platform", href: "/platform" },
  { key: "solutions", labelKey: "nav.solutions", href: "/solutions", hasMenu: true },
  { key: "pricing", labelKey: "nav.pricing", href: "/pricing" },
  { key: "resources", labelKey: "nav.resources", href: "/resources" },
  { key: "company", labelKey: "nav.company", href: "/company" },
];

/** Solutions mega-menu items: the four "shapes" a sports organization runs. */
export const SOLUTIONS: SolutionItem[] = [
  {
    key: "sportsClubs",
    labelKey: "nav.solutionsItems.sportsClubs",
    descriptionKey: "nav.solutionsDescriptions.sportsClubs",
    href: "/solutions/sports-clubs",
    accent: "club",
  },
  {
    key: "sportsAcademies",
    labelKey: "nav.solutionsItems.sportsAcademies",
    descriptionKey: "nav.solutionsDescriptions.sportsAcademies",
    href: "/solutions/sports-academies",
    accent: "academy",
  },
  {
    key: "sportsVenues",
    labelKey: "nav.solutionsItems.sportsVenues",
    descriptionKey: "nav.solutionsDescriptions.sportsVenues",
    href: "/solutions/sports-venues",
    accent: "venue",
  },
  {
    key: "multiSportsOrganizations",
    labelKey: "nav.solutionsItems.multiSportsOrganizations",
    descriptionKey: "nav.solutionsDescriptions.multiSportsOrganizations",
    href: "/solutions/multi-sports-organizations",
    accent: "fi",
  },
];

/** Tailwind background-color class per product-world accent, shared by
 *  `MegaMenu`, `MobileNav` and `Footer` for the small solution dots. */
export const ACCENT_DOT_CLASS: Record<CardAccent, string> = {
  club: "bg-accent-club",
  academy: "bg-accent-academy",
  venue: "bg-accent-venue",
  fi: "bg-accent-fi",
};

/**
 * App sign-in destination. Reads `NEXT_PUBLIC_APP_URL` with the same
 * fallback-domain convention `next.config.ts` already uses for
 * `NEXT_PUBLIC_API_BASE_URL` (falling back to `https://api.scripe.org`), so
 * the chrome links somewhere real in every environment even before the env
 * var is configured.
 */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scripe.org";

/** Primary conversion CTA — "Book a Demo", routed to the contact page. */
export const PRIMARY_CTA: CtaLink = { labelKey: "nav.bookDemo", href: "/contact" };

/** Secondary CTA — "Sign In", routed to the app. */
export const SIGN_IN_CTA: CtaLink = { labelKey: "nav.signIn", href: APP_URL, external: true };

/**
 * Footer link columns: Product, Solutions, Company, Legal. "Product" mirrors
 * the legacy "Platform" column under a renamed heading; "Legal" replaces the
 * legacy site's un-columned Privacy/Terms/Contact row with a real column
 * (Contact is dropped from it here since it already appears in Company).
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    key: "product",
    titleKey: "footer.product",
    links: [
      { labelKey: "footer.platformOverview", href: "/platform" },
      { labelKey: "footer.membersSubs", href: "/platform#members" },
      { labelKey: "footer.reservationsPayments", href: "/platform#reservations" },
      { labelKey: "footer.reportsAnalytics", href: "/platform#reports" },
    ],
  },
  {
    key: "solutions",
    titleKey: "nav.solutions",
    links: SOLUTIONS.map((item) => ({
      labelKey: item.labelKey,
      href: item.href,
      accent: item.accent,
    })),
  },
  {
    key: "company",
    titleKey: "nav.company",
    links: [
      { labelKey: "footer.aboutScripe", href: "/company" },
      { labelKey: "nav.contact", href: "/contact" },
      { labelKey: "nav.pricing", href: "/pricing" },
      { labelKey: "nav.bookDemo", href: "/contact" },
    ],
  },
  {
    key: "legal",
    titleKey: "footer.legal",
    links: [
      { labelKey: "footer.privacy", href: "/company#legal" },
      { labelKey: "footer.terms", href: "/company#legal" },
    ],
  },
];

/** Social channels. Every `href` is `null` until a real profile exists —
 *  see `SocialLink`'s doc comment; `footer.socialNote` covers the display. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: null },
  { label: "X", href: null },
  { label: "Instagram", href: null },
  { label: "YouTube", href: null },
];
