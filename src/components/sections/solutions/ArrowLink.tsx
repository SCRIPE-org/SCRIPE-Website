/**
 * ArrowLink — the solutions area's shared deep-link affordance: a text link
 * with a direction-semantic arrow that flips in RTL (`.rtl-flip`, defined in
 * `src/styles/solutions.css` §1a — its own copy, not an import from
 * `home.css`, since that stylesheet only loads on the home route; see
 * `src/styles/solutions.css`'s header for the full reasoning). A page-scoped
 * copy of `src/components/sections/home/ArrowLink.tsx`'s
 * contract, per that file's own "self-contained page folder" convention. A
 * Server Component — renders the locale-aware `Link` from `@/i18n/navigation`.
 */
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "@/components/ui/cx";

export interface ArrowLinkProps {
  /** Locale-less internal route path. */
  href: string;
  /** Merged after the internal classes so callers can extend the styling. */
  className?: string;
  children: ReactNode;
}

/**
 * Renders the arrow deep link.
 *
 * @param props - See {@link ArrowLinkProps}.
 */
export function ArrowLink({ href, className, children }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "text-text-primary hover:text-accent-text inline-flex items-center gap-2 text-[length:var(--fs-small)] font-medium transition-colors duration-[var(--motion-quick)]",
        className,
      )}
    >
      {children}
      <span className="rtl-flip inline-flex" aria-hidden="true">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
