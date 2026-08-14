/* ============================================================================
   SCRIPE — navigation

   There is no router here. Every link is a normal <a href="page.html"> and the
   browser does the navigating, so Back, Forward, direct URLs and deep links all
   behave exactly as the browser intends.

   This module only adds the two things that made the previous build feel
   smooth, both of which survive normal navigation:

     1. a page-enter fade (CSS animation on #page-root, see animations.css)
     2. a brief dim on the outgoing page between the click and the new document
        painting (html[data-nav-leaving])

   Plus hash handling, so a deep link or an in-page jump clears the fixed navbar
   instead of landing underneath it.
   ========================================================================= */
(function () {
  "use strict";

  window.SCRIPENavigation = function initNavigation() {
    var reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── outgoing dim ──────────────────────────────────────────────────────
       Marked on the click, cleared if the navigation never lands (blocked
       link, download, same page) and on pageshow, which also covers the
       back/forward cache restoring this document. */
    if (!reduced) {
      document.addEventListener("click", function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest("a[href]");
        if (!a) return;
        if (a.target && a.target !== "_self") return;
        if (a.hasAttribute("download")) return;

        var href = a.getAttribute("href");
        if (!href || href.charAt(0) === "#") return;
        // external or non-http links leave the site; no transition needed
        if (/^(https?:)?\/\//i.test(href) || /^(mailto:|tel:)/i.test(href)) return;

        // same document, different hash only
        var dest = new URL(a.href, location.href);
        if (dest.pathname === location.pathname && dest.hash) return;

        document.documentElement.setAttribute("data-nav-leaving", "");
        setTimeout(function () {
          document.documentElement.removeAttribute("data-nav-leaving");
        }, 1200);
      });
    }

    window.addEventListener("pageshow", function () {
      document.documentElement.removeAttribute("data-nav-leaving");
    });

    /* ── hash offset ───────────────────────────────────────────────────────
       Sections carry scroll-margin-top so CSS handles this on its own, but a
       hash present in the URL at load time is applied by the browser before
       the stylesheet has necessarily settled the fixed-bar offset. Re-apply it
       once after load so a deep link always lands cleanly. */
    function correctHash() {
      if (!location.hash) return;
      var target;
      try {
        target = document.querySelector(location.hash);
      } catch (err) {
        return;
      }
      if (!target) return;
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start", behavior: "auto" });
      });
    }
    if (location.hash) window.addEventListener("load", correctHash);
  };
})();
