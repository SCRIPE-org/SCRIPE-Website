/* ============================================================================
   SCRIPE — pricing billing toggle

   Monthly ⇄ Yearly. The values, the tier contents, the CTA labels and the
   disclaimer are exactly those of the approved implementation; this only swaps
   the two figures that change and keeps the pressed state in sync.

   Starter and Growth re-price. Enterprise is always "Custom", so it carries no
   data-price hook and is left alone.
   ========================================================================= */
(function () {
  "use strict";

  /* The period line is translated copy, so it is swapped by key rather than by
     literal string — otherwise toggling would drop back into English. */
  var META = {
    monthly: { key: "per-month-per-branch", en: "per month · per branch" },
    yearly: { key: "pricing.perYear", en: "per year · per branch" },
  };

  window.SCRIPEPricing = function initPricing() {
    var tabs = document.querySelectorAll("[data-billing]");
    if (!tabs.length) return;

    var prices = document.querySelectorAll("[data-price]");
    var metas = document.querySelectorAll("[data-price-meta]");

    function apply(mode) {
      tabs.forEach(function (t) {
        t.setAttribute("aria-pressed", t.dataset.billing === mode ? "true" : "false");
      });
      prices.forEach(function (el) {
        el.textContent = mode === "yearly" ? el.dataset.yearly : el.dataset.monthly;
      });
      metas.forEach(function (el) {
        if (window.SCRIPEI18n) window.SCRIPEI18n.setKey(el, META[mode].key, META[mode].en);
        else el.textContent = META[mode].en;
      });
    }

    var currentMode = "monthly";
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        currentMode = t.dataset.billing;
        apply(currentMode);
      });
    });

    // a language switch must keep whichever period is selected
    document.addEventListener("scripe:langchange", function () {
      apply(currentMode);
    });
  };
})();
