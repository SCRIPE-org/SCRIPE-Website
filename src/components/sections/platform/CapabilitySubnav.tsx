"use client";

/**
 * CapabilitySubnav — the sticky in-page subnav: one link per product-family
 * group, active-highlighted as the reader scrolls past that family's
 * section.
 *
 * The one client leaf the brief allows for this page beyond the shared
 * `Reveal` primitive: a single `IntersectionObserver` (not the shared one
 * `Reveal.tsx` uses — there is exactly one subnav per page, so the sharing
 * complexity that pays off for dozens of `Reveal`s buys nothing here) watches
 * a thin horizontal band just under the stacked nav bars and flips the
 * active link to whichever group section is currently crossing it — the
 * standard scrollspy technique. Server and pre-hydration markup both render
 * the first group active, so nothing is layout-shifted or empty before JS
 * runs; the observer only ever refines that starting state, never creates
 * it. Clicking a link is a plain `<a href="#id">` — no JS-driven scroll —
 * so it works with JS disabled and gets the browser's native (optionally
 * `scroll-behavior: smooth`, reduced-motion gated in `platform.css`) anchor
 * jump, offset correctly by each section's `scroll-margin-block-start`.
 *
 * Each link's active state renders in that family's own accent color (not a
 * generic "current tab" indicator) via `ACCENT_TEXT_CLASS`/`ACCENT_BORDER_CLASS`
 * from `./accents` — the same accent-identity system every other platform
 * section uses, extended to this page's one interactive chrome element.
 */
import { useEffect, useState } from "react";
import type { AccentId } from "@/content/types";
import { cx } from "@/components/ui/cx";
import { ACCENT_BORDER_CLASS, ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS } from "./accents";

/** One subnav entry — mirrors a `CapabilityGroup`'s id/name/accent. */
export interface CapabilitySubnavItem {
  id: string;
  name: string;
  accent: AccentId;
}

export interface CapabilitySubnavProps {
  /** The five family-group entries, in display order. */
  items: CapabilitySubnavItem[];
  /** Accessible label for the subnav landmark. */
  label: string;
}

/**
 * Renders the sticky subnav bar.
 *
 * @param props - See {@link CapabilitySubnavProps}.
 */
export function CapabilitySubnav({ items, label }: CapabilitySubnavProps) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        // Shrinks the observed viewport to a thin band just under the
        // stacked nav (72px) + this subnav (~52px) bars; a section becomes
        // "active" the moment its header crosses into that band.
        rootMargin: "-136px 0px -70% 0px",
        threshold: 0,
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={label}
      className="border-border-subtle bg-surface-page/90 sticky top-[72px] z-[var(--z-subnav)] border-b backdrop-blur-md"
    >
      <div className="cap-subnav-scroll mx-auto flex max-w-[1360px] gap-1 overflow-x-auto px-[clamp(var(--space-5),4vw,var(--space-9))]">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active ? "true" : undefined}
              className={cx(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-[length:var(--fs-small)] font-medium whitespace-nowrap transition-colors duration-[var(--motion-quick)]",
                // Active state lights up in the family's own accent color —
                // each of the five tabs reads as that family's identity, not
                // a generic "current tab" indicator.
                active
                  ? `${ACCENT_BORDER_CLASS[item.accent]} ${ACCENT_TEXT_CLASS[item.accent]}`
                  : "text-text-muted hover:text-text-primary border-transparent",
              )}
            >
              <span className={`inline-block size-1.5 rounded-full ${ACCENT_DOT_CLASS[item.accent]}`} aria-hidden="true" />
              <bdi>{item.name}</bdi>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
