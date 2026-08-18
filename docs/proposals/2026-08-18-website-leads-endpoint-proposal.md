# Proposal: Where should public website lead/demo-request submissions land?

> Status: proposal, not implemented. Read-only investigation per `CLAUDE.md`/`AGENTS.md`
> governance — this document is the artifact; no code was changed to produce it.
> Author context: senior-backend investigation, 2026-08-18.

## The question

`SCRIPE-Website`'s contact form (`src/components/chrome/ContactForm.tsx` +
`src/lib/leads/submit-lead.ts`) is finished and tested: client + server-side validation,
a honeypot and a time-trap for spam, and an honest degraded state when nothing is
configured. It POSTs JSON to `process.env.LEADS_ENDPOINT`, which is documented but
**unset** (`SCRIPE-Website/.env.example:10`, `SCRIPE-Website/docs/walkthroughs/
2026-08-18-website-rebuild.md:164` — "Waiting on backend"). This is the only thing
standing between a real visitor's lead and the sales team.

The payload shape the website already sends
(`SCRIPE-Website/src/lib/leads/submit-lead.ts:187-196`):

```ts
{ name: string, email: string, organization: string, phone: string, type: string, message: string }
```

## What already exists in SCRIPE-Backend (this changes the answer)

This is the load-bearing finding: **SCRIPE-Backend already has a public, anonymous,
rate-limited, validated, tested lead-intake endpoint that does almost exactly this**,
plus a full admin CRM on top of it. It was built for the pricing-page "Contact Sales"
flow inside the self-service signup wizard, not for the marketing site's general
contact form — but the capability is the same shape.

- **Endpoint (live today):** `POST /api/v1/auth/signup/contact-sales`
  — `SCRIPE-Backend/src/Host/API/Controllers/Auth/SelfServiceSignupController.cs:431-464`
  — `[AllowAnonymous]`, `[EnableRateLimiting("Login")]`.
- **Handler:** `SubmitContactSalesLeadCommandHandler`
  — `SCRIPE-Backend/src/Modules/Entitlements/Entitlements.Application/Commands/Leads/
  SubmitContactSalesLead/SubmitContactSalesLeadCommandHandler.cs`
  — tenant-exists check, active-lead dedup (same company/email), system-wide daily cap
  (1,000/day, `DailyLeadCap` at line 24), sends a prospect-confirmation email AND an
  internal sales-team alert (`SendLeadEmailsAsync`, lines 206-256) via `IEmailSender`
  (Communication module's abstraction — cross-module contract, not a direct reference,
  correctly following `AGENTS.md` §6.2).
