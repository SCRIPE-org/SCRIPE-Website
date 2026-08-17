/**
 * Fusion UI primitive — Card.
 *
 * A raised surface for grouping content (evidence tiles, pricing tiers,
 * feature blocks). Optionally takes a product-world `accent`, rendered as a
 * thicker inline-start border edge in that world's accent color — using the
 * logical `border-inline-start` (Tailwind's `border-s-*`) rather than
 * `border-left`, so the accent edge sits on the correct physical side in
 * both LTR and RTL without any direction-specific code. A Server Component
 * — no hooks.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

/** Product world the card's accent edge signals. */
export type CardAccent = "academy" | "venue" | "fi" | "club";

const ACCENT_BORDER_CLASSES: Record<CardAccent, string> = {
  academy: "border-s-accent-academy",
  venue: "border-s-accent-venue",
  fi: "border-s-accent-fi",
  club: "border-s-accent-club",
};

export interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Product-world accent shown as an inline-start border edge. Omit for a
   *  neutral card with no accent edge. */
  accent?: CardAccent;
  /** Merged after the internal surface/border classes so callers can extend
   *  (never fully override) the computed styling. */
  className?: string;
  children: ReactNode;
}

/**
 * Renders a raised-surface `<div>` with border and radius tokens, and an
 * optional inline-start accent edge.
 *
 * @param props - See {@link CardProps}.
 */
export function Card({ accent, className, children, ...rest }: CardProps) {
  const classes = cx(
    "rounded-lg border border-border-subtle bg-surface-raised p-6",
    accent && cx("border-s-4", ACCENT_BORDER_CLASSES[accent]),
    className,
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
