/**
 * Stroke icons for the contact page's side panel — the checklist bullet
 * glyph plus one glyph per {@link ContactChannel} `id` (`"email"` | `"phone"`
 * | `"response"`).
 *
 * Every path is ported verbatim from `backup/scripe-static/contact.html`'s
 * inline SVGs, kept as this page's own self-contained copy per this
 * codebase's established "self-contained page folder" convention (see
 * `src/components/sections/company/icons.tsx`'s own header for the same
 * note) rather than a cross-page import. Unknown channel ids fall back to a
 * generic dot glyph rather than rendering nothing, so a content typo never
 * produces a blank tile.
 *
 * A Server Component — no hooks.
 */
import type { ContactChannel } from "@/content/types";

/** One glyph per {@link ContactChannel.id}. */
const CHANNEL_ICON_PATHS: Record<string, React.ReactNode> = {
  /** Email — envelope. */
  email: (
    <>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
    </>
  ),
  /** Phone — handset. */
  phone: (
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  ),
  /** Response — clock. */
  response: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
};

/** Fallback glyph for an unrecognized channel id — a plain dot. */
const FALLBACK_CHANNEL_ICON = <circle cx="12" cy="12" r="3" />;

export interface ChannelIconProps {
  /** A {@link ContactChannel}'s `id` (e.g. `"email"`). */
  id: string;
}

/** Renders one contact-channel card's stroke glyph. */
export function ChannelIcon({ id }: ChannelIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {CHANNEL_ICON_PATHS[id] ?? FALLBACK_CHANNEL_ICON}
    </svg>
  );
}

/** The muted checklist glyph for the "what happens next" list — the same
 *  vocabulary `src/components/sections/company/MissionVision.tsx`'s
 *  `CheckGlyph` establishes, kept as an independent copy per this page's own
 *  self-contained folder. */
export function CheckGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-text-secondary"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