- **Validator:** `SubmitContactSalesLeadCommandValidator.cs:15-82` — required-field +
  max-length rules, real-email-format check, and a disposable-email-domain blocklist
  ("SECURITY: these are PUBLIC, AllowAnonymous inputs... the same protection the signup
  flow applies", line 8-13).
- **Storage entity:** `PlatformLead`
  — `SCRIPE-Backend/src/Modules/Entitlements/Entitlements.Domain/Entities/PlatformLead.cs`
  — `LeadStatus` lifecycle (New → Contacted → Qualified → Converted | Closed),
  `LeadSource` enum (`Website | Admin | Import`, line 146-156). Its own doc comment
  is explicit about scope (line 17-20): *"this is a SCRIPE platform sales lead
  captured during signup/contact-sales. It is not tenant CRM data. Future tenant
  Accounts, Contacts, Leads, Deals... should live in a dedicated CRM module."* A
  visitor filling out the marketing site's contact form is exactly this kind of
  platform-sales prospect — it fits the existing scope, not the excluded one.
- **Admin CRM (already built, already has a frontend):** `LeadsController.cs` — list,
  detail, activity timeline, status transitions, assignment, convert-to-tenant,
  bulk-status, email log — `SCRIPE-Backend/src/Host/API/Controllers/Entitlements/
  LeadsController.cs:1-460`. `SCRIPE-Frontend` already has a `leads` admin surface
  (referenced in `reports/SCRIPE_EXECUTION_PROGRESS_LEDGER.md` wave-20 row, design-bar
  sweep of the `leads` cluster).
- **Tests exist:** `SCRIPE-Backend/tests/Entitlements.Application.Tests/
  SubmitContactSalesLeadCommandHandlerTests.cs` and
  `SubmitContactSalesLeadCommandValidatorTests.cs`.

**Module ownership:** `AGENTS.md` §5's module table has no explicit "CRM"/"Leads" row.
`Entitlements`'s documented ownership is "capability packs, platform subscriptions,
feature gates, quotas" (§5). `PlatformLead` living under `Entitlements` is an existing,
shipped, deliberate implementation decision (not a mis-file) — its own header names the
boundary precisely (platform sales lead, not tenant CRM) and the whole conversion
pipeline (`ConvertLeadToTenantCommandHandler`) is Entitlements/Identity-native. Given
`AGENTS.md` §9's rule to "confirm owner module" before adding to an aggregate: the
right call is to **extend the existing `PlatformLead` owner (Entitlements)**, not open
a new module, because a general marketing-site "talk to sales" lead is the same
business object as a pricing-page "contact sales" lead — same lifecycle, same
conversion target (a paying tenant), same admin CRM. Building a second, parallel
leads table for the website would violate `AGENTS.md` §6.1's "no duplicate fake
source-of-truth tables" in spirit even if it's same-module.

## Option A — Proper backend endpoint (extend Entitlements' existing lead intake)

**Do NOT just point `LEADS_ENDPOINT` at `POST /api/v1/auth/signup/contact-sales`
as-is.** Two real problems with reusing that exact route unmodified:

1. **Availability coupling.** The whole `SelfServiceSignupController` carries a
   class-level `[RequireSignupRuntime]` filter (line 46). That filter 503s every
   action on the controller — including `contact-sales` — whenever
   `SignupSettings.Enabled` is `false` or the deployment topology doesn't co-locate
   Identity+Entitlements (`RequireSignupRuntimeAttribute.cs:24-35, 48-54`). Toggling
   off self-service tenant signup (a plausible ops action, e.g. sales-only period)
   would silently break the marketing site's "Contact us" form too — an unrelated
   concern getting coupled to an unrelated kill switch.
2. **Semantic drift.** `ContactSalesRequest` (`SCRIPE-Backend/src/Modules/Identity/
   Identity.Application/DTOs/Auth/SignupDtos.cs:170-182`) is shaped for the pricing
   wizard's "talk to sales about an edition" step (`EditionKey`, `BusinessType`,
   `TeamSize`, `PrimaryPriority` — all populated from the signup Discovery wizard).
   The website's general contact form has a `type` field (service/inquiry category)
   with no matching slot, and no edition context at all.

**Recommended shape:**

- **Endpoint:** `POST /api/v1/entitlements/leads/public` (new, small, own route —
  keeps it under the same `Entitlements` ownership and existing `LeadsController`
  file, but as a genuinely public, unauthenticated action with no class-level gate
  attached). Alternative: a new one-route `PublicContactController` if the team wants
  `LeadsController` to stay `[Authorize]`-only for cleanliness — either is fine
  architecturally; this is the smallest material open decision (see "Questions"
  below).
- **Auth:** `[AllowAnonymous]`, no `[RequireSignupRuntime]`.
- **Rate limit:** new dedicated policy (don't reuse `"Login"`, which is a
  brute-force-auth policy at `LoginLimit` = 10/5min per `.env.example:112` — reasonable
  for OTP guessing, not calibrated for a marketing form). Add a `"contact-form"`
  fixed-window policy in `RateLimitingConfiguration.cs` (pattern at lines 140-156),
  e.g. 5 requests / 10 min per IP, plus the existing `SubmitContactSalesLeadCommand`
  daily system-wide cap (1,000/day) as the second layer — same defense-in-depth shape
  already used for signup (`"signup"` policy, line 266).
- **Validation/spam:** reuse `SubmitContactSalesLeadCommandValidator` verbatim
  (disposable-email blocklist, length caps, dedup-by-company/email) — it already
  states it's designed for exactly this threat model (public anonymous input that
  gets HTML-interpolated into emails).
- **Field mapping** (website → command):
  `name→ContactName`, `email→Email`, `organization→CompanyName`, `phone→Phone`,
  `message→Message`. `type` has no existing slot — open decision, see "Questions."
