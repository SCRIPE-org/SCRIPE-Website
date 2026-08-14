/* ============================================================================
   SCRIPE — entry point

   Every module registers a single init function on `window` and does nothing
   until called. This file calls the ones whose markup is actually on the page,
   so a script that is loaded is a script that is needed.

   All scripts are `defer`red, so the DOM is parsed by the time this runs and
   the order in the document is the order they initialise in.
   ========================================================================= */
(function () {
  "use strict";

  function start() {
    // 1. navigation chrome — the rest of the page measures against it, and it
    //    must exist before i18n runs so the generated markup gets translated too
    if (window.SCRIPENav) window.SCRIPENav();

    // 2. language — before anything measures text, so a right-to-left layout is
    //    already settled and nothing shifts afterwards
    if (window.SCRIPEI18n) window.SCRIPEI18n.init();

    if (window.SCRIPENavigation) window.SCRIPENavigation();
    if (window.SCRIPEReveal) window.SCRIPEReveal();

    if (window.SCRIPEHero && document.querySelector("[data-story]")) window.SCRIPEHero();
    if (window.SCRIPEPricing && document.querySelector("[data-billing]")) window.SCRIPEPricing();
    if (window.SCRIPEFaq && document.querySelector("[id^='faq-btn-']")) window.SCRIPEFaq();
    if (window.SCRIPEContact && document.querySelector("form")) window.SCRIPEContact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
