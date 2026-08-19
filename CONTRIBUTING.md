# Contributing

This is SCRIPE's marketing site — a private, closed repository. This guide
is for the team working in it, not a public contribution process. If you're
looking for the product roadmap or business decisions, this isn't that
document; it's the mechanical "how do I get a change in" one.

## Before you touch code

Read, in this order:

1. **[`README.md`](README.md)** — what this is, the stack, how to run it.
2. **[`AGENTS.md`](AGENTS.md)** — repository governance, Next.js version
   caveats.
3. **[`CLAUDE.md`](CLAUDE.md)** — the fuller operating rules this repo runs
   under, including the commit and security rules in §18 (summarized below,
   but that's the source of truth).
4. **The file header of whatever you're about to edit.** This codebase
   documents *why* almost everywhere — the reasoning behind a magic number,
   a CSS specificity choice, a rejected alternative. Read it before you
   change the thing it explains, or your change and the comment will
   contradict each other by the time you're done.

## Local setup

```bash
npm install
npm run dev
```

See [`README.md`](README.md#getting-started) for environment variables and
the full script list.

## Before every commit

Run the full gate. All four must be clean:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

None of these are optional, and none of them substitute for the others —
this codebase has caught real bugs where three of the four passed and the
fourth didn't. If you changed anything under `src/styles/`, `public/media/`,
or the hero, also **look at it in a browser** — the test suite verifies
arithmetic and structure, not whether a scroll transition feels right.

## Commit rules (hard rules, no exceptions — CLAUDE.md §18)

- **Never** reference Claude, Anthropic, or any AI tool in a commit message,
  in code comments, or anywhere in the app. No `Co-Authored-By` lines
  naming an AI tool. This is team-authored work; commits read that way.
- **Never** commit secrets, API keys, tokens, or credentials. Use
  environment variables (`.env.example` documents every one this app
  reads) — never hardcode them, never commit a real `.env` file.
- Prefer small, focused commits over one large one. A commit message should
  say *why*, not just restate the diff.
- Create a **new** commit to fix a problem found after the fact; don't
  amend a commit that's already been reviewed or pushed.

## Code conventions this repo actually enforces

- **File-level and export-level doc comments are mandatory** — every
  exported component, function, and type gets a doc comment explaining its
  role, not restating its name. This isn't ESLint-enforced (no JSDoc rule
  is configured in `eslint.config.mjs`), but it's a hard reviewing
  convention: every file in this codebase follows it, and a change that
  doesn't will be asked to add it. Look at any existing file in
  `src/components/` before writing a new one.
- **No cross-module reach-arounds.** Content lives in `src/content/`, is
  typed in `src/content/types.ts`, and components read it through that
  boundary — components don't import raw strings, and content files don't
  import components.
- **EN and AR are both first-class.** Any content change needs both locale
  files updated together (`src/content/en/*.ts` and `src/content/ar/*.ts`),
  and `src/content/parity.test.ts` will fail loudly if a key exists in one
  and not the other. Arabic isn't a mirrored English string — it's authored
  copy; see any `ar/*.ts` file's header for where its dictionary source is.
- **No invented product evidence.** Every stat, screenshot-shaped panel, or
  "proof" element on this site is either real or explicitly labeled sample
  data (`"Sample data"` badge — see `CapabilityEvidence.tsx`). Don't add a
  number or a claim that looks like a fact without one or the other. This
  has been audited for and fixed more than once; don't reintroduce it.
- **Derive numbers, don't eyeball them.** Timing constants, coverage
  margins, and layout breakpoints in this codebase are calculated from a
  stated formula in a comment, not tuned by feel and left unexplained. If
  you change one, update the derivation in the comment, not just the
  number — and add or update the test that checks it
  (see `src/components/sections/home/hero-timing.test.ts` for the pattern).

## Opening a change

There's no public PR template here since this repo doesn't take outside
contributions, but a good internal PR description does three things:

1. **What changed and why** — one or two sentences, not a restated diff.
2. **How you verified it** — which gate commands you ran, and if you looked
   at it in a browser, what you checked and on what viewport/theme/locale.
3. **What you deliberately didn't touch** — if you found something else
   wrong while you were in there, say so explicitly rather than silently
   fixing it in the same commit (scope creep makes review harder) or
   silently ignoring it (it gets lost).

## Reporting a security issue

Don't open a public issue for a security finding. See
[`SECURITY.md`](SECURITY.md) for how to report one.