- **Storage:** same `PlatformLead` entity. Recommend adding a `LeadSource` value
  (e.g. `WebsiteContactForm`) alongside the existing `Website` value so the admin CRM
  can tell "marketing site general inquiry" apart from "pricing-wizard contact-sales"
  — currently both would stamp `Source = LeadSource.Website` and be indistinguishable
  in the CRM list/filters. Enum is stored as an int and append-only, so this is a
  non-breaking addition, no data migration needed for existing rows.
- **Notification hookup:** reuse `SendLeadEmailsAsync` (prospect confirmation +
  `Leads:SalesNotificationEmail` alert) unchanged — it's provider-neutral via
  `IEmailSender`/Communication, already correctly cross-module.
- **CORS:** add the website's production origin to `Cors:AllowedOrigins` in
  `appsettings.Production.json` — CORS fails closed today by design
  (`CorsConfiguration.cs:125-137`, throws at startup if unset), so this is a required,
  deliberate step, not an oversight to fix later.
- **Effort estimate:** small, roughly 2-3 engineer-days total — new thin
  controller action + rate-limit policy + `LeadSource` enum value + field-mapping
  DTO + CORS config + unit/API-integration tests + a ledger/guide note. This is
  finishing an already-shipped feature's last mile, not new-module work: the entity,
  handler, validator, email templates, admin CRM, and test scaffolding all already
  exist and are exercised by the pricing-wizard flow today.
