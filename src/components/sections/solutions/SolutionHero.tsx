/**
 * SolutionHero — the shared hero every solution page's `[slug]` template
 * opens on: a typography-led intro (in the same spirit as the platform
 * page's `CapabilityHero` — see that file's own header for why interior
 * pages open on type, not a cinematic camera hero) beside the legacy
 * static site's "what this looks like" mini evidence panel
 * (`backup/scripe-static/solutions/*.html`).
 *
 * The one structural difference from `CapabilityHero`: this hero's marker
 * rule, label and snapshot accents all read the page's own product-world
 * `accent` prop instead of the brand-wide lime `--accent-text` — the single
 * most visible signal that carries each solution's distinct personality
 * through the shared template (per the task brief's "distinct per-solution
 * personality via accent identity, single coherent template").
 *
 * Task E4: the marker now runs in the ground sequence's mono film-grammar
 * (see `CapabilityHero.tsx`'s header) in the solution's own accent color,
 * the section sits on a quiet cool ground glow + grain (`.atmo`/
 * `.atmo-grain`, `.sol-hero-atmo` in `solutions.css` §1b — shared with
 * `HubHero.tsx`), and the snapshot panel moved from a flat `border` onto
 * the shared elevation ramp (`.atmo-panel`). A Server Component; `Reveal` is
 * the only client leaf.
 *
 * Task G3: the outer column becomes a stack — a framed campus photograph
 * above the snapshot panel, sharing its width. The two halves say the same
 * thing in the two registers this page has to work in: what the solution
 * LOOKS like, then what it MEASURES. It also gives the snapshot panel, which
 * previously floated alone in an otherwise empty column, something to be
 * attached to.
 *
 * `SOLUTION_HERO_IMAGE` maps a slug to its photograph. It is keyed here, not
 * in the locale content files, because a file path is not translated copy —
 * only the alt text is, and that lives on `content.imageAlt`. Both are
 * optional in lockstep: `/solutions/multi-sports-organizations` has no
 * delivered photograph yet (catalog §2, prompt P12 undelivered), so its
 * hero renders exactly as it did before — panel alone, no gap, no
 * placeholder. Dropping the file in and adding one line to each of the two
 * maps is the whole integration when it arrives.
 *
 * A cleanup wave removed the snapshot panel's own "Sample data — replaced
 * with yours during onboarding." footnote: identical text repeated across
 * all four solution pages read as reflexive hedging rather than a real
 * disclosure. The canonical sample-data footnote lives once, on `/platform`'s
 * per-module evidence panels (`CapabilityEvidence.tsx`); this panel's own
 * `snapshot.label` ("What this looks like") already frames the numbers as
 * illustrative without needing a second line to say so again.
 */
