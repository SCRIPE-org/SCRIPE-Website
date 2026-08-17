/* ============================================================================
   SCRIPE — global navigation and footer

   One shared definition builds the header and footer on every page, so the
   markup is never duplicated across the twelve HTML files. Behaviour matches
   the approved implementation exactly:

     Home     transparent for the WHOLE hero, becoming the frosted bar exactly
              when the hero leaves the viewport (300ms, no height change)
     Internal frosted from the first paint

   The boundary is the hero element itself, observed with IntersectionObserver —
   never a pixel threshold.

   Dropdowns, the mobile sheet, scroll lock, Escape handling, focus management
   and the active-item indicator are all carried over.
   ========================================================================= */
(function () {
  "use strict";

  var PAGE = window.SCRIPE_PAGE || { key: null, home: false, base: "" };
  var B = PAGE.base || "";

  /* ── information architecture — the single source of truth ─────────────── */
  var SOLUTIONS = [
    { key: "sports-clubs", href: "solutions/sports-clubs.html", name: "Sports Clubs",
      t: "sports-clubs", shortT: "teams-members-competitions-and-club-operations-from",
      short: "Teams, members, competitions and club operations from one place.",
      icon: "users", tone: "var(--accent-club)" },
    { key: "sports-academies", href: "solutions/sports-academies.html", name: "Sports Academies",
      t: "sports-academies", shortT: "development-programs-coaches-parents-and-athletes-in",
      short: "Development programs, coaches, parents and athletes in one rhythm.",
      icon: "calendar", tone: "var(--accent-academy)" },
    { key: "sports-venues", href: "solutions/sports-venues.html", name: "Sports Venues",
      t: "sports-venues", shortT: "courts-fields-pools-reservations-and-utilization",
      short: "Courts, fields, pools, reservations and utilization.",
      icon: "pin", tone: "var(--accent-venue)" },
    { key: "multi-sports-organizations", href: "solutions/multi-sports-organizations.html",
      name: "Multi-Sports Organizations",
      t: "multi-sports-organizations", shortT: "multiple-branches-multiple-sports-one-operational-pi",
      short: "Multiple branches, multiple sports, one operational picture.",
      icon: "globe", tone: "var(--accent-football)" },
  ];

  var RESOURCE_LINKS = [
    { href: "resources.html#guides", name: "Guides", t: "guides",
      desc: "How sports organizations set SCRIPE up, step by step.", descT: "how-organizations-set-scripe-up" },
    { href: "resources.html#faq", name: "FAQ", t: null,
      desc: "The questions operations leaders ask before talking to sales.", descT: "questions" },
    { href: "resources.html#product", name: "Product resources", t: "product-resources",
      desc: "What each module does and what it replaces.", descT: "a-reference-for-every-module" },
    { href: "resources.html#articles", name: "Articles", t: "articles",
      desc: "Notes on running sport, published as they are written.", descT: "notes-on-running-sport" },
  ];

  var PRIMARY_NAV = [
    { key: "platform", label: "Platform", t: "nav.platform", href: "platform.html" },
    { key: "solutions", label: "Solutions", t: "nav.solutions", href: "solutions.html", menu: "solutions" },
    { key: "pricing", label: "Pricing", t: "nav.pricing", href: "pricing.html" },
    { key: "resources", label: "Resources", t: "nav.resources", href: "resources.html", menu: "resources" },
  ];

  var MOBILE_NAV = [
    { key: "platform", label: "Platform", t: "nav.platform", href: "platform.html" },
    { key: "solutions", label: "Solutions", t: "nav.solutions", href: "solutions.html", children: SOLUTIONS },
    { key: "pricing", label: "Pricing", t: "nav.pricing", href: "pricing.html" },
    { key: "resources", label: "Resources", t: "nav.resources", href: "resources.html" },
    { key: "company", label: "Company", t: "nav.company", href: "company.html" },
    { key: "contact", label: "Contact", t: "nav.contact", href: "contact.html" },
  ];

  var FOOTER_COLUMNS = [
    { title: "Platform", t: "nav.platform", links: [
      { label: "Platform overview", t: "footer.platformOverview", href: "platform.html" },
      { label: "Members and subscriptions", t: "footer.membersSubs", href: "platform.html#members" },
      { label: "Reservations and payments", t: "footer.reservationsPayments", href: "platform.html#reservations" },
      { label: "Reports and analytics", t: "footer.reportsAnalytics", href: "platform.html#reports" }] },
    { title: "Solutions", t: "nav.solutions", links: SOLUTIONS.map(function (s) {
      return { label: s.name, t: s.t, href: s.href, dot: s.tone }; }) },
    { title: "Resources", t: "nav.resources", links: RESOURCE_LINKS.map(function (r) {
      return { label: r.name, t: r.t, href: r.href }; }) },
    { title: "Company", t: "nav.company", links: [
      { label: "About SCRIPE", t: "footer.aboutScripe", href: "company.html" },
      { label: "Contact", t: "nav.contact", href: "contact.html" },
      { label: "Pricing", t: "nav.pricing", href: "pricing.html" },
      { label: "Book a demo", t: "nav.bookDemo", href: "contact.html" }] },
  ];

  /* Social channels are never invented: each is plain text until a real URL is
     configured here. Legal links resolve to the Company page's placeholder note
     until published documents exist. */
  var SOCIAL = [
    { label: "LinkedIn", href: null },
    { label: "X", href: null },
    { label: "Instagram", href: null },
    { label: "YouTube", href: null },
  ];
  var LEGAL_LINKS = [
    { label: "Privacy", t: "footer.privacy", href: "company.html#legal" },
    { label: "Terms", t: "footer.terms", href: "company.html#legal" },
    { label: "Contact", t: "nav.contact", href: "contact.html" },
  ];

  /* ── Lucide icon paths, matching the approved icon set ─────────────────── */
  var ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    calendar: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>',
    globe: '<circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20"></path><path d="M12 2a14.5 14.5 0 0 1 0 20"></path><path d="M2 12h20"></path>',
    chevronDown: '<path d="m6 9 6 6 6-6"></path>',
    chevronRight: '<path d="m9 18 6-6-6-6"></path>',
    arrowRight: '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
    menu: '<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>',
    close: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>',
  };

  function icon(name, size, extra) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false"' + (extra || "") + ">" + ICONS[name] + "</svg>";
  }

  var url = function (href) { return B + href; };
  /* data-i18n on generated markup, so the shared i18n engine translates the
     navbar and footer exactly the way it translates the page body. */
  var key = function (k) { return k ? ' data-i18n="' + k + '"' : ""; };
  var keyAttr = function (attr, k) { return k ? ' data-i18n-attr="' + attr + ":" + k + '"' : ""; };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };

  /* ── header ────────────────────────────────────────────────────────────── */
  function megaItem(s) {
    return '<a class="sc-mega-item" href="' + url(s.href) + '">' +
      '<span class="sc-mega-dot" aria-hidden="true" style="background:' + s.tone + '"></span>' +
      '<span class="sc-mega-text">' +
        '<span class="sc-mega-name"' + key(s.t) + ">" + esc(s.name) + "</span>" +
        '<span class="sc-body-sm sc-mega-desc"' + key(s.shortT) + ">" + esc(s.short) + "</span>" +
      "</span>" +
      '<span class="sc-mega-arrow sc-rtl-flip" aria-hidden="true">' + icon("arrowRight", 15) + "</span>" +
      "</a>";
  }

  function buildHeader() {
    var links = PRIMARY_NAV.map(function (l) {
      var active = PAGE.key === l.key ? " data-active" : "";
      if (!l.menu) {
        return '<a class="sc-navlink" href="' + url(l.href) + '"' + active + key(l.t) + ">" +
          esc(l.label) + "</a>";
      }
      return '<span class="sc-nav-item" data-menu-root="' + l.menu + '">' +
        '<a class="sc-navlink" href="' + url(l.href) + '"' + active +
        ' aria-expanded="false" aria-haspopup="true" aria-controls="sc-menu-' + l.menu + '">' +
        "<span" + key(l.t) + ">" + esc(l.label) + "</span>" +
        icon("chevronDown", 14, ' class="sc-navlink-chev"') + "</a></span>";
    }).join("");

    var solutionsPanel =
      '<div class="sc-menu-panel" id="sc-menu-solutions" role="group" aria-label="Solutions" aria-hidden="true">' +
        '<div class="sc-container sc-menu-inner">' +
          '<div class="sc-mega-grid">' + SOLUTIONS.map(megaItem).join("") + "</div>" +
          '<div class="sc-menu-foot">' +
            '<a class="sc-menu-foot-link" href="' + url("solutions.html") + '"' +
              key("nav.allSolutions") + ">All solutions</a>" +
            '<span class="sc-meta"' + key("nav.megaMeta") +
              ">One platform — four ways sport is organized</span>" +
          "</div>" +
        "</div>" +
      "</div>";

    var resourcesPanel =
      '<div class="sc-menu-panel sc-menu-panel--narrow" id="sc-menu-resources" role="group" aria-label="Resources" aria-hidden="true">' +
        '<div class="sc-container sc-menu-inner">' +
          '<div class="sc-mega-grid">' + RESOURCE_LINKS.map(function (r) {
            return '<a class="sc-mega-item" href="' + url(r.href) + '">' +
              '<span class="sc-mega-text">' +
                '<span class="sc-mega-name"' + key(r.t) + ">" + esc(r.name) + "</span>" +
                '<span class="sc-body-sm sc-mega-desc"' + key(r.descT) + ">" + esc(r.desc) + "</span>" +
              "</span>" +
              '<span class="sc-mega-arrow sc-rtl-flip" aria-hidden="true">' + icon("arrowRight", 15) + "</span>" +
              "</a>";
          }).join("") + "</div>" +
        "</div>" +
      "</div>";

    return '<div class="sc-container sc-nav-bar">' +
        '<a class="sc-nav-logo" href="' + url("index.html") + '" aria-label="SCRIPE — home"' +
          keyAttr("aria-label", "nav.home") + ">" +
          '<img src="' + url("assets/images/scripe-logo.png") + '" alt="" width="32" height="32" decoding="async">' +
          "<span>SCRIPE</span>" +
        "</a>" +
        '<nav class="sc-nav-desktop" aria-label="Primary"' + keyAttr("aria-label", "nav.primary") + ">" +
          links + "</nav>" +
        '<span class="u-flex1"></span>' +
        '<span class="sc-nav-desktop sc-nav-cta">' +
          langControl() + themeControl() +
          '<a class="sc-btn sc-btn-sm" href="' + url("contact.html") + '"' + key("nav.bookDemo") +
            ">Book a Demo</a>" +
        "</span>" +
        '<button type="button" class="sc-nav-mobile-btn" aria-label="Open menu" aria-expanded="false" aria-controls="sc-mobile-nav">' +
          icon("menu", 20) +
        "</button>" +
      "</div>" + solutionsPanel + resourcesPanel;
  }

  /* Compact, minimal, and never a large button — a segmented EN / ع pair and a
     single sun/moon icon. Both carry an accessible label that is itself
     translated, and both announce their state. */
  function langControl(inSheet) {
    var lang = document.documentElement.getAttribute("lang") === "ar" ? "ar" : "en";
    return '<span class="sc-lang' + (inSheet ? " sc-lang--sheet" : "") +
      '" role="group" aria-label="Language"' + keyAttr("aria-label", "ui.lang.label") + ">" +
      '<button type="button" class="sc-lang-opt" data-set-lang="en" aria-pressed="' +
        (lang === "en") + '" lang="en"' + keyAttr("aria-label", "ui.lang.toEnglish") +
        ' aria-label="Switch to English">EN</button>' +
      '<button type="button" class="sc-lang-opt" data-set-lang="ar" aria-pressed="' +
        (lang === "ar") + '" lang="ar"' + keyAttr("aria-label", "ui.lang.toArabic") +
        ' aria-label="التبديل إلى العربية">ع</button>' +
      "</span>";
  }

  function themeControl(inSheet) {
    var dark = document.documentElement.getAttribute("data-theme") !== "light";
    return '<button type="button" class="sc-theme-toggle' + (inSheet ? " sc-theme-toggle--sheet" : "") +
      '" data-theme-toggle aria-pressed="' + (!dark) + '"' +
      keyAttr("aria-label", dark ? "ui.theme.toLight" : "ui.theme.toDark") +
      ' aria-label="' + (dark ? "Switch to light theme" : "Switch to dark theme") + '">' +
      '<span class="sc-theme-icon sc-theme-icon--sun" aria-hidden="true">' + icon("sun", 18) + "</span>" +
      '<span class="sc-theme-icon sc-theme-icon--moon" aria-hidden="true">' + icon("moon", 18) + "</span>" +
      "</button>";
  }

  function buildMobileNav() {
    var items = MOBILE_NAV.map(function (l) {
      var kids = l.children
        ? '<div class="sc-mobile-children">' + l.children.map(function (c) {
            return '<a class="sc-body-sm sc-mobile-child" href="' + url(c.href) + '">' +
              '<span class="sc-mobile-dash" aria-hidden="true"></span>' +
              "<span" + key(c.t) + ">" + esc(c.name) + "</span></a>";
          }).join("") + "</div>"
        : "";
      var indicator = PAGE.key === l.key ? '<span class="sc-mobile-active" aria-hidden="true"></span>' : "";
      return '<div class="sc-mobile-group">' +
        '<a class="sc-mobile-link" href="' + url(l.href) + '">' +
          "<span>" + indicator + "<span" + key(l.t) + ">" + esc(l.label) + "</span></span>" +
          '<span class="sc-rtl-flip u-fg-dim" aria-hidden="true">' + icon("chevronRight", 16) + "</span>" +
        "</a>" + kids + "</div>";
    }).join("");

    return '<div class="sc-mobile-nav" id="sc-mobile-nav" role="dialog" aria-modal="true" ' +
      'aria-label="Site navigation"' + keyAttr("aria-label", "nav.siteNav") + ' aria-hidden="true">' +
      '<nav class="sc-container sc-mobile-inner" aria-label="Primary"' +
        keyAttr("aria-label", "nav.primary") + ">" + items +
        '<div class="sc-mobile-prefs">' + langControl(true) + themeControl(true) + "</div>" +
        '<div class="sc-mobile-cta">' +
          '<a class="sc-btn sc-btn-primary sc-btn-lg sc-btn-block" href="' + url("contact.html") + '">' +
            "<span" + key("nav.bookDemo") + ">Book a Demo</span>" +
            '<span class="sc-arrow sc-rtl-flip u-iflex" aria-hidden="true">' + icon("arrowRight", 16) + "</span>" +
          "</a>" +
          '<span class="sc-caption sc-mobile-note"' +
            key("sales-assisted-onboarding-typically-live-within-one") +
            ">Sales-assisted onboarding · typically live within one season break.</span>" +
        "</div>" +
      "</nav></div>";
  }

  /* ── footer ────────────────────────────────────────────────────────────── */
  function buildFooter() {
    var cols = FOOTER_COLUMNS.map(function (c) {
      return '<nav aria-label="' + esc(c.title) + '" class="sc-foot-col"' +
        keyAttr("aria-label", c.t) + ">" +
        '<span class="sc-eyebrow"' + key(c.t) + ">" + esc(c.title) + "</span>" +
        '<div class="sc-foot-links">' + c.links.map(function (l) {
          return '<a class="sc-foot-link" href="' + url(l.href) + '">' +
            (l.dot ? '<span class="sc-foot-dot" aria-hidden="true" style="background:' + l.dot + '"></span>' : "") +
            "<span" + key(l.t) + ">" + esc(l.label) + "</span></a>";
        }).join("") + "</div></nav>";
    }).join("");

    var social = SOCIAL.map(function (s) {
      return s.href
        ? '<a class="sc-body-sm sc-foot-social" href="' + esc(s.href) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + "</a>"
        : '<span class="sc-body-sm sc-foot-social sc-foot-social--off">' + esc(s.label) + "</span>";
    }).join("");
    var anySocial = SOCIAL.some(function (s) { return s.href; });

    return '<hr class="sc-marking">' +
      '<div class="sc-container sc-foot">' +
        '<div class="sc-foot-grid">' +
          '<div class="sc-foot-brand">' +
            '<a class="sc-foot-lockup" href="' + url("index.html") + '" aria-label="SCRIPE — home"' +
              keyAttr("aria-label", "nav.home") + ">" +
              '<img src="' + url("assets/images/scripe-logo.png") + '" alt="" width="40" height="40" loading="lazy" decoding="async">' +
              "<span>SCRIPE</span></a>" +
            '<p class="sc-body-sm sc-foot-tagline"' + key("footer.tagline") +
              ">The Operating System for Modern Sports Organizations</p>" +
            '<div class="sc-foot-socials">' + social + "</div>" +
            (anySocial ? "" : '<span class="sc-caption"' + key("footer.socialNote") +
              ">Social channels are not published yet.</span>") +
          "</div>" + cols +
        "</div>" +
        '<div class="sc-foot-legal">' +
          '<span class="sc-meta">© ' + new Date().getFullYear() + " SCRIPE</span>" +
          '<span class="u-flex1"></span>' +
          LEGAL_LINKS.map(function (l) {
            return '<a class="sc-foot-link" href="' + url(l.href) + '"' + key(l.t) + ">" +
              esc(l.label) + "</a>";
          }).join("") +
        "</div>" +
      "</div>";
  }

  /* ── behaviour ─────────────────────────────────────────────────────────── */
  window.SCRIPENav = function initNav() {
    var header = document.getElementById("site-nav");
    var footer = document.getElementById("site-footer");
    if (!header) return;

    header.innerHTML = buildHeader();
    header.insertAdjacentHTML("afterend", buildMobileNav());
    if (footer) footer.innerHTML = buildFooter();

    var panels = {
      solutions: document.getElementById("sc-menu-solutions"),
      resources: document.getElementById("sc-menu-resources"),
    };
    var triggers = {};
    header.querySelectorAll("[data-menu-root]").forEach(function (root) {
      triggers[root.getAttribute("data-menu-root")] = root.querySelector(".sc-navlink");
    });

    var openKey = null;
    var closeTimer = 0;

    function setMenu(key) {
      openKey = key;
      Object.keys(panels).forEach(function (k) {
        var open = k === key;
        if (panels[k]) {
          panels[k].setAttribute("aria-hidden", open ? "false" : "true");
          panels[k].classList.toggle("is-open", open);
        }
        if (triggers[k]) triggers[k].setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    function open(key) { clearTimeout(closeTimer); setMenu(key); }
    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { setMenu(null); }, 140);
    }

    header.querySelectorAll("[data-menu-root]").forEach(function (root) {
      var key = root.getAttribute("data-menu-root");
      root.addEventListener("mouseenter", function () { open(key); });
      var link = triggers[key];
      link.addEventListener("focus", function () { open(key); });
      link.addEventListener("click", function () { setMenu(null); });
      link.addEventListener("keydown", function (e) {
        // Enter follows the link; Down opens the panel and steps into it, which
        // is what a keyboard user expects from a disclosure.
        if (e.key === "ArrowDown") {
          e.preventDefault();
          open(key);
          requestAnimationFrame(function () {
            var first = panels[key] && panels[key].querySelector("a");
            if (first) first.focus();
          });
        }
      });
    });

    // plain links close any open panel on hover/focus
    header.querySelectorAll(".sc-nav-desktop > .sc-navlink").forEach(function (a) {
      a.addEventListener("mouseenter", function () { setMenu(null); });
      a.addEventListener("focus", function () { setMenu(null); });
    });

    Object.keys(panels).forEach(function (k) {
      var panel = panels[k];
      if (!panel) return;
      panel.addEventListener("mouseenter", function () { open(k); });
      panel.addEventListener("focusout", function (e) {
        // tabbing past the last item in the panel closes it
        if (openKey === k && !panel.contains(e.relatedTarget)) setMenu(null);
      });
    });
    header.addEventListener("mouseleave", scheduleClose);

    // outside click
    document.addEventListener("click", function (e) {
      if (!openKey) return;
      if (header.contains(e.target)) return;
      if (panels[openKey] && panels[openKey].contains(e.target)) return;
      setMenu(null);
    });

    /* ── mobile sheet ────────────────────────────────────────────────────── */
    var menuBtn = header.querySelector(".sc-nav-mobile-btn");
    var sheet = document.getElementById("sc-mobile-nav");
    var mobileOpen = false;
    var trapHandler = null;

    function focusables() {
      return Array.prototype.slice
        .call(sheet.querySelectorAll("a[href], button:not([disabled])"))
        .filter(function (el) { return el.offsetParent !== null; });
    }

    function setMobile(next, returnFocus) {
      if (next === mobileOpen) return;
      mobileOpen = next;
      sheet.setAttribute("aria-hidden", next ? "false" : "true");
      sheet.classList.toggle("is-open", next);
      menuBtn.setAttribute("aria-expanded", next ? "true" : "false");
      var labelKey = next ? "nav.closeMenu" : "nav.openMenu";
      menuBtn.setAttribute("data-i18n-attr", "aria-label:" + labelKey);
      menuBtn.setAttribute("aria-label", next ? "Close menu" : "Open menu");
      if (window.SCRIPEI18n) window.SCRIPEI18n.translate(menuBtn.parentNode);
      menuBtn.innerHTML = icon(next ? "close" : "menu", 20);

      if (next) {
        var y = window.scrollY;
        document.body.setAttribute("data-scroll-locked", "");
        sheet.dataset.scrollY = String(y);
        requestAnimationFrame(function () {
          var first = focusables()[0];
          if (first) first.focus();
        });
        // while the sheet is open it owns the tab order
        trapHandler = function (e) {
          if (e.key !== "Tab") return;
          var items = focusables();
          if (!items.length) return;
          var first = items[0];
          var last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };
        sheet.addEventListener("keydown", trapHandler);
      } else {
        document.body.removeAttribute("data-scroll-locked");
        var prev = parseInt(sheet.dataset.scrollY || "0", 10);
        // overflow:hidden can drop the scroll offset in some engines — put it back
        if (Math.abs(window.scrollY - prev) > 1) window.scrollTo(0, prev);
        if (trapHandler) sheet.removeEventListener("keydown", trapHandler);
        trapHandler = null;
        // closing must hand focus back to the control that opened it
        if (returnFocus) requestAnimationFrame(function () { menuBtn.focus(); });
      }
    }

    menuBtn.addEventListener("click", function () { setMobile(!mobileOpen, mobileOpen); });
    // a link inside the sheet navigates away; release the lock first
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMobile(false, false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      setMenu(null);
      if (mobileOpen) setMobile(false, true);
    });

    /* ── theme and language controls ─────────────────────────────────────── */
    function syncControls() {
      var dark = document.documentElement.getAttribute("data-theme") !== "light";
      var lang = document.documentElement.getAttribute("lang") === "ar" ? "ar" : "en";

      document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(!dark));
        var k = dark ? "ui.theme.toLight" : "ui.theme.toDark";
        btn.setAttribute("data-i18n-attr", "aria-label:" + k);
        btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        if (window.SCRIPEI18n) window.SCRIPEI18n.translate(btn);
      });
      document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === lang));
      });
    }

    document.addEventListener("click", function (e) {
      var themeBtn = e.target.closest("[data-theme-toggle]");
      if (themeBtn && window.SCRIPETheme) {
        window.SCRIPETheme.toggle();
        return;
      }
      var langBtn = e.target.closest("[data-set-lang]");
      if (langBtn && window.SCRIPEI18n) {
        window.SCRIPEI18n.set(langBtn.getAttribute("data-set-lang"));
      }
    });

    document.addEventListener("scripe:themechange", syncControls);
    document.addEventListener("scripe:langchange", syncControls);
    syncControls();

    /* ── hero boundary ─────────────────────────────────────────────────────
       The hero is the source of truth, not a pixel count. While any part of it
       is still behind the bar the navbar stays transparent; the moment the hero
       leaves, it becomes the frosted bar — and it goes back when the hero
       returns. Pages without a hero are frosted from the first paint.

       The observer's root margin is inset from the top by the bar's own height,
       so "the hero has left" means "the hero is no longer under the navbar",
       which is exactly the boundary a reader perceives.
       ------------------------------------------------------------------- */
    var hero = document.querySelector("[data-story]");

    function setHeroState(inHero) {
      header.classList.toggle("navbar--hero", inHero);
      header.classList.toggle("navbar--scrolled", !inHero);
      header.toggleAttribute("data-transparent", inHero);
    }

    if (!PAGE.home || !hero) {
      setHeroState(false);
      return;
    }

    setHeroState(true);

    if (typeof IntersectionObserver === "function") {
      var navH = header.getBoundingClientRect().height || 72;
      var heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setHeroState(entry.isIntersecting);
          });
        },
        { root: null, rootMargin: -Math.round(navH) + "px 0px 0px 0px", threshold: 0 }
      );
      heroObserver.observe(hero);
    } else {
      // No IntersectionObserver: fall back to measuring the hero's own bounds,
      // still the hero boundary rather than an arbitrary number.
      var frame = 0;
      var read = function () {
        frame = 0;
        var r = hero.getBoundingClientRect();
        var h = header.getBoundingClientRect().height || 72;
        setHeroState(r.bottom > h);
      };
      var onScroll = function () { if (!frame) frame = requestAnimationFrame(read); };
      read();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }
  };
})();
