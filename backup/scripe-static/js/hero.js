/* ============================================================================
   SCRIPE cinematic Hero — LOCKED

   Direct port of the approved CinematicHero implementation to vanilla DOM APIs.
   The camera keyframes (SHOTS), the cubic easing, the 0.075 smoothing constant,
   the cover-fit maths, the caption cross-fade windows, the scene rail, the
   drone drift and the pointer parallax are reproduced exactly as authored.

   Nothing here is retuned. The only changes were mechanical — element lookups
   and a single init function — so the DOM shape, the inline styles and the
   animation names are unchanged, and the camera still moves over ONE intact
   photograph. There is no layer separation.
   ========================================================================= */
(function () {
  "use strict";

  // camera keyframes in source-image coordinates (1376x768):
  // [centerX, centerY, zoom, rotationDeg, depthOfField]
  var SHOTS = [
    [688, 384, 1.03, 0, 0],    // 01 whole academy
    [448, 262, 1.9, 0.3, 0],   // 02 main stadium: grandstand + pitch
    [424, 482, 2.0, -0.55, 0], // 03 olympic pool, lane ropes centred
    [876, 374, 1.46, 0.2, 0],  // 04 five-a-side + padel courts in one frame
    [1012, 542, 2.55, 0, 1],   // 05 coach with the training group
    [688, 384, 1.0, 0, 0],     // 06 pull back out to the full campus
  ];
  var NAMES = ["Intro", "Clubs", "Academies", "Venues", "Intelligence", "Organization"];

  var SCENE_PAGES = 1.15; // ×vh per scene — prototype default
  var ZOOM = 1;           // ×            — prototype default
  var PARALLAX = 1;       // ×            — prototype default
  var SPEED = 1;          // ×            — prototype default

  window.SCRIPEHero = function initHero() {
    var root = document.querySelector("[data-story]");
    if (!root) return;

    var cam = root.querySelector("[data-cam]");
    var rot = root.querySelector("[data-rot]");
    var dof = root.querySelector("[data-dof]");
    var caps = root.querySelector("[data-caps]");
    var rail = root.querySelector("[data-rail]");
    var warm = root.querySelector("[data-warm]");
    var hint = root.querySelector("[data-hint]");
    if (!cam) return;

    var reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.style.setProperty("--spd", String(SPEED));
    root.style.height = SHOTS.length * SCENE_PAGES * 100 + "vh";

    var cur = SHOTS[0].slice();
    var state = { mx: 0, my: 0, cmx: 0, cmy: 0, active: -1, hintHidden: null };

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function onMove(e) {
      var r = root.getBoundingClientRect();
      state.mx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
      state.my = ((e.clientY - window.innerHeight / 2) / Math.max(1, window.innerHeight)) * 2;
    }

    function frame(now) {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var rect = root.getBoundingClientRect();
      var total = rect.height - vh;
      var p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      var segs = SHOTS.length - 1;
      var f = p * segs;
      var i = Math.min(segs - 1, Math.floor(f));
      var t = ease(Math.min(1, Math.max(0, f - i)));
      var a = SHOTS[i];
      var b = SHOTS[i + 1];
      var tx = a[0] + (b[0] - a[0]) * t;
      var ty = a[1] + (b[1] - a[1]) * t;
      var tz = a[2] + (b[2] - a[2]) * t;
      var tr = a[3] + (b[3] - a[3]) * t;
      var td = a[4] + (b[4] - a[4]) * t;

      var k = reduced ? 1 : 0.075;
      cur[0] += (tx - cur[0]) * k;
      cur[1] += (ty - cur[1]) * k;
      cur[2] += (tz - cur[2]) * k;
      cur[3] += (tr - cur[3]) * k;
      cur[4] += (td - cur[4]) * k;

      // idle drone drift + damped pointer parallax
      var amp = reduced ? 0 : 1;
      var dx = Math.sin((now / 9000) * Math.PI * 2) * 7 * amp;
      var dy = Math.cos((now / 12500) * Math.PI * 2) * 5 * amp;
      var pk = PARALLAX * 16 * amp;
      state.cmx += (state.mx * pk - state.cmx) * 0.06;
      state.cmy += (state.my * pk * 0.6 - state.cmy) * 0.06;

      var base = Math.max(vw / 1376, vh / 768);
      // scene zoom is authored against the image's own 16:9 framing; on taller
      // viewports cover-fill already inflates `base`, so discount the scene zoom
      // by that overshoot (never below 1 = cover) so each shot keeps the
      // horizontal span it was composed for
      var fit = Math.max(1, (cur[2] * (vw / 1376)) / base);
      var S = base * fit * ZOOM;
      var px = vw / 2 - cur[0] * S + dx + state.cmx;
      var py = vh / 2 - cur[1] * S + dy + state.cmy;
      px = Math.min(0, Math.max(vw - 1376 * S, px));
      py = Math.min(0, Math.max(vh - 768 * S, py));
      cam.style.transform =
        "translate3d(" + px.toFixed(2) + "px," + py.toFixed(2) + "px,0) scale(" + S.toFixed(4) + ")";

      if (rot) rot.style.transform = "rotate(" + cur[3].toFixed(3) + "deg)";
      if (dof) dof.style.opacity = Math.max(0, Math.min(1, cur[4])).toFixed(3);

      // sunlight drifts warmer through the flight, cools on the pull-out
      if (warm) warm.style.opacity = (0.42 + Math.sin(p * Math.PI) * 0.42).toFixed(3);

      // captions: hold inside each segment, cross-fade at the boundaries
      if (caps) {
        var raw = Math.min(1, Math.max(0, f - i));
        var cl = function (v) { return Math.max(0, Math.min(1, v)); };
        for (var c = 0; c < caps.children.length; c++) {
          var el = caps.children[c];
          var o = 0;
          var out = false;
          if (c === i) {
            if (raw < 0.62) {
              o = 1;
            } else {
              o = cl(1 - (raw - 0.62) / 0.18);
              out = true;
            }
          } else if (c === i + 1 && raw > 0.8) {
            o = cl((raw - 0.8) / 0.14);
          }
          if (p >= 0.999 && c === SHOTS.length - 1) {
            o = 1;
            out = false;
          }
          el.style.opacity = o.toFixed(3);
          // enters from below, leaves upward
          el.style.transform =
            "translate3d(0," + (out ? -(1 - o) * 30 : (1 - o) * 40).toFixed(1) + "px,0)";
          var ti = el.querySelector("[data-t]");
          if (ti) {
            ti.style.filter = "blur(" + ((1 - o) * 20).toFixed(2) + "px)";
            ti.style.letterSpacing = (-0.028 + (1 - o) * 0.13).toFixed(4) + "em";
          }
          var su = el.querySelector("[data-s]");
          if (su) {
            var o2 = cl((o - 0.2) / 0.8);
            su.style.opacity = o2.toFixed(3);
            su.style.transform = "translate3d(0," + ((1 - o2) * 14).toFixed(1) + "px,0)";
            su.style.filter = "blur(" + ((1 - o2) * 6).toFixed(2) + "px)";
          }
          var ey = el.querySelector("[data-e]");
          if (ey) ey.style.opacity = cl((o - 0.05) / 0.55).toFixed(3);
          var ct = el.querySelector("[data-cta]");
          if (ct) {
            ct.style.opacity = cl((o - 0.45) / 0.55).toFixed(3);
            ct.style.pointerEvents = o > 0.9 ? "auto" : "none";
          }
        }
      }

      // rail + label
      var active = Math.round(f);
      if (active !== state.active) {
        state.active = active;
        root.dataset.screenLabel =
          "Scene " + String(active + 1).padStart(2, "0") + " — " + NAMES[active];
        if (rail) {
          for (var r2 = 0; r2 < rail.children.length; r2++) {
            var on = r2 === active;
            var dot = rail.children[r2].querySelector("[data-tickdot]");
            var lab = rail.children[r2].querySelector("[data-ticklabel]");
            if (dot) {
              dot.style.background = on ? "var(--accent-primary)" : "transparent";
              dot.style.borderColor = on ? "var(--accent-primary)" : "rgba(255,255,255,.45)";
              dot.style.transform = on ? "scale(1.25)" : "scale(1)";
            }
            if (lab) lab.style.opacity = on ? "1" : ".4";
          }
        }
      }

      if (hint) {
        var hide = p > 0.02;
        if (hide !== state.hintHidden) {
          state.hintHidden = hide;
          hint.style.animationName = hide ? "none" : "hintFade";
          hint.style.opacity = hide ? "0" : "";
          hint.style.transition = "opacity 360ms linear";
        }
      }
    }

    var raf = 0;
    var rafIsTimer = false;

    function tick(now) {
      schedule();
      try {
        frame(now);
      } catch (err) {
        /* a single bad frame must never kill the camera loop */
      }
    }

    function schedule() {
      if (document.hidden || document.visibilityState === "hidden") {
        raf = window.setTimeout(function () { tick(performance.now()); }, 32);
        rafIsTimer = true;
      } else {
        raf = requestAnimationFrame(tick);
        rafIsTimer = false;
      }
    }

    function cancel() {
      if (rafIsTimer) clearTimeout(raf);
      else cancelAnimationFrame(raf);
    }

    function onScroll() {
      try {
        frame(performance.now());
      } catch (err) {
        /* noop */
      }
    }

    function onVis() {
      cancel();
      schedule();
      onScroll();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    schedule();
    onScroll();
  };
})();
