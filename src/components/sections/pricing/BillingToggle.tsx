"use client";

/**
 * BillingToggle — the pricing page's Monthly/Yearly control.
 *
 * The one client leaf `PlanCards.tsx` needs: everything else about the plan
 * grid (cards, features, both price figures, both period-line captions) is
 * server-rendered exactly once. This component owns none of that markup —
 * it renders only the two toggle buttons and, on click, flips the DOM's
 * `hidden` attribute on whichever price/caption nodes match the newly
 * selected cycle, using the `data-price-slot`/`data-price-cycle-meta`
 * contract `PlanCards.tsx`'s file header documents. That is deliberately
 * imperative DOM work rather than React state threaded back down into
 * `PlanCards` — `PlanCards` is a Server Component with no client-side
 * instance to re-render, so there is no state to lift in the first place;
 * the same "JS toggles an attribute, the server-rendered markup underneath
 * never re-renders" idiom `Reveal.tsx` already uses for its own `.rv-in`
 * class (see that file's header) is reused here for `hidden`. Because both
 * cycles' figures are already present in the server HTML before this
 * component ever hydrates, the toggle produces an instant, zero-fetch swap
 * of both figures and both period lines in one click, with no risk of a
 * flash of missing content.
 *
 * `aria-pressed` (not `aria-selected`/radio semantics) matches the legacy
 * static page's own accessible markup for this exact control
 * (`backup/scripe-static/pricing.html`'s `.sc-billing-tab` buttons).
 */
import { useState } from "react";
import type { PricingContent } from "@/content/types";
import { cx } from "@/components/ui/cx";

/** The two billing cycles the toggle switches between. */
export type BillingCycle = "monthly" | "yearly";

export interface BillingToggleProps {
  /** The billing slice of the pricing page content. */
  content: PricingContent["billing"];
}

/**
 * Sets the `hidden` attribute on every element in the document whose
 * `attr` value ends in `-${cycle}`, and clears it on the sibling set ending
 * in `-${otherCycle}` — the two-span show/hide pair `PlanCards.tsx` renders
 * per price figure and per period-line caption.
 *
 * @param attr - The data attribute name to match on (`data-price-slot` or
 *   `data-price-cycle-meta`).
 * @param cycle - The cycle that should become visible.
 */
function applyCycle(attr: string, cycle: BillingCycle): void {
  const other: BillingCycle = cycle === "monthly" ? "yearly" : "monthly";
  document.querySelectorAll<HTMLElement>(`[${attr}$="-${cycle}"]`).forEach((el) => {
    el.hidden = false;
  });
  document.querySelectorAll<HTMLElement>(`[${attr}$="-${other}"]`).forEach((el) => {
    el.hidden = true;
  });
}

/**
 * Renders the Monthly/Yearly toggle group.
 *
 * @param props - See {@link BillingToggleProps}.
 */
export function BillingToggle({ content }: BillingToggleProps) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  function select(next: BillingCycle) {
    if (next === cycle) return;
    setCycle(next);
    applyCycle("data-price-slot", next);
    applyCycle("data-price-cycle-meta", next);
  }

  const tabClass =
    "rounded-[calc(var(--radius-md)-4px)] px-4 py-2 text-[length:var(--fs-small)] font-medium " +
    "transition-colors duration-[var(--motion-quick)] ease-[var(--ease-standard)]";

  return (
    <div
      role="group"
      aria-label={content.ariaLabel}
      className="border-border-subtle bg-surface-raised inline-flex gap-1 rounded-[var(--radius-md)] border p-1"
    >
      <button
        type="button"
        aria-pressed={cycle === "monthly"}
        onClick={() => select("monthly")}
        className={cx(
          tabClass,
          cycle === "monthly" ? "bg-cta text-cta-ink" : "text-text-secondary hover:text-text-primary",
        )}
      >
        {content.monthlyLabel}
      </button>
      <button
        type="button"
        aria-pressed={cycle === "yearly"}
        onClick={() => select("yearly")}
        className={cx(
          tabClass,
          "inline-flex items-center gap-2",
          cycle === "yearly" ? "bg-cta text-cta-ink" : "text-text-secondary hover:text-text-primary",
        )}
      >
        {content.yearlyLabel}
        <span
          className={cx(
            "text-[length:var(--fs-meta)]",
            cycle === "yearly" ? "text-cta-ink/70" : "text-accent-text",
          )}
        >
          {content.yearlySavingsBadge}
        </span>
      </button>
    </div>
  );
}
