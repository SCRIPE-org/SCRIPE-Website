# Security Policy

This document covers the **SCRIPE-Website** marketing site — the public,
unauthenticated site at `scripe.org` (this repository). It does not cover
the SCRIPE product application, which is a separate, authenticated system
with its own security posture.

## Reporting a vulnerability

If you believe you've found a security issue in this site — an XSS, an
injection point, a CSP bypass, exposed credentials, or anything else that
could compromise a visitor or the deploy — report it privately rather than
opening a public GitHub issue.

**Report to:** a SCRIPE team member directly, or through whatever internal
channel your team currently uses for security reports. (This site has no
public bug-bounty program and, as of this writing, no dedicated published
security-contact address — see the honesty note below.)

When reporting, please include:

- What you found and where (file, route, or request).
- Steps to reproduce.
- What you think the impact is.

We'll acknowledge reports and follow up once triaged. Please don't publicly
disclose a finding before it's been addressed.

## What's actually true today (read this before assuming a control exists)

This site's copy holds itself to a strict honesty standard — no invented
proof, no claimed control that isn't real. This section holds the same
standard for its own security posture:

- **No published security-contact address yet.** `src/content/en/contact.ts`
  and `privacy.ts` both say so plainly rather than inventing one. Until one
  exists, report through a team member.
- **The contact form has no live backend.** `LEADS_ENDPOINT` is unset by
  default (`.env.example`); until it's configured, `src/lib/leads/submit-lead.ts`
  honestly reports "not connected" rather than a fabricated success. It is
  not authenticated and not rate-limited beyond a honeypot field and a
  minimum-time-on-page check — do not point real traffic at it without
  adding rate limiting first (see `docs/` for the open finding).
- **No database, no user accounts, no sessions** exist in this repository.
  There is nothing here to authenticate into or exfiltrate from beyond the
  static content and the one outbound lead-submission call.
- **The pricing page calls a third-party origin** (`NEXT_PUBLIC_API_BASE_URL`,
  a SCRIPE-owned backend) client-side for currency/pricing context. That
  call is same-origin-policy-gated by CSP's `connect-src` (below) and fails
  gracefully to a static fallback price if the call is blocked or the
  backend's CORS isn't configured for this site's origin.

## Controls that are real and verifiable in this repo

- **Content Security Policy**, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` are
  all set in `next.config.ts`, applied to every route. The CSP is
  origin-only for `connect-src` (see the comment above `apiOrigin` in that
  file for why a path-bearing value would be a live bug, not just untidy) —
  there's a regression test for the emitted header, run it with `npm test`.
- **No third-party scripts, trackers, or analytics** load anywhere on the
  site. The only inline scripts are this repo's own pre-paint theme/no-JS
  detection scripts (`src/theme/theme-script.ts`) — verify that claim
  yourself with a network panel; it's meant to be checkable, not taken on
  faith.
- **No secrets belong in this repository.** Every environment variable this
  site reads is documented in `.env.example`, and none of them are
  credentials — `LEADS_ENDPOINT` and `NEXT_PUBLIC_API_BASE_URL` are plain
  URLs, `SITE_URL`/`SITE_INDEXABLE` are public config. If you ever find an
  API key, token, or credential committed anywhere in this repo's history,
  treat that as a P0 and report it immediately — see `CLAUDE.md` §18 for the
  standing rule.
- **Dependencies** are kept current via `package.json`; `sharp` is a
  build/runtime image-processing dependency (see the note in
  `docs/` about it currently sitting in `devDependencies` while
  `/_next/image` needs it at runtime on non-Vercel hosts — a known,
  tracked gap, not a hidden one).

## Supported versions

This is a single continuously-deployed site, not a versioned library —
there is one supported version: whatever is on `main`. Security fixes land
there and deploy on the normal release path; there are no LTS branches to
back-port to.

## Scope

**In scope:** anything in this repository — the Next.js application, its
build scripts (`scripts/`), its content, and its configuration.

**Out of scope:** the SCRIPE product application (separate repository and
security posture), the backend API this site calls
(`NEXT_PUBLIC_API_BASE_URL`'s target), third-party infrastructure (DNS
registrar, hosting provider), and social-engineering or physical-access
reports.
