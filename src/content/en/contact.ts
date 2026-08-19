/**
 * English content for the contact page (`/contact`).
 *
 * Ported verbatim from `backup/scripe-static/contact.html`: page-header
 * (hero) → the demo-request form card (eyebrow, intro, field placeholders,
 * field hints, submit button, footnote) → the "what happens next" checklist
 * → the honest email/phone/response-time channel notes. See
 * `ContactContent`'s doc comment in `src/content/types.ts` for exactly which
 * strings live here versus in `messages/en.json`'s `forms` namespace (field
 * labels and reusable validation/state copy).
 */
import type { ContactContent } from "../types";

export const contactContent: ContactContent = {
  meta: {
    title: "Contact",
    description:
      "Book a SCRIPE demo. Tell us how your organization is set up and we will map your programs, surfaces and staff before the call.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Contact",
  },
  hero: {
    label: "Contact",
    title: "Book a demo of your own operation.",
    subtitle:
      "Bring the branches, sports and season volume you actually run. We will show you where SCRIPE fits — and where it does not.",
  },
  form: {
    eyebrow: "Book a demo",
    intro:
      "Tell us how the organization is set up and we will map your programs, surfaces and staff before the call.",
    placeholders: {
      name: "Omar Darwish",
      email: "you@organization.com",
      organization: "Cairo Sports Club",
      phone: "+20 100 000 0000",
      message: "How many branches, which sports, and what you are running on today.",
    },
    hints: {
      phone: "Optional — helps us reach you faster.",
      type: "Optional — it tells us which modules to show first.",
    },
    submitCta: "Book a Demo",
    footnote: "Sales-assisted onboarding · timeline set during scoping.",
  },
  expect: {
    label: "What happens next",
    items: [
      "A 30-minute call with an operations lead, not a script",
      "Your programs, surfaces and staff mapped before the demo",
      "The modules that match your operation, in your own timetable",
      "A plan confirmed with your team before anything is signed",
    ],
  },
  channels: {
    items: [
      {
        id: "email",
        label: "Email",
        value: "Not published yet",
        note: "A monitored inbox is being set up.",
      },
      {
        id: "phone",
        label: "Phone",
        value: "Not published yet",
        note: "No phone line yet.",
      },
      {
        id: "response",
        label: "Response",
        value: "Not live yet",
        note: "Sales-assisted onboarding, no self-service provisioning.",
      },
    ],
  },
};
