/**
 * Fusion UI primitive — Card.
 *
 * A raised surface for grouping content (evidence tiles, pricing tiers,
 * feature blocks). Optionally takes a product-world `accent`, rendered as a
 * thicker top border edge in that world's accent color, per the design
 * contract (`border-t-*`). Top/bottom is the block axis — unlike the inline
 * axis, it's unaffected by LTR/RTL text direction, so a physical `border-t`
 * is correct here and needs no logical-property substitute. A Server
 * Component — no hooks.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

/** Product world the card's accent edge signals. */
export type CardAccent = "academy" | "venue" | "fi" | "club";

const ACCENT_BORDER_CLASSES: Record<CardAccent, string> = {
  academy: "border-t-accent-academy",
  venue: "border-t-accent-venue",
  fi: "border-t-accent-fi",
  club: "border-t-accent-club",
};

export interface CardProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Product-world accent shown as a top border edge. Omit for a neutral
   *  card with no accent edge. */
  accent?: CardAccent;
  /** Merged after the internal surface/border classes so callers can extend
   *  (never fully override) the computed styling. */
  className?: string;
  children: ReactNode;
}

/**
 * Renders a raised-surface `<div>` with border and radius tokens, and an
 * optional top accent edge.
 *
 * @param props - See {@link CardProps}.
 */
export function Card({ accent, className, children, ...rest }: CardProps) {
  const classes = cx(
    "rounded-lg border border-border-subtle bg-surface-raised p-6",
    accent && cx("border-t-4", ACCENT_BORDER_CLASSES[accent]),
    className,
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
