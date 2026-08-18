/**
 * Fusion UI primitive — Button.
 *
 * The single call-to-action control every page section composes: a lime
 * "primary" fill for the main conversion action, plus quieter "ghost" and
 * "outline" variants for secondary actions. Renders as a native `<button>`
 * when no `href` is given, or as the next-intl `Link` (an `<a>` under the
 * hood, locale-aware) when one is. A Server Component — no hooks, no
 * client-only state — so it composes freely into server-rendered sections.
 *
 * Colors, radius, and motion all come from Fusion tokens (`src/styles/tokens`)
 * via the semantic Tailwind utilities wired in `src/app/globals.css`, so both
 * themes are correct by construction: nothing here hardcodes a hex value or
 * branches on a `dark:` variant. `primary` pairs `bg-cta` with
 * `text-cta-ink` — the dedicated conversion-fill tokens (Task E5): in dark
 * that resolves to the classic full-brightness lime fill with an ink label;
 * in light it inverts to an obsidian chip with a signal-lime label (a piece
 * of the night film in the lit room — see `colors.css`'s header), because a
 * large daylight-olive fill is the one place the dimmed light `--accent`
 * reads muddy instead of branded. Inside a `.night-zone` (hero stage,
 * closing-CTA panels) the same tokens re-pin to the dark pairing, so the
 * film's own CTA never changes with the toggle.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cx } from "./cx";

/** Visual treatment. `"primary"` is the lime-filled default CTA style. */
export type ButtonVariant = "primary" | "ghost" | "outline";

/** Control size, pairing padding with a matching type-scale token. */
export type ButtonSize = "md" | "lg";

interface ButtonOwnProps {
  /** Visual treatment. Defaults to `"primary"`. */
  variant?: ButtonVariant;
  /** Control size. Defaults to `"md"`. */
  size?: ButtonSize;
  /** Merged after the internal variant/size classes so callers can extend
   *  (never fully override) the computed styling. */
  className?: string;
  children?: ReactNode;
}

/**
 * `Button`'s props are a discriminated union on `href`: supplying it renders
 * a next-intl `Link` and exposes real anchor attributes (`target`, `rel`,
 * ...); omitting it renders a `<button>` and exposes real button attributes
 * (`type`, `disabled`, ...). This keeps the rest-spread attributes honest to
 * whichever element actually renders, instead of a lowest-common-denominator
 * intersection that would let a caller pass `disabled` to a link or `target`
 * to a submit button.
 */
export type ButtonProps =
  | (ButtonOwnProps & { href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof ButtonOwnProps
      >)
  | (ButtonOwnProps & { href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        keyof ButtonOwnProps | "href"
      >);

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-md font-body font-medium " +
  "transition duration-[var(--motion-quick)] ease-[var(--ease-standard)] active:scale-[0.985] " +
  "disabled:pointer-events-none disabled:opacity-50";

// Hover/active feedback is opacity- and surface-token-driven rather than a
// dedicated "--accent-hover" token (Fusion doesn't define one yet): opacity
// scales relative to whatever the current theme's accent already is, so it
// stays correct in both themes without a second authored color.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-cta text-cta-ink hover:opacity-90 active:opacity-80",
  ghost: "bg-transparent text-text-primary hover:bg-surface-overlay active:bg-surface-overlay",
  outline:
    "bg-transparent text-text-primary border border-border-strong hover:bg-surface-overlay active:bg-surface-overlay",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-[length:var(--fs-body)]",
  lg: "px-8 py-4 text-[length:var(--fs-lead)]",
};

/**
 * Renders a `<button>` or a locale-aware `<a>`, styled to the Fusion Button
 * contract. `:focus-visible` styling is intentionally not set here — the
 * global rule in `src/app/globals.css` already applies a token-driven focus
 * ring to every focusable element, including this one.
 *
 * @param props - See {@link ButtonProps}. `variant` defaults to `"primary"`,
 *   `size` to `"md"`. Supplying `href` switches the rendered element to a
 *   `Link`; omitting it renders a `<button type="button">` by default (never
 *   the browser's implicit `type="submit"`, which would submit an enclosing
 *   form unless a caller opts in explicitly).
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", size = "md", className, children, href, ...rest } = props;
    const classes = cx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant = "primary", size = "md", className, children, type = "button", ...rest } = props;
  const classes = cx(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
