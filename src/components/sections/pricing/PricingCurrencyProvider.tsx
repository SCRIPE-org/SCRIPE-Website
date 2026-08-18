"use client";

/**
 * PricingCurrencyProvider — the one shared-state module coordinating
 * `LivePrices.tsx`, `CurrencySelect.tsx` and `CurrencyNote.tsx`.
 *
 * ============================================================================
 * WHY A CONTEXT PROVIDER, NOT AN EXTERNAL STORE OR A SINGLE OWNER COMPONENT
 * ============================================================================
 * The three consumers mount in three different places in the pricing page's
 * tree: `LivePrices` is mounted once from `src/app/[locale]/pricing/page.tsx`
 * (page-composition level, renders nothing — it's a DOM-writing effect with
 * no visual output of its own), while `CurrencySelect` and `CurrencyNote`
 * render deep inside `PlanCards.tsx` (a Server Component), next to
 * `BillingToggle` and under the plan grid respectively — see that file's own
 * comments at each mount point. None of the three are one another's parent,
 * so there is no single "owner" component to lift plain `useState` into.
 *
 * React Context solves exactly this without a hand-rolled external store:
 * `page.tsx` wraps its ENTIRE returned page body (every section, including
 * the `PlanCards` Server Component and the `LivePrices` client leaf) in one
 * `<PricingCurrencyProvider>`. Server Components can be — and here, are —
 * rendered as children of a Client Component boundary; only this Provider
 * itself ships client JS, everything server-rendered underneath it (the
 * hero, the plan grid markup, the comparison table, the FAQ, the closing
 * CTA) stays exactly as server-rendered as it already was, one Provider
 * wrapper does not turn its Server Component children into Client
 * Components. `CurrencySelect`/`CurrencyNote`, wherever `PlanCards` happens
 * to render them in that tree, and `LivePrices`, wherever `page.tsx` happens
 * to render it, both read the same `usePricingCurrency()` context value —
 * true cross-tree sharing with no prop drilling through the Server
 * Component layer and no bespoke pub/sub machinery.
 *
 * ============================================================================
 * FETCH LIFECYCLE
 * ============================================================================
 * The Provider owns exactly one fetch, started in a `useEffect` on its own
 * mount (this component's mount, not any consumer's — consumers only ever
 * READ `usePricingCurrency()`, they never trigger the fetch themselves) and
 * aborted on its own unmount via the effect's cleanup. Since locale switches
 * on this site are full route navigations (`/en/pricing` ↔ `/ar/pricing` —
 * see `LocaleSwitch.tsx`), and any client-side navigation away from
 * `/pricing` unmounts this Provider along with the rest of the page tree,
 * "one fetch per Provider mount" already means "one fetch per pricing-page
 * visit" — no additional caching/dedup layer is needed for this feature's
 * scope.
 *
 * ============================================================================
 * INITIAL-CURRENCY RESOLUTION (once the fetch resolves)
 * ============================================================================
 * 1. A stored override (`localStorage["scripe-currency"]`) wins if it names
 *    `"SAR"` or a currency the fetched context actually supports — a stale
 *    override naming a currency the backend has since dropped is ignored
 *    rather than trusted blindly.
 * 2. Otherwise, `context.recommendedCurrency` wins if it's in the supported
 *    list.
 * 3. Otherwise, `"SAR"` — the one currency this module trusts unconditionally,
 *    since it's the baked figures' own currency and needs no conversion.
 *
 * ============================================================================
 * NO HYDRATION MISMATCH
 * ============================================================================
 * `status` starts `"loading"`, `context` starts `null`, `activeCurrency`
 * starts `"SAR"` — on the server render AND on the client's first render
 * before the mount effect has had a chance to run (effects never run during
 * SSR, and don't run synchronously during the client's first paint either).
 * Every consumer's render output for that initial state is byte-identical
 * between server and client (see `CurrencySelect.tsx`/`CurrencyNote.tsx`'s
 * own headers), so hydration has nothing to reconcile. The fetch resolving
 * afterward is an ordinary post-mount state update, not a hydration diff.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchPricingContext, type PricingContext as GeoPricingContext } from "@/lib/pricing/pricing-context";

/** localStorage key for a visitor's manual currency override. Shared by
 *  every read/write in this file — never hardcoded a second time. */
const STORAGE_KEY = "scripe-currency";

/** Lifecycle of the one pricing-context fetch this Provider owns. */
export type PricingLoadStatus = "loading" | "ready" | "unavailable";

/** The shared state + actions every consumer reads via
 *  {@link usePricingCurrency}. */
