/* ============================================================================
   SCRIPE — contact form

   The validation rules, the error copy, the field limits and the confirmation
   wording are exactly those of the approved implementation.

   THERE IS NO BACKEND HERE. A static site cannot receive a submission, and no
   endpoint is faked: the form validates locally and then says plainly that the
   site is not yet connected to a live inbox. To wire a real one, point
   ENDPOINT below at it — the form will POST JSON and switch to the delivered
   wording on a 2xx response. No key or secret belongs in this file; anything
   shipped to the browser is public.
   ========================================================================= */
(function () {
  "use strict";

  /* Set to a URL (e.g. a form provider or your own API) to enable real
     delivery. Left null, the form keeps its clearly-marked demo behaviour. */
  var ENDPOINT = null;

  var LIMITS = { name: 120, email: 254, org: 160, phone: 40, message: 4000 };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Messages go through the shared dictionary, so an Arabic visitor gets Arabic
     validation. The English string is the fallback, exactly as elsewhere. */
  function t(key, en) {
    return window.SCRIPEI18n ? window.SCRIPEI18n.t(key, en) : en;
  }

  function validate(v) {
    var e = {};
    if (!v.name.trim()) e.name = t("form.err.name", "Tell us who you are.");
    else if (v.name.length > LIMITS.name) e.name = t("form.err.nameLong", "That name is too long.");

    if (!v.email.trim()) e.email = t("form.err.email", "We need somewhere to reply.");
    else if (!EMAIL_RE.test(v.email.trim()))
      e.email = t("form.err.emailInvalid", "That email address looks incomplete.");
    else if (v.email.length > LIMITS.email)
      e.email = t("form.err.emailLong", "That email address is too long.");

    if (!v.org.trim()) e.org = t("form.err.org", "Which organization is this for?");
    else if (v.org.length > LIMITS.org) e.org = t("form.err.orgLong", "That organization name is too long.");

    if (v.phone && v.phone.length > LIMITS.phone)
      e.phone = t("form.err.phoneLong", "That phone number is too long.");
    if (v.message && v.message.length > LIMITS.message)
      e.message = t("form.err.messageLong", "That message is too long.");
    return e;
  }

  var CHECK =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' +
    'focusable="false"><path d="M20 6 9 17l-5-5"></path></svg>';

  window.SCRIPEContact = function initContact() {
    var form = document.querySelector("form");
    if (!form) return;

    var FIELDS = ["name", "email", "org", "phone", "message"];
    var inputs = {};
    FIELDS.forEach(function (id) { inputs[id] = form.querySelector("#" + id); });

    function setError(id, message) {
      var input = inputs[id];
      if (!input) return;
      var wrap = input.parentElement;
      var existing = wrap.querySelector("[data-field-error]");
      var hint = wrap.querySelector(".sc-caption:not([data-field-error])");

      if (!message) {
        input.setAttribute("aria-invalid", "false");
        input.style.borderColor = "var(--border-hairline)";
        input.removeAttribute("aria-describedby");
        if (existing) existing.remove();
        if (hint) hint.hidden = false;
        return;
      }

      input.setAttribute("aria-invalid", "true");
      input.style.borderColor = "var(--critical)";
      input.setAttribute("aria-describedby", id + "-err");
      // the error replaces the hint, exactly as the approved field did
      if (hint) hint.hidden = true;
      if (existing) {
        existing.textContent = message;
      } else {
        var span = document.createElement("span");
        span.id = id + "-err";
        span.setAttribute("role", "alert");
        span.setAttribute("data-field-error", "");
        span.className = "sc-caption";
        span.style.color = "var(--critical)";
        span.textContent = message;
        wrap.appendChild(span);
      }
    }

    function succeed(firstName) {
      var panel = document.createElement("div");
      panel.setAttribute("role", "status");
      panel.className = "sc-card";
      panel.style.cssText =
        "display:grid;gap:var(--space-5);justify-items:start;padding:var(--space-8) var(--space-7);" +
        "background:var(--surface-1);border:1px solid var(--border-strong);" +
        "border-radius:var(--radius-card);min-width:0";
      var thanks = firstName
        ? t("form.thanks", "Thanks, {name}.").replace("{name}", firstName)
        : t("form.thanksFallback", "Thanks.");
      panel.innerHTML =
        '<span aria-hidden="true" style="display:grid;place-items:center;width:44px;height:44px;' +
        'border-radius:var(--radius-control);border:1px solid var(--border-hairline);' +
        'color:var(--positive)">' + CHECK + "</span>" +
        '<h3 class="sc-h3"></h3>' +
        '<p class="sc-body" style="max-width:460px"></p>' +
        '<button type="button" class="sc-btn sc-btn-secondary" data-reset></button>';
      // set as text, never markup — the name comes from user input
      panel.querySelector("h3").textContent = thanks;
      panel.querySelector("p").textContent = t(
        "form.demoNotice",
        "Your details are captured. This site is not yet connected to a live inbox — until it is, " +
          "send the same details to your SCRIPE contact and an operations lead will pick it up."
      );
      panel.querySelector("[data-reset]").textContent = t("form.another", "Submit another request");

      form.replaceWith(panel);
      panel.querySelector("[data-reset]").addEventListener("click", function () {
        form.reset();
        FIELDS.forEach(function (id) { setError(id, null); });
        panel.replaceWith(form);
        var first = inputs.name;
        if (first) first.focus();
      });
      panel.querySelector("h3").setAttribute("tabindex", "-1");
      panel.querySelector("h3").focus();
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var v = {};
      FIELDS.forEach(function (id) { v[id] = inputs[id] ? inputs[id].value : ""; });

      // bot trap: a human never sees or fills this field
      var trap = form.querySelector("#company_website");
      if (trap && trap.value.trim() !== "") {
        succeed(v.name.split(" ")[0]);
        return;
      }

      var errors = validate(v);
      FIELDS.forEach(function (id) { setError(id, errors[id] || null); });

      var firstBad = FIELDS.filter(function (id) { return errors[id]; })[0];
      if (firstBad) {
        inputs[firstBad].focus();
        return;
      }

      if (!ENDPOINT) {
        succeed(v.name.split(" ")[0]);
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = t("form.sending", "Sending…"); }
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(v),
      })
        .then(function (res) {
          if (!res.ok) throw new Error(String(res.status));
          succeed(v.name.split(" ")[0]);
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Book a Demo"; }
          var note = form.querySelector("[data-form-error]");
          if (!note) {
            note = document.createElement("p");
            note.setAttribute("role", "alert");
            note.setAttribute("data-form-error", "");
            note.className = "sc-body-sm";
            note.style.cssText =
              "color:var(--critical);padding:var(--space-4) var(--space-5);" +
              "border:1px solid var(--critical);border-radius:var(--radius-control)";
            form.insertBefore(note, form.lastElementChild);
          }
          note.textContent = t("form.err.network", "We could not send that just now. Please try again shortly.");
        });
    });
  };
})();