- **Where it fits the program ledger:** this is not Phase 2A-2E (Sports Operations OS
  domain) work — it's a small, standalone, cross-repo (`SCRIPE-Backend` +
  `SCRIPE-Website`) carryover closing a documented, deliberate gap
  (`SCRIPE-Website/docs/walkthroughs/2026-08-18-website-rebuild.md:337`: "Backend:
  stand up (or point to) a real lead-intake endpoint and set `LEADS_ENDPOINT`").
  Non-blocking for Phase 2 wave sequencing per `AGENTS.md` §7.3 (P2/P3, not P0/P1) —
  but worth doing before/alongside Phase 2 rather than long after, since every day
  it's unset is a real visitor's lead going to `{status: "not-connected"}`.

## Option B — Interim frontend-only (email bridge)

Point `LEADS_ENDPOINT` at nothing backend-owned; instead have the Next.js server
action itself send an email directly through a transactional email API, with no
persistence or CRM at all.

- **Concrete service options:** Resend (best fit — Next.js-native SDK, generous free
  tier, the repo's own installed skill set already documents it as a supported
  provider for this stack — `engineering-skills:email-template-builder`), Postmark
  (excellent deliverability, slightly more setup), SendGrid, or a plain SMTP relay
  via `nodemailer` if the team already has SMTP credentials from the backend's own
  `Communication.Infrastructure/Services/SmtpEmailSender.cs` provider.
- **Setup steps for the owner:**
  1. Create a Resend (or chosen provider) account, verify the `scripe.org` sending
     domain (SPF/DKIM records).
  2. Generate an API key, store as `RESEND_API_KEY` in Vercel project env vars
     (server-only, never `NEXT_PUBLIC_*`).
  3. Either (a) add a tiny `src/app/api/leads/route.ts` that `submit-lead.ts`'s
     `fetch(leadsEndpoint, ...)` call already targets unmodified once `LEADS_ENDPOINT`
     points at it (e.g. `https://www.scripe.org/api/leads`), or (b) skip the extra
     hop and have `submit-lead.ts` call the Resend SDK directly instead of `fetch`.
     (b) is simpler; (a) keeps `submit-lead.ts` provider-agnostic if the interim
     bridge might change providers.
  4. Send to the sales inbox (e.g. `sales@scripe.org`); optionally send the visitor
     an auto-reply mirroring `BuildProspectConfirmationEmail`'s tone
     (`SubmitContactSalesLeadCommandHandler.cs:258-289`) for parity when Option A
     lands later.
- **Privacy considerations:** PII (name/email/phone/message) leaves SCRIPE's own
  infrastructure into a third-party provider's mail-sending pipeline — the same
  category of exposure the backend's own `SmtpEmailSender` already has today via
  whatever SMTP relay it uses, so this isn't a new class of risk, just worth naming
  and covering in the privacy policy / provider DPA. No lead persists anywhere except
  an inbox: **no dedup, no CRM lifecycle, no admin visibility, no conversion
  tracking** until Option A ships — every lead from this interim period is invisible
  to `LeadsController`'s admin panel.
- **Migration path to Option A:** `submit-lead.ts` is already built for this
  transition — it reads `LEADS_ENDPOINT` fresh per-request (not cached at module
  load, deliberately, per the file's own header) and degrades honestly when unset.
  Swapping the interim email-bridge URL for the real backend URL once Option A ships
  is a one-line env var change, **provided** the interim bridge's payload contract
  stays `{name, email, organization, phone, type, message}` (i.e., don't reshape the
  JSON for the interim provider — keep `toLeadPayload()` unchanged, only change where
  it's sent).

## Option C — Publish a direct contact email/phone only

Drop the form; show a `mailto:` link and/or phone number on the contact page.
Fastest (minutes, zero backend/infra risk), but **not recommended**: it throws away
finished, tested work (validation, honeypot, time-trap spam defense, accessible
form UX) for a worse conversion path, with no lead capture, no dedup, and no CRM
trail at all — strictly worse than Option B on every axis except setup time, and
Option B's setup time is measured in an hour, not a sprint.

## Recommendation

**NOW:** ship Option B (Resend) as the immediate stopgap, keeping the JSON payload
contract exactly as `submit-lead.ts` already builds it. This turns real visitor leads
from `{status: "not-connected"}` into a delivered email today, at near-zero engineering
cost, without touching the backend.

**NEXT (small, soon — not urgent, not blocking):** schedule Option A as a short,
standalone cross-repo work package. It is unusually cheap because ~90% of it — entity,
handler, validator, admin CRM, email templates, tests, rate-limiting infrastructure —
already exists and is proven in production by the pricing-wizard's own contact-sales
flow. The only real new work is: a public route not gated by `[RequireSignupRuntime]`,
a rate-limit policy calibrated for a public marketing form instead of auth brute-force,
a `LeadSource` discriminator, the `type` field mapping decision, and CORS. Once it
ships, flip `LEADS_ENDPOINT` from the Option B bridge to the real backend URL — no
website code change beyond the env var, by construction.

**Do not do Option C** — it discards already-finished, already-tested work for a
strictly worse outcome.

### Risks

- Reusing `POST /api/v1/auth/signup/contact-sales` unmodified (skipping the "new
  route" step of Option A) would silently couple the marketing site's contact form
  uptime to the self-service-signup kill switch (`SignupSettings.Enabled`) — a
  real availability regression, not hypothetical, since that flag exists precisely
  to be toggled operationally.
- Blending marketing-site leads and pricing-wizard leads under the same
  `LeadSource.Website` value (if the discriminator is skipped) degrades sales triage
  quality — cheap to avoid (one enum value), easy to forget if rushed.
- Option B's interim leads are invisible to the admin CRM — someone must remember to
  check the interim inbox until Option A ships, or leads get missed in the gap.
- No CAPTCHA (hCaptcha/Turnstile) is in scope for Option A day one — the daily cap
  (1,000/day), dedup, and disposable-email blocklist are the existing defense; judged
  sufficient to start, revisit only if real spam volume appears post-launch.

### Questions the owner must answer next round

1. Should website-general contact-form leads be tagged distinctly from pricing-wizard
   contact-sales leads in the CRM (new `LeadSource` value), or is blending them into
   one `Website` bucket acceptable to sales ops?
2. What should happen to the website form's `type` field (service/inquiry category)
   — a new structured field on `PlatformLead`, or folded as a prefix into `Message`?
3. Which inbox/address should receive the sales-team alert for website-originated
   leads — the existing `Leads:SalesNotificationEmail`, or a separate one?
4. Is the Option B stopgap (a few hours of work, third-party email provider) approved
   to ship immediately, or does the owner want to wait and go straight to Option A?
5. What are the actual live production domains for the backend API and the website
   (this investigation found `https://api.scripe.org/api` and `https://www.scripe.org`
   referenced in `.env.example` files — confirm these are real and not placeholders)
   so CORS `AllowedOrigins` and `LEADS_ENDPOINT` can be set correctly?
