/* ============================================================================
   SCRIPE — FAQ accordion

   One panel open at a time, animating height over 420ms with --ease-emphasized,
   exactly as the approved component did. The buttons and panels already ship
   with their ids and ARIA wiring in the markup; this only drives the state.

   Height is set explicitly (not `auto`) because `auto` is not animatable; it is
   released to `auto` once a panel has finished opening so reflowing text — a
   resize, a font swap — can never clip the answer.
   ========================================================================= */
(function () {
  "use strict";

  window.SCRIPEFaq = function initFaq() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[id^='faq-btn-']"));
    if (!buttons.length) return;

    var items = buttons.map(function (btn) {
      return { btn: btn, panel: document.getElementById(btn.getAttribute("aria-controls")) };
    }).filter(function (i) { return i.panel; });

    var open = -1;

    function setOpen(next) {
      items.forEach(function (item, i) {
        var isOpen = i === next;
        var inner = item.panel.firstElementChild;
        // an open panel is pinned to a pixel height first, so the transition
        // always has a value to animate from and to
        if (item.panel.style.height === "auto") {
          item.panel.style.height = item.panel.scrollHeight + "px";
          void item.panel.offsetHeight;
        }
        item.panel.style.height = (isOpen && inner ? inner.scrollHeight : 0) + "px";
        item.btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        var chev = item.btn.lastElementChild;
        if (chev) chev.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
      });
      open = next;
    }

    items.forEach(function (item, i) {
      item.panel.addEventListener("transitionend", function (e) {
        if (e.propertyName === "height" && i === open) item.panel.style.height = "auto";
      });
      item.btn.addEventListener("click", function () {
        setOpen(open === i ? -1 : i);
      });
    });
  };
})();
