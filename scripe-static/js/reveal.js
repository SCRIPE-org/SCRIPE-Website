/* ============================================================================
   SCRIPE — scroll reveal

   One reveal engine for the whole site. Sections simply mark themselves with
   data-rv (plus data-bar / data-fill / data-spark / data-count for the chart
   primitives) and this is the only script that touches them, so adding a
   section costs zero extra JavaScript.

   Ported from the approved RevealRoot: same thresholds, same stagger, same
   count-up easing. Under prefers-reduced-motion everything resolves instantly
   and nothing is ever left invisible.
   ========================================================================= */
(function () {
  "use strict";

  window.SCRIPEReveal = function initReveal() {
    var reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function count(el, delay) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      var to = parseFloat(el.dataset.count) || 0;
      var pre = el.dataset.countPrefix || "";
      var suf = el.dataset.countSuffix || "";
      var fmt = function (v) {
        return pre + Math.round(v).toLocaleString("en-US") + suf;
      };
      if (reduced) {
        el.textContent = fmt(to);
        return;
      }
      var dur = 1300;
      var t0 = performance.now() + (delay || 0);
      var step = function (now) {
        var p = Math.max(0, Math.min(1, (now - t0) / dur));
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(function () {
        el.textContent = fmt(to);
      }, (delay || 0) + dur + 120);
    }

    function show(el, delay) {
      if (el.hasAttribute("data-rv-shown")) return;
      el.style.transitionDelay = (reduced ? 0 : delay || 0) + "ms";
      el.setAttribute("data-rv-shown", "");
      el.querySelectorAll("[data-bar]").forEach(function (b, i) {
        b.style.transitionDelay = i * 45 + "ms";
        b.style.height = b.dataset.bar;
      });
      el.querySelectorAll("[data-fill]").forEach(function (b, i) {
        b.style.transitionDelay = i * 70 + "ms";
        b.style.width = b.dataset.fill;
      });
      el.querySelectorAll("[data-spark]").forEach(function (s) {
        s.style.strokeDashoffset = "0";
      });
      el.querySelectorAll("[data-count]").forEach(function (c, i) {
        count(c, (delay || 0) + i * 90);
      });
    }

    var targets = Array.prototype.slice.call(document.querySelectorAll("[data-rv]"));
    var revealAll = function () {
      targets.forEach(function (el) { show(el, 0); });
    };

    if (reduced || typeof IntersectionObserver === "undefined") {
      revealAll();
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              show(e.target, parseFloat(e.target.dataset.rvD || 0));
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      targets.forEach(function (el) { io.observe(el); });
      // safety net: content is never allowed to stay invisible
      setTimeout(revealAll, 2600);
    }

    /* gentle parallax on flagged media, matching the prototype */
    var pxEls = Array.prototype.slice.call(document.querySelectorAll("[data-px]"));
    if (!pxEls.length || reduced) return;

    var frame = 0;
    function parallax() {
      frame = 0;
      var vh = window.innerHeight;
      pxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var d = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.translate = "0 " + (-d * parseFloat(el.dataset.px) * 100).toFixed(2) + "px";
      });
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(parallax);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    parallax();
  };
})();
