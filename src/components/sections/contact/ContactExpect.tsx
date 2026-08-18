/**
 * ContactExpect — the contact page's side panel: "what happens next"
 * checklist paired with the honest email/phone/response-time channel notes.
 *
 * The form's conversational other half — `src/app/[locale]/contact/page.tsx`
 * renders this beside `ContactForm` in a two-column grid (form wider, this
 * panel narrower; the grid collapses to a single stacked column under `lg`).
 * Ported from `backup/scripe-static/contact.html`'s `<aside>`: a plain
 * checklist (reusing the same muted `CheckGlyph` vocabulary
 * `src/components/sections/company/MissionVision.tsx` establishes for its
 * own feature checklist) followed by three bordered channel cards. Every
 * channel value is honest, never a placeholder pretending to be real contact
 * information — see `src/content/en/contact.ts`'s `channels` for why email
 * and phone both read "Not published yet" rather than an invented address.
 *
 * A Server Component — no interactivity here at all, so none of this page's
 * client bundle weight comes from this panel; `Reveal` is the only client
 * leaf, matching every other section on the site.
 *
 * Task E4: the channel-note panel moved from a flat border onto the shared
 * elevation ramp (`.atmo-panel`, `src/styles/tokens/atmosphere.css`).
 */
import type { ContactContent } from "@/content/types";
import { Reveal } from "@/components/motion/Reveal";
import { ChannelIcon, CheckGlyph } from "./icons";

export interface ContactExpectProps {
  /** The "what happens next" checklist slice of the contact page content. */
  expect: ContactContent["expect"];
  /** The honest contact-channel notes slice of the contact page content. */
  channels: ContactContent["channels"];
}

/**
 * Renders the "what happens next" checklist and the channel-note cards.
 *
 * @param props - See {@link ContactExpectProps}.
 */
export function ContactExpect({ expect, channels }: ContactExpectProps) {
  return (
    <Reveal y={20} delay={120} className="grid gap-8 content-start">
      <div className="grid gap-4">
        <span className="text-[length:var(--fs-meta)] font-semibold uppercase tracking-[0.14em] text-accent-text [&:lang(ar)]:tracking-normal [&:lang(ar)]:normal-case">
          {expect.label}
        </span>
        <ul className="m-0 grid list-none gap-3 p-0">
          {expect.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckGlyph />
              <span className="text-[length:var(--fs-small)] text-pretty text-text-primary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="atmo-panel grid gap-5 rounded-lg p-6">
        {channels.items.map((channel) => (
          <div key={channel.id} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-md border border-border-subtle text-text-muted"
            >
              <ChannelIcon id={channel.id} />
            </span>
            <span className="grid min-w-0 gap-0.5">
              <span className="text-[length:var(--fs-small)] font-medium text-text-muted">{channel.label}</span>
              <span className="text-[length:var(--fs-small)] break-words text-text-primary">{channel.value}</span>
              <span className="text-[length:var(--fs-meta)] text-text-muted">{channel.note}</span>
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
