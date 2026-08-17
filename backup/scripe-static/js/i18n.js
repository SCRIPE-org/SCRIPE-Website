/* ============================================================================
   SCRIPE — internationalisation

   One shared system for the whole site. English is the source: it lives in the
   HTML itself, so there is no English dictionary to keep in sync and no risk of
   the markup and a translation file drifting apart. On init every translatable
   node's English text is captured, and switching to Arabic swaps it for the
   entry in js/lang-ar.js. Switching back restores the captured original.

   Markup contract
     data-i18n="key"                      translate this element's text
     data-i18n-attr="placeholder:key,…"   translate these attributes
     data-i18n-html="key"                 translate, value may contain markup

   Direction and language are written onto <html> by the inline boot script in
   each page <head>, before the first paint — this module only handles changes
   made after load.
   ========================================================================= */
(function () {
  "use strict";

  var KEY = "scripe-language";
  var LANGS = ["en", "ar"];
  var DEFAULT = "en";

  /** English originals, captured from the DOM on first run. */
  var originals = new Map();
  var originalAttrs = new Map();
  /** For elements that also contain markup, the one text node we may rewrite. */
  var textNodes = new Map();
  var captured = false;

  /**
   * Many translatable elements carry siblings that are not text — a CTA arrow,
   * a required-field asterisk. Writing textContent on those would delete the
   * icon, so when an element has element children we translate only its own
   * first text node and leave everything else alone.
   */
  function ownTextNode(el) {
    if (!el.children.length) return null;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.trim()) return n;
    }
    return null;
  }

  /** Keep the original's surrounding whitespace so inline spacing is unchanged. */
  function reText(node, value) {
    var lead = (node.nodeValue.match(/^\s*/) || [""])[0];
    var tail = (node.nodeValue.match(/\s*$/) || [""])[0];
    node.nodeValue = lead + value + tail;
  }

  function setText(el, value) {
    var node = textNodes.get(el);
    if (node && node.parentNode === el) reText(node, value);
    else el.textContent = value;
  }

  function dict(lang) {
    return lang === "ar" ? window.SCRIPE_AR || {} : null;
  }

  function readStored() {
    try {
      var v = localStorage.getItem(KEY);
      return LANGS.indexOf(v) !== -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function current() {
    var l = document.documentElement.getAttribute("lang");
    return LANGS.indexOf(l) !== -1 ? l : DEFAULT;
  }

  /* ── capture / apply ───────────────────────────────────────────────────── */

  function capture(root) {
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (originals.has(el)) return;
      var node = ownTextNode(el);
      if (node) {
        textNodes.set(el, node);
        originals.set(el, node.nodeValue.trim());
      } else {
        originals.set(el, el.textContent);
      }
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      if (originalAttrs.has(el)) return;
      var store = {};
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var attr = pair.split(":")[0].trim();
        if (attr) store[attr] = el.getAttribute(attr);
      });
      originalAttrs.set(el, store);
    });
  }

  function apply(root, lang) {
    var table = dict(lang);

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var en = originals.has(el) ? originals.get(el) : el.textContent;
      // an untranslated key falls back to English rather than showing the key
      setText(el, table && table[key] ? table[key] : en);
    });

    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var en = originals.has(el) ? originals.get(el) : el.innerHTML;
      el.innerHTML = table && table[key] ? table[key] : en;
    });

    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var store = originalAttrs.get(el) || {};
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        var attr = bits[0] && bits[0].trim();
        var key = bits[1] && bits[1].trim();
        if (!attr || !key) return;
        var en = store[attr];
        var value = table && table[key] ? table[key] : en;
        if (value != null) el.setAttribute(attr, value);
      });
    });
  }

  /* ── public API ────────────────────────────────────────────────────────── */

  var I18n = {
    KEY: KEY,
    LANGS: LANGS,

    get: current,

    /** Translate a key directly — for strings built in JavaScript. */
    t: function (key, fallback) {
      var table = dict(current());
      if (table && table[key]) return table[key];
      return fallback != null ? fallback : key;
    },

    /** Capture + translate a subtree created after load. */
    translate: function (root) {
      var node = root || document;
      capture(node);
      apply(node, current());
    },

    /**
     * Point an element at a different key.
     * Used where JavaScript swaps copy at runtime (the pricing period, for
     * instance). The new English text is stored as the element's original, so
     * switching back to English restores the *current* wording rather than
     * whatever it happened to say at page load.
     */
    setKey: function (el, key, english) {
      if (!el) return;
      el.setAttribute("data-i18n", key);
      originals.set(el, english);
      setText(el, this.t(key, english));
    },

    set: function (lang, options) {
      if (LANGS.indexOf(lang) === -1) return;
      var root = document.documentElement;
      var changed = current() !== lang;

      root.setAttribute("lang", lang);
      root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      try {
        localStorage.setItem(KEY, lang);
      } catch (e) {
        /* choice simply will not persist */
      }

      // A language swap is a content change, never an animation.
      root.setAttribute("data-lang-changing", "");
      apply(document, lang);
      window.setTimeout(function () {
        root.removeAttribute("data-lang-changing");
      }, 50);

      if (changed || !(options && options.silent)) {
        document.dispatchEvent(new CustomEvent("scripe:langchange", { detail: { lang: lang } }));
      }
    },

    toggle: function () {
      this.set(current() === "ar" ? "en" : "ar");
    },

    init: function () {
      if (!captured) {
        capture(document);
        captured = true;
      }
      // The boot script already set <html lang>. Honour it, and make sure the
      // stored value and the DOM agree.
      var lang = readStored() || current() || DEFAULT;
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      if (lang !== "en") apply(document, lang);
    },
  };

  window.SCRIPEI18n = I18n;
})();