import type { AccentId, SolutionContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { PlatePhoto } from "@/components/ui/PlatePhoto";
import { Section } from "@/components/ui/Section";
import { ACCENT_DOT_CLASS, ACCENT_TEXT_CLASS } from "./accents";
import type { SolutionSlug } from "./registry";

/**
 * Per-slug hero photograph. Every master is a 4:5 portrait built by
 * `scripts/build-media-assets.mjs` so the four solution pages read as one
 * set of prints rather than four unrelated crops.
 *
 * `multi-sports-organizations` is INTERIM (Task H2). Its own prompt (catalog
 * §2, P12 — a night 21:9 "many disciplines, one estate") was never
 * delivered, which left the page that sells the highest-value segment as the
 * only solution hero with no photograph at all. `Aerial Sports Complex
 * Masterplan` is the batch's one unassigned file: a golden-hour aerial of a
 * larger estate, rejected for the home hero's day slot precisely because it
 * is a DIFFERENT and bigger complex than the night establishing shot — which
 * is what makes it right here, since "many branches, many sports, one
 * operational picture" is the page's own headline and that frame's literal
 * subject. It is day-graded where the rest of the set is night; the frame is
 * what absorbs that (see `PlatePhoto`'s header — making one photograph read
 * as a deliberate print in a room it does not match is the whole reason the
 * frame exists). Swap the file when the owner's dedicated night frame lands;
 * nothing else on this page changes.
 *
 * `Partial` stays, even now that all four slugs are present: the map is
 * paired with an optional `content.imageAlt`, and the type should keep
 * saying that a slug without a photograph renders correctly rather than
 * hard-requiring one from every future solution page.
 */
const SOLUTION_HERO_IMAGE: Partial<Record<SolutionSlug, { src: string; width: number; height: number }>> = {
  "sports-clubs": { src: "/media/solutions/clubs-sideline.webp", width: 971, height: 1214 },
  "sports-academies": { src: "/media/solutions/academies-dawn.webp", width: 1122, height: 1402 },
  "sports-venues": { src: "/media/solutions/venues-courts.webp", width: 1122, height: 1402 },
  "multi-sports-organizations": { src: "/media/solutions/multisport-masterplan.webp", width: 657, height: 821 },
};

export interface SolutionHeroProps {
  /** The hero slice of the solution page's content. */
  content: SolutionContent["hero"];
  /** Product-world accent identity for this solution. */
  accent: AccentId;
  /** The solution page's route slug, used to look up its photograph. */
  slug: SolutionSlug;
}

/**
 * Renders the solution page's hero: marker + heading + subtitle + CTAs
 * beside the accent-colored snapshot panel.
 *
 * @param props - See {@link SolutionHeroProps}.
 */
export function SolutionHero({ content, accent, slug }: SolutionHeroProps) {
  const image = SOLUTION_HERO_IMAGE[slug];

  return (
    <Section className="atmo atmo-grain sol-hero-atmo !pb-[clamp(var(--space-9),7vh,var(--space-11))]">
      <div className="flex flex-wrap items-center gap-10 lg:gap-14">
        <Reveal className="min-w-0 flex-1 basis-[480px]">
          <p
            className={`flex items-center gap-3 font-mono text-[length:var(--fs-meta)] font-medium tracking-[0.22em] uppercase [&:lang(ar)]:tracking-[0.06em] ${ACCENT_TEXT_CLASS[accent]}`}
          >
            <span className={`inline-block h-px w-6 ${ACCENT_DOT_CLASS[accent]}`} aria-hidden="true" />
            {content.eyebrow}
          </p>
          <h1 className="atmo-title font-display text-text-primary mt-5 text-[length:var(--fs-display)] text-balance">
            {content.title}
          </h1>
          <p className="text-text-secondary mt-5 max-w-[62ch] text-[length:var(--fs-lead)] text-pretty">
            {content.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact" size="lg">
              {content.primaryCta}
            </Button>
            <Button href="/pricing" size="lg" variant="outline">
              {content.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="grid min-w-0 flex-1 basis-72 gap-4 lg:max-w-[380px]">
          {image && content.imageAlt ? (
            <PlatePhoto
              src={image.src}
              alt={content.imageAlt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 64rem) 380px, (min-width: 40rem) 40vw, 90vw"
              priority
              /* The multi-sport print is the one daylight photograph in the
                 set (see SOLUTION_HERO_IMAGE) — its crop marks need the
                 shadow to stay legible on pale roadway. */
              bright={slug === "multi-sports-organizations"}
            />
          ) : null}
          <div className="atmo-panel grid gap-3 rounded-lg p-6">
            <span className={`text-[length:var(--fs-meta)] font-semibold ${ACCENT_TEXT_CLASS[accent]}`}>
              {content.snapshot.label}
            </span>
            {content.snapshot.stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span
                  className={`inline-block size-1.5 shrink-0 rounded-[1px] ${ACCENT_DOT_CLASS[accent]}`}
                  aria-hidden="true"
                />
                <span className="text-text-secondary min-w-0 flex-1 truncate text-[length:var(--fs-small)]">
                  {stat.label}
                </span>
                <span className="text-text-muted text-[length:var(--fs-meta)] tabular-nums whitespace-nowrap">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
