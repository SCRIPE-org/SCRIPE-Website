/* ============================================================================
   SCRIPE — theme

   Dark is the primary visual language; Light is the same product in a lighter
   room. Both are designed sets of semantic tokens in css/global.css — `:root`
   carries Light, `[data-theme="dark"]` carries Dark. Nothing here knows a single
   colour; it only decides which token set is active.

   Order of preference:
     1. the visitor's saved choice (localStorage)
     2. prefers-color-scheme
     3. dark

   The attribute is written by the tiny inline script in each page's <head>
   (see boot() below), long before the body paints, so there is no flash.
   ========================================================================= */
(function () {
  "use strict";

  var KEY = "scripe-theme";
  var THEMES = ["light", "dark"];

  /* --------------------------------------------------------------------------
     boot() is stringified into every page <head>. It must stay dependency-free
     and synchronous — it runs before the first paint.
     -------------------------------------------------------------------------- */
  function readTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem("scripe-theme");
    } catch (e) {
      /* private mode — fall through to the media query */
    }
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  var SURFACE = { dark: "#07111F", light: "#F6F8FB" };

  function paintMeta(theme) {
    var meta = document.getElementById("meta-theme-color");
    if (meta) meta.setAttribute("content", SURFACE[theme] || SURFACE.dark);
  }

  window.SCRIPETheme = {
    KEY: KEY,
    THEMES: THEMES,

    get: function () {
      var t = document.documentElement.getAttribute("data-theme");
      return t === "light" ? "light" : "dark";
    },

    set: function (theme, options) {
      if (THEMES.indexOf(theme) === -1) return;
      var root = document.documentElement;
      var animate = !(options && options.silent);

      if (animate) {
        // Only the properties that actually change are transitioned, and only
        // for the length of the swap — leaving a global transition in place
        // would make every hover feel sluggish.
        root.setAttribute("data-theme-changing", "");
        window.setTimeout(function () {
          root.removeAttribute("data-theme-changing");
        }, 320);
      }

      root.setAttribute("data-theme", theme);
      paintMeta(theme);
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {
        /* choice simply will not persist */
      }
      document.dispatchEvent(new CustomEvent("scripe:themechange", { detail: { theme: theme } }));
    },

    toggle: function () {
      this.set(this.get() === "dark" ? "light" : "dark");
    },

    /** Returns the boot snippet for inlining in <head>. */
    bootSource: function () {
      return "(" + readTheme.toString() + ")";
    },
  };

  // Keep following the OS while the visitor has expressed no preference.
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onChange = function (e) {
      var saved = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch (err) {
        /* ignore */
      }
      if (saved) return;
      window.SCRIPETheme.set(e.matches ? "light" : "dark", { silent: false });
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // The head script set the attribute; make sure the meta tag agrees.
  paintMeta(window.SCRIPETheme.get());
})();