export interface PricingCurrencyValue {
  /** `"loading"` until the fetch settles; `"unavailable"` if it failed or
   *  returned `null` (see `pricing-context.ts`'s trust-boundary doc — every
   *  failure path collapses to `null`); `"ready"` once a valid context is in
   *  hand. Consumers that need real currency data (`LivePrices`,
   *  `CurrencySelect`) treat anything other than `"ready"` as "the baked SAR
   *  truth stands, do nothing." */
  status: PricingLoadStatus;
  /** The raw geo pricing context once `status` is `"ready"`, else `null`. */
  context: GeoPricingContext | null;
  /** The currently active currency code. Always `"SAR"` before `status` is
   *  `"ready"`, and stays `"SAR"` after unless geo recommended otherwise or
   *  the visitor picked one via `CurrencySelect`. */
  activeCurrency: string;
  /** Sets the active currency and persists the override to `localStorage`
   *  (clearing it for `"SAR"` — see this file's `writeStoredCurrency`). A
   *  no-op while `status` isn't `"ready"`, or for a `code` that is neither
   *  `"SAR"` nor present in `context.supportedCurrencies` — this is the
   *  hard guardrail behind the task's "never let inferred currency be the
   *  only path to a number" rule: SAR is always a legal target, and nothing
   *  else the backend didn't actually offer ever becomes one. */
  setCurrency: (code: string) => void;
}

const PricingCurrencyContext = createContext<PricingCurrencyValue | null>(null);

/** The fixed initial value every consumer sees before the mount effect
 *  resolves — see this file's "no hydration mismatch" section. */
const INITIAL_STATUS: PricingLoadStatus = "loading";
const INITIAL_CURRENCY = "SAR";

/**
 * Reads the stored currency override. Wrapped in try/catch — `localStorage`
 * throws in some browsers' private-browsing modes and can be disabled
 * entirely by user preference; either case degrades to "no override" rather
 * than crashing the pricing page.
 *
 * @returns The stored currency code, or `null` if absent/unreadable.
 */
function readStoredCurrency(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Persists (or clears) the currency override. `"SAR"` clears the key rather
 * than storing the literal string `"SAR"` — SAR is this feature's default,
 * so an absent key and an explicit `"SAR"` override are treated as the same
 * thing everywhere they're read, and clearing keeps the stored key itself
 * meaning "there is a non-default override" for as long as it exists.
 * Wrapped in try/catch for the same reason as {@link readStoredCurrency}.
 *
 * @param code - The currency code to persist.
 */
function writeStoredCurrency(code: string): void {
  try {
    if (code === "SAR") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // The override simply won't survive a reload; the in-memory state this
    // Provider already holds still drives the current page view.
  }
}

export interface PricingCurrencyProviderProps {
  /** The pricing page's full body — every section, so every descendant
   *  (Server or Client Component) can reach `usePricingCurrency()`. */
  children: ReactNode;
}

/**
 * Wraps the pricing page's body, owns the one geo pricing-context fetch, and
 * exposes the shared `{ status, context, activeCurrency, setCurrency }`
 * value to every descendant via {@link usePricingCurrency}. See this file's
 * header for the full fetch-lifecycle and initial-currency-resolution
 * contract.
 *
 * @param props - See {@link PricingCurrencyProviderProps}.
 */
export function PricingCurrencyProvider({ children }: PricingCurrencyProviderProps) {
  const [status, setStatus] = useState<PricingLoadStatus>(INITIAL_STATUS);
  const [context, setContext] = useState<GeoPricingContext | null>(null);
  const [activeCurrency, setActiveCurrencyState] = useState(INITIAL_CURRENCY);

  useEffect(() => {
    const controller = new AbortController();

    fetchPricingContext(controller.signal).then((result) => {
      // The Provider unmounted (its own cleanup already fired `abort()`)
      // before this resolved — `fetchPricingContext` resolves `null` on an
      // aborted signal rather than rejecting, so this guard is what actually
      // stops a stale resolution from writing state into an unmounted tree.
      if (controller.signal.aborted) return;

      if (result === null) {
        setStatus("unavailable");
        return;
      }

      const validCodes = new Set(result.supportedCurrencies.map((currency) => currency.code));
      const stored = readStoredCurrency();
      const initialCurrency =
        stored && (stored === "SAR" || validCodes.has(stored))
          ? stored
          : validCodes.has(result.recommendedCurrency)
            ? result.recommendedCurrency
            : "SAR";

      setContext(result);
      setActiveCurrencyState(initialCurrency);
      setStatus("ready");
    });

    return () => controller.abort();
  }, []);

  const setCurrency = useCallback(
    (code: string) => {
      if (status !== "ready" || !context) return;
      if (code !== "SAR" && !context.supportedCurrencies.some((currency) => currency.code === code)) return;
      writeStoredCurrency(code);
      setActiveCurrencyState(code);
    },
    [status, context],
  );

  const value = useMemo<PricingCurrencyValue>(
    () => ({ status, context, activeCurrency, setCurrency }),
    [status, context, activeCurrency, setCurrency],
  );

  return <PricingCurrencyContext.Provider value={value}>{children}</PricingCurrencyContext.Provider>;
}

/**
 * Reads the shared pricing-currency state. Must be called from a descendant
 * of {@link PricingCurrencyProvider} — every current consumer
 * (`LivePrices`, `CurrencySelect`, `CurrencyNote`) is.
 *
 * @throws If called outside a `PricingCurrencyProvider` — a programmer
 *   error (a missing mount point), not a runtime condition any consumer
 *   needs to handle gracefully.
 */
export function usePricingCurrency(): PricingCurrencyValue {
  const value = useContext(PricingCurrencyContext);
  if (!value) {
    throw new Error("usePricingCurrency must be used within a PricingCurrencyProvider");
  }
  return value;
}
