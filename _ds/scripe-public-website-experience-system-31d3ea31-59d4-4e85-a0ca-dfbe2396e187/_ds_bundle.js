/* @ds-bundle: {"format":4,"namespace":"SCRIPEPublicWebsiteExperienceSystem_31d3ea","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"DemoForm","sourcePath":"components/conversion/DemoForm.jsx"},{"name":"PricingTier","sourcePath":"components/conversion/PricingTier.jsx"},{"name":"SelectField","sourcePath":"components/conversion/SelectField.jsx"},{"name":"TextField","sourcePath":"components/conversion/TextField.jsx"},{"name":"FormationPitch","sourcePath":"components/evidence/FormationPitch.jsx"},{"name":"SiteFooter","sourcePath":"components/footer/SiteFooter.jsx"},{"name":"LocaleSwitch","sourcePath":"components/navigation/LocaleSwitch.jsx"},{"name":"MegaMenu","sourcePath":"components/navigation/MegaMenu.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"ThemeToggle","sourcePath":"components/navigation/ThemeToggle.jsx"},{"name":"Eyebrow","sourcePath":"components/storytelling/Eyebrow.jsx"},{"name":"MediaFrame","sourcePath":"components/storytelling/MediaFrame.jsx"},{"name":"ProductChip","sourcePath":"components/storytelling/ProductChip.jsx"},{"name":"QuoteBlock","sourcePath":"components/storytelling/QuoteBlock.jsx"},{"name":"SectionHeading","sourcePath":"components/storytelling/SectionHeading.jsx"},{"name":"StatMetric","sourcePath":"components/storytelling/StatMetric.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"9817962a45be","components/actions/TextLink.jsx":"fdf0563f3858","components/conversion/DemoForm.jsx":"add187cfcf77","components/conversion/PricingTier.jsx":"5ba8e0d2a100","components/conversion/SelectField.jsx":"8402a36ccdd2","components/conversion/TextField.jsx":"8232a5e7c0a8","components/evidence/FormationPitch.jsx":"664cdf91c339","components/footer/SiteFooter.jsx":"93684f5d4998","components/navigation/LocaleSwitch.jsx":"51df7a3cf9fe","components/navigation/MegaMenu.jsx":"1698268757a1","components/navigation/NavBar.jsx":"f5836ca5d9ac","components/navigation/ThemeToggle.jsx":"12fa856725d4","components/storytelling/Eyebrow.jsx":"e109aef56f2a","components/storytelling/MediaFrame.jsx":"a1d06ac11bf3","components/storytelling/ProductChip.jsx":"2336d805d6af","components/storytelling/QuoteBlock.jsx":"cff2c3f48193","components/storytelling/SectionHeading.jsx":"904feb4e1e38","components/storytelling/StatMetric.jsx":"4ca2ba12da97","guidelines/proof/shared.jsx":"42620b9fe647","ui_kits/public_site/DemoScreen.jsx":"5772cd3eac06","ui_kits/public_site/HomeScreen.jsx":"d79da686611a","ui_kits/public_site/PricingScreen.jsx":"4beadbe8565b","ui_kits/public_site/app.jsx":"104a68c7b2c6","ui_kits/public_site/content.jsx":"e23d8d9e8073","ui_kits/public_site/helpers.jsx":"5390928ea3fc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SCRIPEPublicWebsiteExperienceSystem_31d3ea = window.SCRIPEPublicWebsiteExperienceSystem_31d3ea || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  href,
  children,
  onClick,
  disabled = false,
  type = "button",
  style
}) {
  const [hov, setHov] = React.useState(false);
  const [act, setAct] = React.useState(false);
  const S = {
    sm: {
      h: "var(--control-h-sm)",
      px: 16,
      fs: ".875rem"
    },
    md: {
      h: "var(--control-h)",
      px: 22,
      fs: "var(--fs-cta)"
    },
    lg: {
      h: "var(--control-h-lg)",
      px: 28,
      fs: "1rem"
    }
  }[size];
  const V = {
    primary: {
      background: hov ? "var(--interactive-hover)" : "var(--interactive)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent"
    },
    secondary: {
      background: hov ? "var(--surface-2)" : "transparent",
      color: "var(--text-primary)",
      border: `1px solid ${hov ? "var(--border-strong)" : "var(--border-hairline)"}`
    },
    ghost: {
      background: hov ? "var(--surface-2)" : "transparent",
      color: "var(--text-primary)",
      border: "1px solid transparent"
    },
    onMedia: {
      background: hov ? "var(--clean-white)" : "var(--soft-white)",
      color: "#0C0E15",
      border: "1px solid transparent"
    }
  }[variant];
  /* Disabled uses explicit muted tokens (not blanket opacity) so it stays legible and intentional rather than looking broken. */
  const D = {
    background: variant === "secondary" || variant === "ghost" ? "transparent" : "var(--surface-disabled)",
    color: "var(--text-disabled)",
    border: "1px solid var(--border-disabled)"
  };
  const Tag = href ? "a" : "button";
  return /*#__PURE__*/React.createElement(Tag, {
    href: disabled ? undefined : href,
    type: href ? undefined : type,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    "aria-disabled": disabled,
    onMouseEnter: () => !disabled && setHov(true),
    onMouseLeave: () => {
      setHov(false);
      setAct(false);
    },
    onMouseDown: () => !disabled && setAct(true),
    onMouseUp: () => setAct(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: S.h,
      paddingInline: S.px,
      borderRadius: "var(--radius-control)",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: S.fs,
      letterSpacing: ".01em",
      whiteSpace: "nowrap",
      textDecoration: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      transform: act ? "scale(.985)" : "scale(1)",
      transition: "background var(--motion-micro) var(--ease-standard),color var(--motion-micro) var(--ease-standard),border-color var(--motion-micro) var(--ease-standard),transform var(--motion-immediate) var(--ease-standard)",
      ...V,
      ...(disabled ? D : null),
      ...style
    }
  }, children, arrow && /*#__PURE__*/React.createElement("span", {
    className: "sc-rtl-flip",
    "aria-hidden": "true",
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: hov && !disabled ? "translateX(calc(3px * var(--motion-travel)))" : "none",
      transition: "transform var(--motion-micro) var(--ease-settle)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 5 7 7-7 7"
  }))));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/TextLink.jsx
try { (() => {
function TextLink({
  href = "#",
  children,
  arrow = "none",
  tone = "link",
  size = "md",
  onClick,
  style
}) {
  const [hov, setHov] = React.useState(false);
  const color = {
    link: "var(--link)",
    primary: "var(--text-primary)",
    inverse: "var(--text-on-media)"
  }[tone];
  const fs = size === "sm" ? "var(--fs-body-sm)" : "var(--fs-nav)";
  const Arrow = arrow !== "none" && /*#__PURE__*/React.createElement("span", {
    className: "sc-rtl-flip",
    "aria-hidden": "true",
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: hov ? arrow === "up" ? "translate(calc(2px*var(--motion-travel)),calc(-2px*var(--motion-travel)))" : "translateX(calc(3px*var(--motion-travel)))" : "none",
      transition: "transform var(--motion-micro) var(--ease-settle)"
    }
  }, arrow === "up" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M7 7h10v10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 17 17 7"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 5 7 7-7 7"
  }))));
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "inline-flex",
      flexDirection: "column",
      gap: 3,
      color,
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: fs,
      textDecoration: "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, children, Arrow), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      height: 1,
      background: "currentColor",
      width: hov ? "100%" : "0%",
      alignSelf: "flex-start",
      transition: "width var(--motion-control) var(--ease-emphasized)"
    }
  }));
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/conversion/PricingTier.jsx
try { (() => {
function PricingTier({
  name,
  product,
  blurb,
  priceNote = "Custom",
  priceMeta = "Tailored to branches, sports and volume",
  includes = [],
  ctaLabel = "Talk to sales",
  onCta,
  featured = false,
  badge = "Recommended",
  footnote,
  style
}) {
  const dot = {
    academy: "var(--accent-academy)",
    venue: "var(--accent-venue)",
    club: "var(--accent-club)",
    football: "var(--accent-football)"
  }[product];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: "var(--space-6)",
      alignContent: "start",
      padding: "var(--space-7)",
      background: "var(--surface-1)",
      border: featured ? "1.5px solid var(--accent-primary)" : "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      boxShadow: featured ? "var(--shadow-2)" : "var(--shadow-1)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: dot
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-h3"
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), featured && /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      color: "var(--accent-primary)",
      border: "1px solid color-mix(in srgb,var(--accent-primary) 40%,transparent)",
      background: "var(--accent-tint)",
      borderRadius: "var(--radius-xs)",
      padding: "3px 8px"
    }
  }, badge)), blurb && /*#__PURE__*/React.createElement("p", {
    className: "sc-body-sm"
  }, blurb)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontStretch: "var(--display-stretch)",
      fontWeight: 620,
      fontSize: "2rem",
      letterSpacing: "-.015em",
      color: "var(--text-display)"
    }
  }, priceNote), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, priceMeta)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: 11
    }
  }, includes.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--positive)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginTop: 3,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm",
    style: {
      color: "var(--text-primary)"
    }
  }, it)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? "primary" : "secondary",
    arrow: true,
    onClick: onCta
  }, ctaLabel), footnote && /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, footnote)));
}
Object.assign(__ds_scope, { PricingTier });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversion/PricingTier.jsx", error: String((e && e.message) || e) }); }

// components/conversion/SelectField.jsx
try { (() => {
function SelectField({
  label,
  hint,
  error,
  required = false,
  disabled = false,
  id,
  options = [],
  placeholder,
  value,
  onChange,
  style
}) {
  const auto = React.useId();
  const fid = id || auto;
  const [focus, setFocus] = React.useState(false);
  const border = disabled ? "1px solid var(--border-disabled)" : error ? "1px solid var(--critical)" : focus ? "1px solid var(--interactive)" : "1px solid var(--border-hairline)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 7,
      ...style
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    className: "sc-label",
    style: disabled ? {
      color: "var(--text-disabled)"
    } : null
  }, label, required && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--critical)"
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", {
    id: fid,
    required: required,
    disabled: disabled,
    value: value,
    onChange: onChange,
    "aria-invalid": !!error,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "var(--control-h)",
      paddingInlineStart: 14,
      paddingInlineEnd: 38,
      background: disabled ? "var(--surface-disabled)" : "var(--surface-1)",
      border,
      borderRadius: "var(--radius-control)",
      color: disabled ? "var(--text-disabled)" : value === "" ? "var(--text-tertiary)" : "var(--text-primary)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      fontSize: "var(--fs-body)",
      outline: "none",
      appearance: "none",
      WebkitAppearance: "none",
      boxShadow: focus && !disabled ? "0 0 0 3px color-mix(in srgb,var(--focus-ring) 16%,transparent)" : "none",
      transition: "border-color var(--motion-micro) var(--ease-standard),box-shadow var(--motion-micro) var(--ease-standard)"
    }
  }, placeholder !== undefined && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => typeof o === "string" ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      insetInlineEnd: 13,
      top: "50%",
      transform: "translateY(-50%)",
      color: disabled ? "var(--icon-disabled)" : "var(--text-tertiary)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), error ? /*#__PURE__*/React.createElement("span", {
    role: "alert",
    className: "sc-caption",
    style: {
      color: "var(--critical)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, hint) : null);
}
Object.assign(__ds_scope, { SelectField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversion/SelectField.jsx", error: String((e && e.message) || e) }); }

// components/conversion/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextField({
  label,
  hint,
  error,
  multiline = false,
  required = false,
  disabled = false,
  id,
  inputStyle,
  style,
  ...rest
}) {
  const auto = React.useId();
  const fid = id || auto;
  const [focus, setFocus] = React.useState(false);
  const border = disabled ? "1px solid var(--border-disabled)" : error ? "1px solid var(--critical)" : focus ? "1px solid var(--interactive)" : "1px solid var(--border-hairline)";
  const base = {
    width: "100%",
    background: disabled ? "var(--surface-disabled)" : "var(--surface-1)",
    border,
    borderRadius: "var(--radius-control)",
    color: disabled ? "var(--text-disabled)" : "var(--text-primary)",
    cursor: disabled ? "not-allowed" : "text",
    fontFamily: "inherit",
    fontSize: "var(--fs-body)",
    outline: "none",
    boxShadow: focus && !disabled ? "0 0 0 3px color-mix(in srgb,var(--focus-ring) 16%,transparent)" : "none",
    transition: "border-color var(--motion-micro) var(--ease-standard),box-shadow var(--motion-micro) var(--ease-standard)",
    ...inputStyle
  };
  const Tag = multiline ? "textarea" : "input";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 7,
      ...style
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    className: "sc-label",
    style: disabled ? {
      color: "var(--text-disabled)"
    } : null
  }, label, required && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--critical)"
    }
  }, " *")), /*#__PURE__*/React.createElement(Tag, _extends({
    id: fid,
    required: required,
    disabled: disabled,
    "aria-invalid": !!error,
    "aria-describedby": error ? fid + "-err" : hint ? fid + "-hint" : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: multiline ? {
      ...base,
      minHeight: 120,
      padding: "12px 14px",
      resize: "vertical"
    } : {
      ...base,
      height: "var(--control-h)",
      paddingInline: 14
    }
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    id: fid + "-err",
    role: "alert",
    className: "sc-caption",
    style: {
      color: "var(--critical)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    id: fid + "-hint",
    className: "sc-caption"
  }, hint) : null);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversion/TextField.jsx", error: String((e && e.message) || e) }); }

// components/conversion/DemoForm.jsx
try { (() => {
const PRODUCTS = [{
  key: "academy",
  label: "Academy",
  color: "var(--accent-academy)"
}, {
  key: "venue",
  label: "Venue",
  color: "var(--accent-venue)"
}, {
  key: "football",
  label: "Football Intelligence",
  color: "var(--accent-football)"
}, {
  key: "club",
  label: "Club",
  color: "var(--accent-club)"
}];
const EN = {
  name: "Full name",
  namePh: "Your name",
  email: "Work email",
  emailPh: "name@organization.com",
  org: "Organization",
  orgPh: "Academy, club or venue name",
  role: "Your role",
  rolePh: "Choose one",
  roles: ["Owner / Director", "Technical director", "Operations lead", "Coach", "Facility manager", "Other"],
  size: "Organization size",
  sizePh: "Choose one",
  sizes: ["Single branch", "2–5 branches", "6+ branches"],
  sports: "Sports you run",
  sportsList: ["Football", "Padel", "Swimming", "Basketball", "Tennis", "Gymnastics", "Other"],
  products: "Products you're interested in",
  productLabels: {
    academy: "Academy",
    venue: "Venue",
    football: "Football Intelligence",
    club: "Club"
  },
  note: "Anything we should know?",
  notePh: "Current tools, athlete numbers, timelines…",
  consent: "You may contact me about SCRIPE. Sales-assisted — no spam.",
  submit: "Book a demo",
  trialSubmit: "Request a trial",
  meta: "We reply within one working day.",
  successTitle: "Request received.",
  successBody: "A SCRIPE specialist will reach out within one working day to plan a walkthrough around your operation.",
  steps: ["Discovery call", "Guided walkthrough", "Pilot plan"]
};
function Chip({
  on,
  label,
  dot,
  onClick
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-pressed": on,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      borderRadius: "var(--radius-control)",
      border: on ? "1px solid var(--interactive)" : `1px solid ${hov ? "var(--border-strong)" : "var(--border-hairline)"}`,
      background: on ? "var(--interactive-tint)" : "transparent",
      color: "var(--text-primary)",
      fontFamily: "inherit",
      fontSize: "var(--fs-body-sm)",
      fontWeight: 600,
      transition: "border-color var(--motion-micro) var(--ease-standard),background var(--motion-micro) var(--ease-standard)"
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: dot
    }
  }), label, on && /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--interactive)",
    strokeWidth: "2.25",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })));
}
function DemoForm({
  t = {},
  variant = "demo",
  onSubmit,
  style
}) {
  const L = {
    ...EN,
    ...t
  };
  const [v, setV] = React.useState({
    name: "",
    email: "",
    org: "",
    role: "",
    size: "",
    sports: [],
    products: [],
    note: "",
    consent: false
  });
  const [done, setDone] = React.useState(false);
  const set = (k, val) => setV(s => ({
    ...s,
    [k]: val
  }));
  const tog = (k, item) => setV(s => ({
    ...s,
    [k]: s[k].includes(item) ? s[k].filter(x => x !== item) : [...s[k], item]
  }));
  if (done) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      padding: "var(--space-9) var(--space-6)",
      justifyItems: "center",
      textAlign: "center",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      background: "var(--surface-1)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: "color-mix(in srgb,var(--positive) 14%,transparent)",
      color: "var(--positive)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "sc-h2"
  }, L.successTitle), /*#__PURE__*/React.createElement("p", {
    className: "sc-body",
    style: {
      maxWidth: 420
    }
  }, L.successBody), /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      flexWrap: "wrap",
      listStyle: "none",
      margin: 0,
      padding: 0,
      justifyContent: "center"
    }
  }, L.steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      color: "var(--accent-primary)"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, s)))));
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setDone(true);
      onSubmit && onSubmit(v);
    },
    style: {
      display: "grid",
      gap: "var(--space-5)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TextField, {
    label: L.name,
    placeholder: L.namePh,
    required: true,
    value: v.name,
    onChange: e => set("name", e.target.value)
  }), /*#__PURE__*/React.createElement(__ds_scope.TextField, {
    label: L.email,
    type: "email",
    placeholder: L.emailPh,
    required: true,
    value: v.email,
    onChange: e => set("email", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TextField, {
    label: L.org,
    placeholder: L.orgPh,
    required: true,
    value: v.org,
    onChange: e => set("org", e.target.value)
  }), /*#__PURE__*/React.createElement(__ds_scope.SelectField, {
    label: L.role,
    placeholder: L.rolePh,
    options: L.roles,
    required: true,
    value: v.role,
    onChange: e => set("role", e.target.value)
  })), /*#__PURE__*/React.createElement(__ds_scope.SelectField, {
    label: L.size,
    placeholder: L.sizePh,
    options: L.sizes,
    value: v.size,
    onChange: e => set("size", e.target.value),
    style: {
      maxWidth: 280
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-label"
  }, L.sports), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, L.sportsList.map(s => /*#__PURE__*/React.createElement(Chip, {
    key: s,
    label: s,
    on: v.sports.includes(s),
    onClick: () => tog("sports", s)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-label"
  }, L.products), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement(Chip, {
    key: p.key,
    label: L.productLabels[p.key] || p.label,
    dot: p.color,
    on: v.products.includes(p.key),
    onClick: () => tog("products", p.key)
  })))), /*#__PURE__*/React.createElement(__ds_scope.TextField, {
    label: L.note,
    placeholder: L.notePh,
    multiline: true,
    value: v.note,
    onChange: e => set("note", e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    required: true,
    checked: v.consent,
    onChange: e => set("consent", e.target.checked),
    style: {
      width: 17,
      height: 17,
      marginTop: 2,
      accentColor: "var(--interactive)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm"
  }, L.consent)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit",
    variant: "primary",
    size: "lg",
    arrow: true
  }, variant === "trial" ? L.trialSubmit : L.submit), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, L.meta)));
}
Object.assign(__ds_scope, { DemoForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conversion/DemoForm.jsx", error: String((e && e.message) || e) }); }

// components/evidence/FormationPitch.jsx
try { (() => {
const SHAPES = {
  "5v5": [1, 2, 1, 1],
  "7v7": [1, 2, 3, 1],
  "9v9": [1, 3, 3, 2],
  "11v11": [1, 4, 3, 3]
};
const W = 680,
  H = 440,
  M = 24,
  FW = W - 2 * M,
  FH = H - 2 * M;
function spots(shape, mirror) {
  const pts = [];
  const n = shape.length - 1;
  shape.forEach((m, li) => {
    const fx = li === 0 ? .05 : .16 + (n > 1 ? (li - 1) / (n - 1) * .27 : .27);
    for (let j = 0; j < m; j++) {
      const fy = (j + 1) / (m + 1);
      let x = mirror ? 1 - fx : fx;
      pts.push({
        x: M + x * FW,
        y: M + fy * FH,
        line: li,
        idx: j,
        last: li === shape.length - 1 && j === m - 1
      });
    }
  });
  return pts;
}
function FormationPitch({
  formation = "9v9",
  interactive = true,
  trial = true,
  label = "Session — U14 A · Tuesday 17:00",
  trialLabel = "Position trial — RW",
  legend = {
    a: "Team A",
    b: "Team B",
    trial: "Position trial"
  },
  onFormationChange,
  style
}) {
  const [f, setF] = React.useState(formation);
  React.useEffect(() => setF(formation), [formation]);
  const shape = SHAPES[f] || SHAPES["9v9"];
  const A = spots(shape, false),
    B = spots(shape, true);
  const line = "rgb(236 255 244/.32)";
  const dot = {
    transition: "transform var(--motion-media) var(--ease-emphasized)"
  };
  const trialPt = trial ? A[A.length - 1] : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      overflow: "hidden",
      background: "var(--surface-1)",
      boxShadow: "var(--shadow-1)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      padding: "14px 18px",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), interactive && /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Formation",
    style: {
      display: "inline-flex",
      gap: 2,
      padding: 3,
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-control)"
    }
  }, Object.keys(SHAPES).map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    "aria-pressed": k === f,
    onClick: () => {
      setF(k);
      onFormationChange && onFormationChange(k);
    },
    style: {
      border: "none",
      padding: "5px 11px",
      borderRadius: "calc(var(--radius-control) - 3px)",
      fontFamily: "var(--font-body)",
      fontSize: ".8125rem",
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      background: k === f ? "var(--text-display)" : "transparent",
      color: k === f ? "var(--surface-page)" : "var(--text-secondary)",
      transition: "background var(--motion-micro) var(--ease-standard),color var(--motion-micro) var(--ease-standard)"
    }
  }, k)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0D1712",
      padding: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    role: "img",
    "aria-label": `Football formation diagram, ${f}`,
    style: {
      width: "100%",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: M,
    y: M,
    width: FW,
    height: FH,
    fill: "#10201780"
  }), [...Array(8)].map((_, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: M + i * FW / 8,
    y: M,
    width: FW / 8,
    height: FH,
    fill: i % 2 ? "rgb(255 255 255/.022)" : "none"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: line,
    strokeWidth: "1.4"
  }, /*#__PURE__*/React.createElement("rect", {
    x: M,
    y: M,
    width: FW,
    height: FH
  }), /*#__PURE__*/React.createElement("line", {
    x1: W / 2,
    y1: M,
    x2: W / 2,
    y2: H - M
  }), /*#__PURE__*/React.createElement("circle", {
    cx: W / 2,
    cy: H / 2,
    r: "56"
  }), /*#__PURE__*/React.createElement("rect", {
    x: M,
    y: (H - 176) / 2,
    width: "96",
    height: "176"
  }), /*#__PURE__*/React.createElement("rect", {
    x: W - M - 96,
    y: (H - 176) / 2,
    width: "96",
    height: "176"
  }), /*#__PURE__*/React.createElement("rect", {
    x: M,
    y: (H - 88) / 2,
    width: "36",
    height: "88"
  }), /*#__PURE__*/React.createElement("rect", {
    x: W - M - 36,
    y: (H - 88) / 2,
    width: "36",
    height: "88"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${M + 96},${H / 2 - 47.3} A56,56 0 0 1 ${M + 96},${H / 2 + 47.3}`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${W - M - 96},${H / 2 + 47.3} A56,56 0 0 1 ${W - M - 96},${H / 2 - 47.3}`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${M + 10},${M} A10,10 0 0 1 ${M},${M + 10}`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${W - M},${M + 10} A10,10 0 0 1 ${W - M - 10},${M}`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${M},${H - M - 10} A10,10 0 0 1 ${M + 10},${H - M}`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${W - M - 10},${H - M} A10,10 0 0 1 ${W - M},${H - M - 10}`
  })), /*#__PURE__*/React.createElement("circle", {
    cx: W / 2,
    cy: H / 2,
    r: "3",
    fill: line
  }), /*#__PURE__*/React.createElement("circle", {
    cx: M + 66,
    cy: H / 2,
    r: "2.4",
    fill: line
  }), /*#__PURE__*/React.createElement("circle", {
    cx: W - M - 66,
    cy: H / 2,
    r: "2.4",
    fill: line
  }), B.map((p, i) => /*#__PURE__*/React.createElement("g", {
    key: "b" + i,
    style: {
      ...dot,
      transform: `translate(${p.x}px,${p.y}px)`
    }
  }, /*#__PURE__*/React.createElement("circle", {
    r: "10",
    fill: "rgb(13 23 18/.5)",
    stroke: "#8D93A8",
    strokeWidth: "1.6"
  }))), A.map((p, i) => /*#__PURE__*/React.createElement("g", {
    key: "a" + i,
    style: {
      ...dot,
      transform: `translate(${p.x}px,${p.y}px)`
    }
  }, /*#__PURE__*/React.createElement("circle", {
    r: "10.5",
    fill: "#5B4FE0",
    stroke: "rgb(255 255 255/.3)",
    strokeWidth: "1"
  }))), trialPt && /*#__PURE__*/React.createElement("g", {
    style: {
      ...dot,
      transform: `translate(${trialPt.x}px,${trialPt.y}px)`
    }
  }, /*#__PURE__*/React.createElement("circle", {
    r: "16.5",
    fill: "none",
    stroke: "#22D3EE",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(0,-30)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-52",
    y: "-11",
    width: "104",
    height: "20",
    rx: "4",
    fill: "#0D1712",
    stroke: "rgb(62 210 234/.5)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    textAnchor: "middle",
    y: "3.5",
    fill: "#22D3EE",
    fontFamily: "Inter,system-ui,sans-serif",
    fontSize: "10.5",
    fontWeight: "600",
    letterSpacing: ".04em"
  }, trialLabel))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      flexWrap: "wrap",
      padding: "12px 18px",
      borderTop: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#7863F5"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, legend.a)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      border: "1.6px solid #8D93A8"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, legend.b)), trial && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      border: "1.6px solid #22D3EE"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, legend.trial)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-meta"
  }, f)));
}
Object.assign(__ds_scope, { FormationPitch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/FormationPitch.jsx", error: String((e && e.message) || e) }); }

// components/footer/SiteFooter.jsx
try { (() => {
const COLS = [{
  title: "Products",
  links: [{
    label: "SCRIPE Academy",
    dot: "var(--accent-academy)"
  }, {
    label: "SCRIPE Venue",
    dot: "var(--accent-venue)"
  }, {
    label: "SCRIPE Football Intelligence",
    dot: "var(--accent-football)"
  }, {
    label: "SCRIPE Club",
    dot: "var(--accent-club)"
  }]
}, {
  title: "Solutions",
  links: [{
    label: "For academies"
  }, {
    label: "For venues"
  }, {
    label: "For clubs"
  }, {
    label: "For coaches"
  }]
}, {
  title: "Resources",
  links: [{
    label: "Blog"
  }, {
    label: "Case studies"
  }, {
    label: "Knowledge center"
  }, {
    label: "Product updates"
  }]
}, {
  title: "Company",
  links: [{
    label: "About"
  }, {
    label: "Careers"
  }, {
    label: "Contact"
  }, {
    label: "Trust & security"
  }]
}];
function FLink({
  link,
  onNavigate
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: link.href || "#",
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(link.key || link.label);
      }
    },
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "inherit",
      fontSize: "var(--fs-body-sm)",
      color: hov ? "var(--text-primary)" : "var(--text-secondary)",
      textDecoration: "none",
      transition: "color var(--motion-micro) var(--ease-standard)"
    }
  }, link.dot && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 7,
      height: 7,
      borderRadius: 2,
      background: link.dot
    }
  }), link.label);
}
function SiteFooter({
  logoSrc,
  brand = "SCRIPE",
  tagline = "The operational partner behind modern sports organizations.",
  columns = COLS,
  legal = [{
    label: "Privacy"
  }, {
    label: "Terms"
  }, {
    label: "Accessibility"
  }],
  copyright,
  onNavigate,
  children,
  style
}) {
  const year = new Date().getFullYear();
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("hr", {
    className: "sc-marking"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      paddingBlock: "var(--space-11) var(--space-8)",
      display: "grid",
      gap: "var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      alignContent: "start",
      gridColumn: "span 1",
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10
    }
  }, logoSrc && /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "",
    style: {
      width: 40,
      height: 40
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontStretch: "var(--display-stretch)",
      fontSize: "1.125rem",
      letterSpacing: ".08em",
      color: "var(--text-display)"
    }
  }, brand)), /*#__PURE__*/React.createElement("p", {
    className: "sc-body-sm",
    style: {
      maxWidth: 260
    }
  }, tagline), children), columns.map((c, i) => /*#__PURE__*/React.createElement("nav", {
    key: i,
    "aria-label": typeof c.title === "string" ? c.title : undefined,
    style: {
      display: "grid",
      gap: 14,
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-eyebrow"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 11,
      justifyItems: "start"
    }
  }, c.links.map((l, j) => /*#__PURE__*/React.createElement(FLink, {
    key: j,
    link: l,
    onNavigate: onNavigate
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-6)",
      flexWrap: "wrap",
      borderTop: "1px solid var(--border-hairline)",
      paddingTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-meta"
  }, copyright || `© ${year} SCRIPE`), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), legal.map((l, i) => /*#__PURE__*/React.createElement(FLink, {
    key: i,
    link: l,
    onNavigate: onNavigate
  })))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/footer/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/LocaleSwitch.jsx
try { (() => {
const DEF = [{
  code: "en",
  short: "EN",
  label: "English",
  dir: "ltr",
  flag: "us"
}, {
  code: "ar",
  short: "AR",
  label: "العربية",
  dir: "rtl",
  flag: "eg"
}];
/* Self-contained vector flags — simplified authentic proportions/colors, no external assets or network fetch (robust at any consuming depth). */
function FlagArt({
  code
}) {
  if (code === "us") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "24",
    height: "18",
    fill: "#B22234"
  }), [1, 3, 5, 7, 9, 11, 13].map(y => /*#__PURE__*/React.createElement("rect", {
    key: y,
    y: y,
    width: "24",
    height: "1.38",
    fill: "#fff"
  })), /*#__PURE__*/React.createElement("rect", {
    width: "10.5",
    height: "9.7",
    fill: "#3C3B6E"
  }), [1.6, 3.4, 5.2, 7, 8.8].flatMap(cy => [1.3, 3.4, 5.5, 7.6, 9.7].map(cx => /*#__PURE__*/React.createElement("circle", {
    key: cx + "-" + cy,
    cx: cx,
    cy: cy,
    r: ".55",
    fill: "#fff"
  }))));
  if (code === "eg") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "24",
    height: "6",
    fill: "#CE1126"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "6",
    width: "24",
    height: "6",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "12",
    width: "24",
    height: "6",
    fill: "#000"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "9",
    r: "2.1",
    fill: "none",
    stroke: "#C09300",
    strokeWidth: "1.1"
  }));
  if (code === "fr") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "8",
    height: "18",
    fill: "#0055A4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    width: "8",
    height: "18",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "16",
    width: "8",
    height: "18",
    fill: "#EF4135"
  }));
  if (code === "de") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "24",
    height: "6",
    fill: "#000"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "6",
    width: "24",
    height: "6",
    fill: "#DD0000"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "12",
    width: "24",
    height: "6",
    fill: "#FFCE00"
  }));
  if (code === "es") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    width: "24",
    height: "18",
    fill: "#AA151B"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "4.5",
    width: "24",
    height: "9",
    fill: "#F1BF00"
  }));
  return /*#__PURE__*/React.createElement("rect", {
    width: "24",
    height: "18",
    fill: "#8D93A8"
  });
}
function Flag({
  code,
  size = 20
}) {
  const h = Math.round(size * .75);
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "inline-block",
      width: size,
      height: h,
      borderRadius: 3,
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: "0 0 0 1px rgb(0 0 0/.14), inset 0 0 0 1px rgb(255 255 255/.06)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 18",
    width: size,
    height: h,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement(FlagArt, {
    code: code
  })));
}
function LocaleSwitch({
  locale = "en",
  onChange,
  locales = DEF,
  size = "md",
  style
}) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  const current = locales.find(l => l.code === locale) || locales[0];
  const rtl = current.dir === "rtl";
  React.useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, locales.findIndex(l => l.code === locale)));
    const onDoc = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    const onKey = e => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(a => Math.min(locales.length - 1, a + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(a => Math.max(0, a - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(locales.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(locales[active]);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, active, locale, locales]);
  React.useEffect(() => {
    if (open && itemRefs.current[active]) itemRefs.current[active].focus();
  }, [open, active]);
  function close() {
    setOpen(false);
    triggerRef.current && triggerRef.current.focus();
  }
  function pick(l) {
    onChange && onChange(l.code);
    close();
  }
  const compact = size === "sm";
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      position: "relative",
      display: "inline-block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    ref: triggerRef,
    type: "button",
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    "aria-label": `Language: ${current.label}. Change language`,
    onClick: () => setOpen(v => !v),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: compact ? 7 : 9,
      height: compact ? 36 : 44,
      paddingInline: compact ? 10 : 15,
      border: `1px solid ${open ? "var(--border-strong)" : "var(--border-hairline)"}`,
      borderRadius: "var(--radius-full)",
      background: open ? "var(--surface-2)" : "var(--surface-1)",
      color: "var(--text-primary)",
      cursor: "pointer",
      boxShadow: open ? "var(--shadow-1)" : "none",
      transition: "background var(--motion-micro) var(--ease-standard),border-color var(--motion-micro) var(--ease-standard),box-shadow var(--motion-micro) var(--ease-standard)"
    },
    onMouseEnter: e => {
      if (!open) e.currentTarget.style.borderColor = "var(--border-strong)";
    },
    onMouseLeave: e => {
      if (!open) e.currentTarget.style.borderColor = "var(--border-hairline)";
    }
  }, /*#__PURE__*/React.createElement(Flag, {
    code: current.flag,
    size: compact ? 17 : 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: compact ? ".75rem" : ".8125rem",
      fontWeight: 600,
      letterSpacing: ".03em",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-primary)"
    }
  }, current.short), /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      color: "var(--text-tertiary)",
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform var(--motion-control) var(--ease-emphasized)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    "aria-label": "Choose a language",
    "aria-hidden": !open,
    style: {
      position: "absolute",
      top: "calc(100% + 10px)",
      insetInlineEnd: 0,
      minWidth: 230,
      zIndex: "var(--z-overlay)",
      background: "var(--surface-1)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-3)",
      padding: 7,
      display: "grid",
      gap: 1,
      transformOrigin: rtl ? "top left" : "top right",
      opacity: open ? 1 : 0,
      visibility: open ? "visible" : "hidden",
      transform: open ? "scale(1) translateY(0)" : `scale(.94) translateY(calc(-6px*var(--motion-travel)))`,
      transition: `opacity var(--motion-control) var(--ease-enter),transform var(--motion-control) var(--ease-enter),visibility 0s linear ${open ? "0s" : "var(--motion-control)"}`
    }
  }, locales.map((l, i) => {
    const on = l.code === locale;
    return /*#__PURE__*/React.createElement("button", {
      key: l.code,
      ref: el => itemRefs.current[i] = el,
      role: "option",
      "aria-selected": on,
      type: "button",
      lang: l.code,
      dir: l.dir,
      tabIndex: -1,
      onMouseEnter: () => setActive(i),
      onClick: () => pick(l),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        border: "none",
        width: "100%",
        minHeight: 44,
        textAlign: "start",
        padding: "6px 11px",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        background: active === i ? "var(--surface-2)" : "transparent",
        boxShadow: active === i ? "inset 0 0 0 1px var(--border-hairline)" : "none",
        color: "var(--text-primary)",
        transition: "background var(--motion-micro) var(--ease-standard)"
      }
    }, /*#__PURE__*/React.createElement(Flag, {
      code: l.flag,
      size: 22
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "grid",
        gap: 1,
        lineHeight: 1.25,
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: l.code === "ar" ? "var(--font-body-ar)" : "var(--font-body)",
        fontSize: ".875rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, l.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: ".6875rem",
        fontWeight: 500,
        letterSpacing: ".05em",
        color: "var(--text-tertiary)"
      }
    }, l.short)), on && /*#__PURE__*/React.createElement("svg", {
      "aria-hidden": "true",
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "var(--interactive)",
      strokeWidth: "2.25",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 6 9 17l-5-5"
    })));
  })));
}
Object.assign(__ds_scope, { LocaleSwitch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/LocaleSwitch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MegaMenu.jsx
try { (() => {
const DEF = [{
  key: "academy",
  name: "SCRIPE Academy",
  desc: "Programs, groups, sessions, attendance and development for multi-sport academies.",
  color: "var(--accent-academy)",
  href: "#academy"
}, {
  key: "venue",
  name: "SCRIPE Venue",
  desc: "Availability, one-off and recurring booking, payments, check-in and utilization.",
  color: "var(--accent-venue)",
  href: "#venue"
}, {
  key: "football",
  name: "SCRIPE Football Intelligence",
  desc: "Pitch context, formations, evaluations, position trials and coach evidence.",
  color: "var(--accent-football)",
  href: "#football"
}, {
  key: "club",
  name: "SCRIPE Club",
  desc: "The connected composition — facilities, programs, staff and customers as one.",
  color: "var(--accent-club)",
  href: "#club"
}];
function MegaItem({
  item,
  onNavigate
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: item.href,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(item.key);
      }
    },
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 12,
      alignItems: "start",
      padding: "14px 16px",
      borderRadius: "var(--radius-card)",
      background: hov ? "var(--surface-2)" : "transparent",
      textDecoration: "none",
      transition: "background var(--motion-micro) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: item.color,
      marginTop: 6
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: "var(--fs-nav)",
      color: "var(--text-primary)"
    }
  }, item.name), /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm",
    style: {
      color: "var(--text-tertiary)"
    }
  }, item.desc)), /*#__PURE__*/React.createElement("span", {
    className: "sc-rtl-flip",
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      marginTop: 4,
      color: "var(--text-primary)",
      opacity: hov ? 1 : 0,
      transform: hov ? "none" : `translateX(calc(-4px*var(--motion-travel)))`,
      transition: "opacity var(--motion-micro) var(--ease-standard),transform var(--motion-micro) var(--ease-settle)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 5 7 7-7 7"
  }))));
}
function MegaMenu({
  open = false,
  items = DEF,
  meta = "One platform — four product worlds",
  footerLabel = "Explore the platform",
  footerHref = "#platform",
  onNavigate,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !open,
    style: {
      position: "absolute",
      top: "100%",
      insetInline: 0,
      zIndex: "var(--z-megamenu)",
      background: "var(--surface-1)",
      borderBottom: "1px solid var(--border-hairline)",
      boxShadow: "var(--shadow-2)",
      opacity: open ? 1 : 0,
      visibility: open ? "visible" : "hidden",
      transform: open ? "translateY(0)" : `translateY(calc(-10px*var(--motion-travel)))`,
      transformOrigin: "top center",
      transition: `opacity var(--motion-nav) var(--ease-enter),transform var(--motion-nav) var(--ease-enter),visibility 0s linear ${open ? "0s" : "var(--motion-nav)"}`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      paddingBlock: "var(--space-7)",
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "var(--space-2)"
    }
  }, items.map(it => /*#__PURE__*/React.createElement(MegaItem, {
    key: it.key,
    item: it,
    onNavigate: onNavigate
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      borderTop: "1px solid var(--border-hairline)",
      paddingTop: "var(--space-5)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: footerHref,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate("platform");
      }
    },
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: "var(--fs-body-sm)",
      color: "var(--link)"
    }
  }, footerLabel), /*#__PURE__*/React.createElement("span", {
    className: "sc-meta"
  }, meta))));
}
Object.assign(__ds_scope, { MegaMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MegaMenu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ThemeToggle.jsx
try { (() => {
function ThemeToggle({
  theme = "dark",
  onChange,
  labels = {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme"
  },
  style
}) {
  const [hov, setHov] = React.useState(false);
  const dark = theme === "dark";
  const ic = {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    transition: "opacity var(--motion-control) var(--ease-standard),transform var(--motion-control) var(--ease-emphasized)"
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": dark ? labels.toLight : labels.toDark,
    title: dark ? labels.toLight : labels.toDark,
    onClick: () => onChange && onChange(dark ? "light" : "dark"),
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      position: "relative",
      width: 40,
      height: 40,
      borderRadius: "var(--radius-full)",
      border: "1px solid var(--border-hairline)",
      background: hov ? "var(--surface-2)" : "transparent",
      color: "var(--text-primary)",
      transition: "background var(--motion-micro) var(--ease-standard)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      ...ic,
      opacity: dark ? 0 : 1,
      transform: dark ? `rotate(calc(-60deg*var(--motion-travel))) scale(.6)` : "rotate(0) scale(1)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m4.93 4.93 1.41 1.41"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m17.66 17.66 1.41 1.41"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 12h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 12h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6.34 17.66-1.41 1.41"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m19.07 4.93-1.41 1.41"
  }))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      ...ic,
      opacity: dark ? 1 : 0,
      transform: dark ? "rotate(0) scale(1)" : `rotate(calc(60deg*var(--motion-travel))) scale(.6)`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
  }))));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function useMQ(q) {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(q);
    const f = e => setM(e.matches);
    setM(mq.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}
function NavLink({
  label,
  active,
  chevron,
  expanded,
  onClick,
  href
}) {
  const [hov, setHov] = React.useState(false);
  const Tag = chevron ? "button" : "a";
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    type: chevron ? "button" : undefined,
    "aria-expanded": chevron ? expanded : undefined,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      border: "none",
      background: hov ? "var(--surface-2)" : "transparent",
      padding: "9px 13px",
      borderRadius: "var(--radius-control)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-nav)",
      fontWeight: 500,
      color: active || hov || expanded ? "var(--text-primary)" : "var(--text-secondary)",
      textDecoration: "none",
      transition: "background var(--motion-micro) var(--ease-standard),color var(--motion-micro) var(--ease-standard)"
    }
  }, label, chevron && /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: expanded ? "rotate(180deg)" : "none",
      transition: "transform var(--motion-control) var(--ease-emphasized)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}
function NavBar({
  logoSrc,
  brand = "SCRIPE",
  links = [{
    key: "products",
    label: "Products",
    mega: true
  }, {
    key: "solutions",
    label: "Solutions",
    href: "#solutions"
  }, {
    key: "pricing",
    label: "Pricing",
    href: "#pricing"
  }, {
    key: "resources",
    label: "Resources",
    href: "#resources"
  }, {
    key: "company",
    label: "Company",
    href: "#company"
  }],
  megaItems,
  activeKey,
  signInLabel = "Sign in",
  ctaLabel = "Book a demo",
  theme,
  onThemeChange,
  locale,
  onLocaleChange,
  locales,
  onNavigate,
  onCta,
  sticky = true,
  style
}) {
  const [mega, setMega] = React.useState(false);
  const [mob, setMob] = React.useState(false);
  const mobile = useMQ("(max-width:960px)");
  React.useEffect(() => {
    const f = e => {
      if (e.key === "Escape") {
        setMega(false);
        setMob(false);
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  const go = k => {
    setMega(false);
    setMob(false);
    onNavigate && onNavigate(k);
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: sticky ? "sticky" : "relative",
      top: 0,
      zIndex: "var(--z-nav)",
      background: "color-mix(in srgb,var(--surface-page) 86%,transparent)",
      backdropFilter: "blur(14px) saturate(1.15)",
      WebkitBackdropFilter: "blur(14px) saturate(1.15)",
      borderBottom: "1px solid var(--border-hairline)",
      ...style
    }
  }, mega && !mobile && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    onClick: () => setMega(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: -1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      height: 72,
      display: "flex",
      alignItems: "center",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go("home");
    },
    "aria-label": brand,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
      flexShrink: 0
    }
  }, logoSrc && /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "",
    style: {
      width: 32,
      height: 32
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontStretch: "var(--display-stretch)",
      fontSize: "1.0625rem",
      letterSpacing: ".08em",
      color: "var(--text-display)"
    }
  }, brand)), !mobile && /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Primary",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2
    }
  }, links.map(l => l.mega ? /*#__PURE__*/React.createElement(NavLink, {
    key: l.key,
    label: l.label,
    chevron: true,
    expanded: mega,
    onClick: () => setMega(v => !v)
  }) : /*#__PURE__*/React.createElement(NavLink, {
    key: l.key,
    label: l.label,
    href: l.href,
    active: activeKey === l.key,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        go(l.key);
      }
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), !mobile && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LocaleSwitch, {
    locale: locale,
    onChange: onLocaleChange,
    locales: locales
  }), /*#__PURE__*/React.createElement(__ds_scope.ThemeToggle, {
    theme: theme,
    onChange: onThemeChange
  }), /*#__PURE__*/React.createElement("a", {
    href: "#signin",
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        go("signin");
      }
    },
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: "var(--fs-nav)",
      color: "var(--text-primary)"
    }
  }, signInLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    onClick: onCta || (() => go("demo"))
  }, ctaLabel)), mobile && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": mob ? "Close menu" : "Open menu",
    "aria-expanded": mob,
    onClick: () => setMob(v => !v),
    style: {
      width: 44,
      height: 44,
      display: "grid",
      placeItems: "center",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-control)",
      background: "transparent",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, mob ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 6h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 12h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 18h16"
  }))))), !mobile && /*#__PURE__*/React.createElement(__ds_scope.MegaMenu, {
    open: mega,
    items: megaItems,
    onNavigate: go
  }), mobile && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !mob,
    style: {
      position: "absolute",
      top: "100%",
      insetInline: 0,
      background: "var(--surface-page)",
      borderBottom: "1px solid var(--border-hairline)",
      boxShadow: "var(--shadow-2)",
      display: "grid",
      opacity: mob ? 1 : 0,
      visibility: mob ? "visible" : "hidden",
      transform: mob ? "translateY(0)" : `translateY(calc(-8px*var(--motion-travel)))`,
      transition: `opacity var(--motion-nav) var(--ease-enter),transform var(--motion-nav) var(--ease-enter),visibility 0s linear ${mob ? "0s" : "var(--motion-nav)"}`
    }
  }, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Primary",
    className: "sc-container",
    style: {
      display: "grid",
      paddingBlock: "var(--space-4)"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.key,
    href: l.href || "#" + l.key,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
      }
      go(l.key);
    },
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 48,
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: "1.0625rem",
      color: "var(--text-primary)",
      textDecoration: "none",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, l.label, /*#__PURE__*/React.createElement("svg", {
    className: "sc-rtl-flip",
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      paddingBlock: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LocaleSwitch, {
    locale: locale,
    onChange: onLocaleChange,
    locales: locales
  }), /*#__PURE__*/React.createElement(__ds_scope.ThemeToggle, {
    theme: theme,
    onChange: onThemeChange
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#signin",
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        go("signin");
      }
    },
    style: {
      fontWeight: 600,
      fontSize: "var(--fs-nav)",
      color: "var(--text-primary)"
    }
  }, signInLabel)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "lg",
    onClick: onCta || (() => go("demo")),
    style: {
      width: "100%"
    },
    arrow: true
  }, ctaLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--space-5)"
    }
  }))));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/storytelling/Eyebrow.jsx
try { (() => {
const TONES = {
  default: "var(--text-tertiary)",
  accent: "var(--interactive)",
  brand: "var(--accent-primary)",
  academy: "var(--accent-academy)",
  venue: "var(--accent-venue)",
  club: "var(--accent-club)",
  football: "var(--accent-football)",
  live: "var(--live)"
};
function Eyebrow({
  index,
  children,
  tone = "default",
  line = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      ...style
    }
  }, index && /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      color: TONES[tone]
    }
  }, index), index && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 20,
      height: 1,
      background: "var(--border-strong)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-eyebrow",
    style: {
      color: tone === "default" ? "var(--text-tertiary)" : TONES[tone]
    }
  }, children), line && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: 1,
      height: 1,
      background: "var(--border-hairline)"
    }
  }));
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/storytelling/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/storytelling/MediaFrame.jsx
try { (() => {
const RATIOS = {
  cinema: "21/9",
  wide: "16/9",
  photo: "4/3",
  portrait: "3/4",
  square: "1/1"
};
function MediaFrame({
  ratio = "wide",
  src,
  alt = "",
  label,
  meta = "Campaign photography",
  scrim = true,
  reveal = true,
  radius = "var(--radius-media)",
  height,
  grade = "dusk",
  children,
  style
}) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(!reveal);
  React.useEffect(() => {
    if (!reveal) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      });
    }, {
      threshold: .2
    });
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);
  const G = {
    dusk: "linear-gradient(158deg,#242B40 0%,#12151F 48%,#0B0D14 100%)",
    turf: "linear-gradient(162deg,#1E3128 0%,#101B15 55%,#0A0F0C 100%)",
    aqua: "linear-gradient(160deg,#12303A 0%,#0D1B22 55%,#090D12 100%)",
    court: "linear-gradient(158deg,#3A2B22 0%,#191214 60%,#0C0A0C 100%)"
  }[grade];
  return /*#__PURE__*/React.createElement("figure", {
    ref: ref,
    style: {
      margin: 0,
      position: "relative",
      overflow: "hidden",
      borderRadius: radius,
      aspectRatio: height ? undefined : RATIOS[ratio] || ratio,
      height,
      background: "var(--surface-media)",
      clipPath: on ? "inset(0 0 0 0)" : "inset(10% 5% 10% 5%)",
      opacity: on ? 1 : .001,
      transition: "clip-path var(--motion-reveal) var(--ease-cinematic),opacity var(--motion-media) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      transform: on ? "scale(1)" : "scale(1.055)",
      transition: "transform calc(var(--motion-reveal)*1.5) var(--ease-cinematic)"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      background: G
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(90% 70% at 22% 8%,rgb(255 255 255/.09),transparent 55%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "repeating-linear-gradient(115deg,rgb(255 255 255/.016) 0 2px,transparent 2px 9px)"
    }
  }))), scrim && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--scrim-media)",
      pointerEvents: "none"
    }
  }), (label || meta) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      position: "absolute",
      insetInlineStart: 0,
      insetInlineEnd: 0,
      bottom: 0,
      padding: "var(--space-5)",
      display: "grid",
      gap: 6,
      color: "#F5F5F7"
    }
  }, meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-meta)",
      fontWeight: 600,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "rgb(245 245 247/.62)"
    }
  }, meta), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-body-sm)",
      lineHeight: 1.5,
      maxWidth: 460,
      color: "rgb(245 245 247/.92)"
    }
  }, label)), children);
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/storytelling/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/storytelling/ProductChip.jsx
try { (() => {
const P = {
  academy: {
    name: "SCRIPE Academy",
    color: "var(--accent-academy)",
    desc: "Multi-sport academy operations"
  },
  venue: {
    name: "SCRIPE Venue",
    color: "var(--accent-venue)",
    desc: "Facilities, bookings & utilization"
  },
  club: {
    name: "SCRIPE Club",
    color: "var(--accent-club)",
    desc: "The connected club composition"
  },
  football: {
    name: "SCRIPE Football Intelligence",
    color: "var(--accent-football)",
    desc: "Coach intelligence & evidence"
  }
};
function ProductChip({
  product = "academy",
  label,
  desc,
  showDesc = false,
  size = "md",
  style
}) {
  const p = P[product];
  const fs = size === "sm" ? "var(--fs-body-sm)" : "var(--fs-nav)";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: showDesc ? "flex-start" : "center",
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: p.color,
      marginTop: showDesc ? 5 : 0,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: fs,
      color: "var(--text-primary)",
      letterSpacing: ".01em"
    }
  }, label || p.name), showDesc && /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, desc || p.desc)));
}
Object.assign(__ds_scope, { ProductChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/storytelling/ProductChip.jsx", error: String((e && e.message) || e) }); }

// components/storytelling/QuoteBlock.jsx
try { (() => {
function QuoteBlock({
  quote,
  role,
  org,
  tone = "default",
  sample = false,
  maxWidth = 760,
  style
}) {
  const tick = {
    default: "var(--interactive)",
    academy: "var(--accent-academy)",
    venue: "var(--accent-venue)",
    club: "var(--accent-club)",
    football: "var(--accent-football)"
  }[tone];
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      display: "grid",
      gap: "var(--space-5)",
      maxWidth,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 36,
      height: 2,
      background: tick
    }
  }), /*#__PURE__*/React.createElement("blockquote", {
    className: "sc-quote",
    style: {
      margin: 0
    }
  }, quote), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-label"
  }, role), org && /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, org), sample && /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-xs)",
      padding: "2px 6px"
    }
  }, "Sample copy")));
}
Object.assign(__ds_scope, { QuoteBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/storytelling/QuoteBlock.jsx", error: String((e && e.message) || e) }); }

// components/storytelling/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  index,
  tone = "default",
  title,
  lede,
  size = "lg",
  align = "start",
  maxWidth = 820,
  level = 2,
  children,
  style
}) {
  const cls = {
    cinema: "sc-cinema",
    hero: "sc-hero",
    lg: "sc-display-lg",
    md: "sc-display-md",
    h1: "sc-h1"
  }[size];
  const H = `h${level}`;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      justifyItems: align === "center" ? "center" : "start",
      textAlign: align === "center" ? "center" : "start",
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    index: index,
    tone: tone
  }, eyebrow), /*#__PURE__*/React.createElement(H, {
    className: cls,
    style: {
      maxWidth
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    className: "sc-body-lg",
    style: {
      maxWidth: Math.min(maxWidth, 640)
    }
  }, lede), children);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/storytelling/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/storytelling/StatMetric.jsx
try { (() => {
const TONES = {
  default: "var(--interactive)",
  academy: "var(--accent-academy)",
  venue: "var(--accent-venue)",
  club: "var(--accent-club)",
  football: "var(--accent-football)",
  live: "var(--live)"
};
function StatMetric({
  value,
  label,
  sub,
  tone = "default",
  align = "start",
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      justifyItems: align === "center" ? "center" : "start",
      textAlign: align,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 28,
      height: 2,
      background: TONES[tone]
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-metric"
  }, value), /*#__PURE__*/React.createElement("span", {
    className: "sc-label"
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, sub));
}
Object.assign(__ds_scope, { StatMetric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/storytelling/StatMetric.jsx", error: String((e && e.message) || e) }); }

// guidelines/proof/shared.jsx
try { (() => {
const TP_NS = window.SCRIPEPublicWebsiteExperienceSystem_31d3ea;
const {
  NavBar,
  Eyebrow,
  Button,
  TextLink,
  MediaFrame,
  SectionHeading,
  FormationPitch,
  ProductChip
} = TP_NS;
const TP_COPY = {
  en: {
    kicker: "The operational partner behind modern sports organizations",
    lines: "Every session. Every pitch. Every athlete.",
    accent: "One operating rhythm.",
    lede: "SCRIPE connects athletes, coaches, facilities, bookings, payments and evidence — so the whole organization runs as one.",
    cta1: "Book a demo",
    cta2: "Explore the platform",
    shot: "Dawn training — coach walking the line",
    shotMeta: "Campaign film",
    chEyebrow: "Football Intelligence",
    chTitle: "From kick-off to evidence.",
    chLede: "Coaches set the pitch context and leave every session with evidence they can stand behind.",
    pitchLabel: "Session — U14 A",
    trialLabel: "Position trial — RW",
    legend: {
      a: "Team A",
      b: "Team B",
      trial: "Position trial"
    },
    accentEyebrow: "Multi-sport by design",
    footer: "The operational partner behind modern sports organizations.",
    legal: ["Privacy", "Terms", "Accessibility"]
  },
  ar: {
    kicker: "الشريك التشغيلي خلف المنظمات الرياضية الحديثة",
    lines: "كل حصة وكل ملعب، بإيقاعٍ واحد لكل رياضي.",
    accent: "إيقاع تشغيلي واحد.",
    lede: "‏SCRIPE يربط الرياضيين والمدربين والمنشآت والحجوزات والمدفوعات والأدلة — لتعمل المنظمة كلها كوحدة واحدة.",
    cta1: "احجز عرضًا توضيحيًا",
    cta2: "استكشف المنصة",
    shot: "استقبال المنشأة وقت الذروة",
    shotMeta: "تصوير الحملة",
    chEyebrow: "عمليات المنشآت",
    chTitle: "كل ملعب ومسار محسوب.",
    chLede: "الإتاحة والحجوزات المتكررة تُحل قبل أن تصل إلى الاستقبال.",
    accentEyebrow: "التركيبة المتصلة",
    footer: "الشريك التشغيلي خلف المنظمات الرياضية الحديثة.",
    legal: ["الخصوصية", "الشروط", "إمكانية الوصول"]
  }
};
function VenueStrip() {
  const rows = [["booked", "free", "held", "booked"], ["recurring", "booked", "free", "booked"], ["free", "recurring", "booked", "free"]];
  const clr = {
    booked: "var(--positive)",
    recurring: "var(--positive)",
    held: "var(--live)",
    free: "var(--border-hairline)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      padding: 16,
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      background: "var(--surface-1)"
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 6
    }
  }, r.map((s, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      height: 26,
      borderRadius: 5,
      background: s === "free" ? "transparent" : `color-mix(in srgb,${clr[s]} 16%,transparent)`,
      border: `1px solid ${s === "free" ? "var(--border-hairline)" : `color-mix(in srgb,${clr[s]} 40%,transparent)`}`
    }
  })))));
}
window.ThemeProof = function ThemeProof({
  theme,
  locale
}) {
  const t = TP_COPY[locale];
  const rtl = locale === "ar";
  const evidence = rtl ? /*#__PURE__*/React.createElement(VenueStrip, null) : /*#__PURE__*/React.createElement(FormationPitch, {
    formation: "7v7",
    trial: true,
    label: t.pitchLabel,
    trialLabel: t.trialLabel,
    legend: t.legend
  });
  const media = /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: rtl ? "photo" : "cinema",
    grade: rtl ? "dusk" : "turf",
    reveal: false,
    label: t.shot,
    meta: t.shotMeta
  });
  const heroText = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, t.kicker), /*#__PURE__*/React.createElement("h1", {
    className: "sc-hero",
    style: {
      maxWidth: 640,
      fontSize: "clamp(2rem,1.5rem + 2vw,3.2rem)"
    }
  }, t.lines, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent-primary)"
    }
  }, t.accent)), /*#__PURE__*/React.createElement("p", {
    className: "sc-body-lg",
    style: {
      maxWidth: 520
    }
  }, t.lede), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: rtl ? "wrap-reverse" : "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    arrow: true
  }, t.cta1), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, t.cta2)));
  return /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    lang: locale,
    dir: rtl ? "rtl" : "ltr",
    style: {
      background: "var(--surface-page)",
      color: "var(--text-primary)",
      backgroundImage: "var(--wash-brand)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    sticky: false,
    logoSrc: "../../assets/logo.png",
    locale: locale,
    theme: theme
  }), /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      paddingBlock: "var(--space-9)",
      display: "grid",
      gap: "var(--space-9)"
    }
  }, rtl ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "5fr 7fr",
      gap: "var(--space-8)",
      alignItems: "center"
    }
  }, media, heroText) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-7)"
    }
  }, heroText, media), /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: t.chEyebrow,
    tone: rtl ? "venue" : "football",
    title: t.chTitle,
    lede: t.chLede
  }), evidence, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "default"
  }, t.accentEyebrow), /*#__PURE__*/React.createElement(ProductChip, {
    product: rtl ? "club" : "academy",
    showDesc: true
  }), /*#__PURE__*/React.createElement(ProductChip, {
    product: rtl ? "football" : "venue"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-5)",
      flexWrap: "wrap",
      alignItems: "center",
      paddingTop: "var(--space-6)",
      borderTop: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-label"
  }, "States"), /*#__PURE__*/React.createElement(Button, null, "Default"), /*#__PURE__*/React.createElement(Button, {
    style: {
      background: "var(--interactive-hover)"
    }
  }, "Hover"), /*#__PURE__*/React.createElement(Button, {
    style: {
      boxShadow: "0 0 0 3px color-mix(in srgb,var(--focus-ring) 35%,transparent)"
    }
  }, "Focus"), /*#__PURE__*/React.createElement(Button, {
    disabled: true
  }, "Disabled"), /*#__PURE__*/React.createElement(TextLink, {
    arrow: "fwd"
  }, t.cta2))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-hairline)",
      padding: "var(--space-6) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm"
  }, t.footer), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16
    }
  }, t.legal.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    className: "sc-caption"
  }, l))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "guidelines/proof/shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/public_site/DemoScreen.jsx
try { (() => {
const NS_D = window.SCRIPEPublicWebsiteExperienceSystem_31d3ea;
const {
  SectionHeading: SH_D,
  DemoForm
} = NS_D;
const {
  Reveal: Rev_D,
  Section: Sec_D
} = window.SCRIPE_KIT;
function DemoScreen({
  t,
  go,
  variant = "demo"
}) {
  const d = t.demo;
  return /*#__PURE__*/React.createElement("main", {
    id: "main"
  }, /*#__PURE__*/React.createElement(Sec_D, {
    pad: "clamp(48px,7vh,88px) 0 var(--section-gap-sm)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "var(--space-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Rev_D, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(SH_D, {
    eyebrow: d.eyebrow,
    tone: "default",
    title: d.title,
    lede: d.lede,
    size: "lg",
    level: 1
  }), /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: 0
    }
  }, d.steps.map(([h, b], i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: 16,
      paddingBlock: 16,
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      color: "var(--interactive)",
      marginTop: 3
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-h4"
  }, h), /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm"
  }, b))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, d.trust.map((x, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--positive)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginTop: 3,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm",
    style: {
      color: "var(--text-primary)"
    }
  }, x)))))), /*#__PURE__*/React.createElement(Rev_D, {
    delay: 120
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-1)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-tile)",
      boxShadow: "var(--shadow-2)",
      padding: "clamp(22px,3vw,36px)"
    }
  }, /*#__PURE__*/React.createElement(DemoForm, {
    t: t.form,
    variant: variant
  }))))));
}
window.SCRIPE_SCREENS = Object.assign(window.SCRIPE_SCREENS || {}, {
  DemoScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/public_site/DemoScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/public_site/HomeScreen.jsx
try { (() => {
const NS_H = window.SCRIPEPublicWebsiteExperienceSystem_31d3ea;
const {
  SectionHeading,
  Eyebrow,
  MediaFrame,
  StatMetric,
  QuoteBlock,
  FormationPitch,
  Button,
  TextLink
} = NS_H;
const {
  Reveal,
  Section,
  Marking
} = window.SCRIPE_KIT;
const PCOLORS = {
  academy: "var(--accent-academy)",
  venue: "var(--accent-venue)",
  football: "var(--accent-football)",
  club: "var(--accent-club)"
};
function Hero({
  t,
  go
}) {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setM(true)));
    return () => cancelAnimationFrame(id);
  }, []);
  const it = d => ({
    opacity: m ? 1 : 0,
    transform: m ? "none" : "translateY(calc(22px*var(--motion-travel)))",
    transition: `opacity var(--motion-reveal) var(--ease-standard) ${d}ms,transform var(--motion-narrative) var(--ease-enter) ${d}ms`
  });
  return /*#__PURE__*/React.createElement("section", {
    style: {
      backgroundImage: "var(--wash-brand)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      paddingBlock: "clamp(52px,8vh,100px) var(--space-9)",
      display: "grid",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: it(0)
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, t.hero.kicker)), /*#__PURE__*/React.createElement("h1", {
    className: "sc-hero",
    style: {
      display: "grid",
      maxWidth: 980
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: it(90)
  }, t.hero.lines.join(" ")), /*#__PURE__*/React.createElement("span", {
    style: {
      ...it(320),
      color: "var(--accent-primary)"
    }
  }, t.hero.accent)), /*#__PURE__*/React.createElement("p", {
    className: "sc-body-lg",
    style: {
      ...it(480),
      maxWidth: 620
    }
  }, t.hero.lede), /*#__PURE__*/React.createElement("div", {
    style: {
      ...it(600),
      display: "flex",
      gap: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    arrow: true,
    onClick: () => go("demo")
  }, t.hero.cta1), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => go("platform")
  }, t.hero.cta2))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...it(760),
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
      paddingBlock: 13,
      borderBlock: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--live)",
      boxShadow: "0 0 0 4px color-mix(in srgb,var(--live) 18%,transparent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      color: "var(--live)"
    }
  }, t.hero.live)), /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      flex: 1,
      minWidth: 260
    }
  }, t.hero.ticker)), /*#__PURE__*/React.createElement("div", {
    style: it(880)
  }, /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "cinema",
    grade: "turf",
    reveal: false,
    label: t.hero.shot,
    meta: t.hero.shotMeta
  }))));
}
function FragRow({
  i,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      paddingBlock: 14,
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-meta",
    style: {
      color: "var(--text-tertiary)"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    className: "sc-body",
    style: {
      color: "var(--text-primary)"
    }
  }, text));
}
function Recognition({
  t
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "var(--space-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: t.recog.index,
    eyebrow: t.recog.eyebrow,
    title: t.recog.title,
    lede: t.recog.lede
  }), /*#__PURE__*/React.createElement("div", null, t.recog.frags.map((f, i) => /*#__PURE__*/React.createElement(FragRow, {
    key: i,
    i: i,
    text: f
  }))), /*#__PURE__*/React.createElement("p", {
    className: "sc-h3",
    style: {
      color: "var(--interactive)"
    }
  }, t.recog.note))), /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "photo",
    grade: "dusk",
    label: t.recog.shot,
    meta: t.recog.shotMeta
  })));
}
function MicroAcademy() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      maxWidth: 150
    }
  }, [...Array(18)].map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: i < 16 ? "var(--accent-academy)" : "transparent",
      border: i < 16 ? "none" : "1px solid var(--border-strong)",
      opacity: i < 16 ? .9 : 1
    }
  })));
}
function MicroVenue() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      alignItems: "flex-end",
      height: 34
    }
  }, [18, 26, 12, 32, 22, 34, 15].map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 10,
      height: h,
      borderRadius: 2,
      background: "color-mix(in srgb,var(--accent-venue) 72%,transparent)"
    }
  })));
}
function MicroFootball() {
  const P = [[6, 17], [22, 8], [22, 26], [40, 12], [40, 22], [58, 17], [74, 17]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 90,
      height: 36,
      border: "1px solid var(--border-strong)",
      borderRadius: 4
    }
  }, P.map(([x, y], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      insetInlineStart: x,
      top: y - 3,
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "var(--accent-football)"
    }
  })));
}
function MicroClub() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, ["var(--accent-academy)", "var(--accent-venue)", "var(--accent-football)"].map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 11,
      height: 11,
      borderRadius: 3,
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 1,
      background: "var(--border-strong)"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 3,
      background: "var(--accent-club)"
    }
  }));
}
const MICRO = {
  academy: MicroAcademy,
  venue: MicroVenue,
  football: MicroFootball,
  club: MicroClub
};
function WorldPanel({
  item,
  mega,
  go,
  delay
}) {
  const [hov, setHov] = React.useState(false);
  const m = mega.find(x => x.key === item.key);
  const Micro = MICRO[item.key];
  return /*#__PURE__*/React.createElement(Reveal, {
    delay: delay
  }, /*#__PURE__*/React.createElement("a", {
    href: "#" + item.key,
    onClick: e => {
      e.preventDefault();
      go(item.key);
    },
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "grid",
      gap: "var(--space-5)",
      alignContent: "start",
      padding: "var(--space-6)",
      minHeight: 230,
      border: `1px solid ${hov ? "var(--border-strong)" : "var(--border-hairline)"}`,
      borderRadius: "var(--radius-tile)",
      background: hov ? "var(--surface-1)" : "transparent",
      textDecoration: "none",
      transform: hov ? "translateY(calc(-3px*var(--motion-travel)))" : "none",
      transition: "background var(--motion-control) var(--ease-standard),border-color var(--motion-control) var(--ease-standard),transform var(--motion-control) var(--ease-settle)",
      boxShadow: hov ? "var(--shadow-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: PCOLORS[item.key]
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-h4"
  }, m.name)), /*#__PURE__*/React.createElement("p", {
    className: "sc-body-sm"
  }, m.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "grid",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Micro, null), /*#__PURE__*/React.createElement("span", {
    className: "sc-meta"
  }, item.micro, " \u2014 ", item.detail))));
}
function OneOS({
  t,
  go
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    index: t.os.index,
    eyebrow: t.os.eyebrow,
    tone: "default",
    title: t.os.title,
    lede: t.os.lede
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "var(--space-4)"
    }
  }, t.os.products.map((p, i) => /*#__PURE__*/React.createElement(WorldPanel, {
    key: p.key,
    item: p,
    mega: t.mega,
    go: go,
    delay: i * 80
  }))));
}
function CheckRow({
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 11,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--positive)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginTop: 4,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sc-body",
    style: {
      color: "var(--text-primary)"
    }
  }, text));
}
function Football({
  t,
  go
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "var(--space-10)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: t.fi.index,
    eyebrow: t.fi.eyebrow,
    tone: "football",
    title: t.fi.title,
    lede: t.fi.lede
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 14
    }
  }, t.fi.bullets.map((b, i) => /*#__PURE__*/React.createElement(CheckRow, {
    key: i,
    text: b
  }))), /*#__PURE__*/React.createElement(TextLink, {
    arrow: "fwd",
    onClick: e => {
      e.preventDefault();
      go("football");
    }
  }, t.mega[2].name))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement(FormationPitch, {
    formation: "7v7",
    trial: true,
    label: t.fi.pitchLabel,
    trialLabel: t.fi.trialLabel,
    legend: t.fi.legend
  }))));
}
const AVAIL = [["booked", "free", "booked", "free", "held"], ["recurring", "booked", "free", "booked", "free"], ["booked", "recurring", "booked", "held", "booked"], ["free", "booked", "booked", "free", "recurring"]];
function Cell({
  s,
  legend
}) {
  const S = {
    booked: {
      bg: "color-mix(in srgb,var(--positive) 15%,transparent)",
      bd: "color-mix(in srgb,var(--positive) 36%,transparent)",
      c: "var(--positive)",
      l: legend.booked
    },
    recurring: {
      bg: "color-mix(in srgb,var(--positive) 15%,transparent)",
      bd: "color-mix(in srgb,var(--positive) 55%,transparent)",
      c: "var(--positive)",
      l: legend.recurring,
      r: true
    },
    held: {
      bg: "color-mix(in srgb,var(--live) 13%,transparent)",
      bd: "color-mix(in srgb,var(--live) 40%,transparent)",
      c: "var(--live)",
      l: legend.held
    },
    free: {
      bg: "transparent",
      bd: "var(--border-hairline)",
      c: "var(--text-tertiary)",
      l: ""
    }
  }[s];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 36,
      borderRadius: 6,
      border: `1px solid ${S.bd}`,
      background: S.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4
    }
  }, S.r && /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: S.c,
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-2.64-6.36"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 3v6h-6"
  })), S.l && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 10px/1 Inter,sans-serif",
      letterSpacing: ".05em",
      color: S.c
    }
  }, S.l));
}
function Venue({
  t
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    index: t.venue.index,
    eyebrow: t.venue.eyebrow,
    tone: "venue",
    title: t.venue.title,
    lede: t.venue.lede
  })), /*#__PURE__*/React.createElement(Reveal, {
    delay: 100
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      background: "var(--surface-1)",
      boxShadow: "var(--shadow-1)",
      padding: "var(--space-6)",
      display: "grid",
      gap: 12,
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(130px,1.3fr) repeat(5,minmax(76px,1fr))",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null), t.venue.slots.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "sc-meta",
    style: {
      textAlign: "center",
      direction: "ltr"
    }
  }, s)), t.venue.resources.map((r, ri) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-label",
    style: {
      fontSize: ".8125rem"
    }
  }, r), AVAIL[ri].map((s, ci) => /*#__PURE__*/React.createElement(Cell, {
    key: ci,
    s: s,
    legend: t.venue.legend
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderTop: "1px solid var(--border-hairline)",
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: "var(--attention)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-caption"
  }, t.venue.note)))));
}
function Sports({
  t
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(SectionHeading, {
    index: t.sports.index,
    eyebrow: t.sports.eyebrow,
    title: t.sports.title
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-3)"
    }
  }, t.sports.list.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      flex: "1 1 150px",
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(MediaFrame, {
    ratio: "portrait",
    grade: s.grade,
    meta: "",
    label: s.name,
    radius: "var(--radius-card)"
  })))));
}
function Trust({
  t
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
      gap: "var(--space-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: t.trust.index,
    eyebrow: t.trust.eyebrow,
    title: t.trust.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 14
    }
  }, t.trust.bullets.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 11,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--interactive)",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginTop: 3,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sc-body",
    style: {
      color: "var(--text-primary)"
    }
  }, b)))))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(QuoteBlock, {
    sample: true,
    quote: t.trust.quote,
    role: t.trust.role,
    org: t.trust.org
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-9)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(StatMetric, {
    value: "4",
    label: t.trust.stats.worlds,
    tone: "default"
  }), /*#__PURE__*/React.createElement(StatMetric, {
    value: "2",
    label: t.trust.stats.locales,
    sub: "English \xB7 \u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    tone: "live"
  }), /*#__PURE__*/React.createElement(StatMetric, {
    value: "11v11",
    label: t.trust.stats.formations,
    sub: "5v5 \xB7 7v7 \xB7 9v9",
    tone: "football"
  }))))));
}
function Band({
  t,
  go
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    "data-theme": "dark",
    style: {
      background: "var(--surface-page)",
      backgroundImage: "var(--wash-brand)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-tile)",
      padding: "clamp(44px,7vw,84px) clamp(24px,5vw,64px)",
      display: "grid",
      gap: "var(--space-6)",
      justifyItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sc-display-lg",
    style: {
      color: "var(--text-display)"
    }
  }, t.band.title), /*#__PURE__*/React.createElement("p", {
    className: "sc-body-lg",
    style: {
      maxWidth: 560,
      color: "var(--text-secondary)"
    }
  }, t.band.lede), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    arrow: true,
    onClick: () => go("demo")
  }, t.band.cta1), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => go("trial")
  }, t.band.cta2)))));
}
function HomeScreen({
  t,
  go
}) {
  return /*#__PURE__*/React.createElement("main", {
    id: "main"
  }, /*#__PURE__*/React.createElement(Hero, {
    t: t,
    go: go
  }), /*#__PURE__*/React.createElement(Recognition, {
    t: t
  }), /*#__PURE__*/React.createElement(Marking, null), /*#__PURE__*/React.createElement(OneOS, {
    t: t,
    go: go
  }), /*#__PURE__*/React.createElement(Football, {
    t: t,
    go: go
  }), /*#__PURE__*/React.createElement(Venue, {
    t: t
  }), /*#__PURE__*/React.createElement(Sports, {
    t: t
  }), /*#__PURE__*/React.createElement(Marking, null), /*#__PURE__*/React.createElement(Trust, {
    t: t
  }), /*#__PURE__*/React.createElement(Band, {
    t: t,
    go: go
  }));
}
window.SCRIPE_SCREENS = Object.assign(window.SCRIPE_SCREENS || {}, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/public_site/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/public_site/PricingScreen.jsx
try { (() => {
const NS_P = window.SCRIPEPublicWebsiteExperienceSystem_31d3ea;
const {
  SectionHeading: SH_P,
  PricingTier,
  ProductChip: PC_P,
  Button: Btn_P
} = NS_P;
const {
  Reveal: Rev_P,
  Section: Sec_P
} = window.SCRIPE_KIT;
function Faq({
  q,
  a
}) {
  return /*#__PURE__*/React.createElement("details", {
    style: {
      borderTop: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      listStyle: "none",
      display: "flex",
      alignItems: "center",
      gap: 12,
      paddingBlock: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-h4",
    style: {
      flex: 1
    }
  }, q), /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      color: "var(--text-tertiary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "sc-body",
    style: {
      paddingBottom: 20,
      maxWidth: 640
    }
  }, a));
}
function PricingScreen({
  t,
  go
}) {
  const p = t.pricing;
  return /*#__PURE__*/React.createElement("main", {
    id: "main"
  }, /*#__PURE__*/React.createElement(Sec_P, {
    pad: "clamp(48px,7vh,88px) 0 0"
  }, /*#__PURE__*/React.createElement(Rev_P, null, /*#__PURE__*/React.createElement(SH_P, {
    eyebrow: p.eyebrow,
    tone: "default",
    title: p.title,
    lede: p.lede,
    size: "hero",
    level: 1
  }))), /*#__PURE__*/React.createElement(Sec_P, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
      gap: "var(--space-5)",
      alignItems: "stretch"
    }
  }, p.tiers.map((tier, i) => /*#__PURE__*/React.createElement(Rev_P, {
    key: tier.name,
    delay: i * 90
  }, /*#__PURE__*/React.createElement(PricingTier, {
    name: "SCRIPE " + tier.name,
    product: tier.product,
    blurb: tier.blurb,
    includes: tier.includes,
    featured: tier.featured,
    badge: p.badge,
    priceNote: p.price,
    priceMeta: p.priceMeta,
    ctaLabel: p.cta,
    onCta: () => go("demo"),
    style: {
      height: "100%"
    }
  })))), /*#__PURE__*/React.createElement(Rev_P, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-card)",
      padding: "18px 22px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: "var(--accent-football)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sc-body-sm",
    style: {
      flex: 1,
      minWidth: 260,
      color: "var(--text-primary)"
    }
  }, p.addon), /*#__PURE__*/React.createElement(Btn_P, {
    variant: "secondary",
    size: "sm",
    onClick: () => go("football")
  }, t.mega[2].name)))), /*#__PURE__*/React.createElement(Sec_P, null, /*#__PURE__*/React.createElement(Rev_P, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, p.faq.map(([q, a], i) => /*#__PURE__*/React.createElement(Faq, {
    key: i,
    q: q,
    a: a
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-hairline)"
    }
  })))));
}
window.SCRIPE_SCREENS = Object.assign(window.SCRIPE_SCREENS || {}, {
  PricingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/public_site/PricingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/public_site/app.jsx
try { (() => {
const NS_A = window.SCRIPEPublicWebsiteExperienceSystem_31d3ea;
const {
  NavBar,
  SiteFooter,
  LocaleSwitch: LS_A,
  ThemeToggle: TT_A
} = NS_A;
const CONTENT = window.SCRIPE_CONTENT;
const SCREENS = window.SCRIPE_SCREENS;
function App() {
  const [theme, setTheme] = React.useState(() => document.documentElement.dataset.theme || "dark");
  const [locale, setLocale] = React.useState(() => document.documentElement.lang || "en");
  const [route, setRoute] = React.useState(() => {
    try {
      return localStorage.getItem("scripe-screen") || "home";
    } catch (e) {
      return "home";
    }
  });
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("scripe-theme", theme);
    } catch (e) {}
  }, [theme]);
  React.useEffect(() => {
    const h = document.documentElement;
    h.lang = locale;
    h.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("scripe-locale", locale);
    } catch (e) {}
  }, [locale]);
  React.useEffect(() => {
    try {
      localStorage.setItem("scripe-screen", route);
    } catch (e) {}
    window.scrollTo(0, 0);
  }, [route]);
  const t = CONTENT[locale] || CONTENT.en;
  const go = k => {
    if (k === "pricing") setRoute("pricing");else if (k === "demo") setRoute("demo");else if (k === "trial") setRoute("trial");else if (k === "signin") return;else setRoute("home");
  };
  const links = [{
    key: "products",
    label: t.nav.products,
    mega: true
  }, {
    key: "solutions",
    label: t.nav.solutions,
    href: "#solutions"
  }, {
    key: "pricing",
    label: t.nav.pricing,
    href: "#pricing"
  }, {
    key: "resources",
    label: t.nav.resources,
    href: "#resources"
  }, {
    key: "company",
    label: t.nav.company,
    href: "#company"
  }];
  const Screen = route === "pricing" ? SCREENS.PricingScreen : route === "demo" || route === "trial" ? SCREENS.DemoScreen : SCREENS.HomeScreen;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: "#main",
    className: "sc-skip"
  }, "Skip to content"), /*#__PURE__*/React.createElement(NavBar, {
    logoSrc: "../../assets/logo.png",
    links: links,
    megaItems: t.mega,
    activeKey: route === "trial" ? "demo" : route,
    signInLabel: t.nav.signIn,
    ctaLabel: t.nav.cta,
    theme: theme,
    onThemeChange: setTheme,
    locale: locale,
    onLocaleChange: setLocale,
    onNavigate: go,
    onCta: () => go("demo")
  }), /*#__PURE__*/React.createElement(Screen, {
    key: route + locale,
    t: t,
    go: go,
    variant: route === "trial" ? "trial" : "demo"
  }), /*#__PURE__*/React.createElement(SiteFooter, {
    logoSrc: "../../assets/logo.png",
    tagline: t.footer.tagline,
    columns: t.footer.cols,
    legal: t.footer.legal,
    onNavigate: go
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(LS_A, {
    locale: locale,
    onChange: setLocale
  }), /*#__PURE__*/React.createElement(TT_A, {
    theme: theme,
    onChange: setTheme
  }))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/public_site/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/public_site/content.jsx
try { (() => {
window.SCRIPE_CONTENT = {
  en: {
    nav: {
      products: "Products",
      solutions: "Solutions",
      pricing: "Pricing",
      resources: "Resources",
      company: "Company",
      signIn: "Sign in",
      cta: "Book a demo"
    },
    mega: [{
      key: "academy",
      name: "SCRIPE Academy",
      desc: "Programs, groups, sessions, attendance and development for multi-sport academies.",
      color: "var(--accent-academy)",
      href: "#academy"
    }, {
      key: "venue",
      name: "SCRIPE Venue",
      desc: "Availability, one-off and recurring booking, payments, check-in and utilization.",
      color: "var(--accent-venue)",
      href: "#venue"
    }, {
      key: "football",
      name: "SCRIPE Football Intelligence",
      desc: "Pitch context, formations, evaluations, position trials and coach evidence.",
      color: "var(--accent-football)",
      href: "#football"
    }, {
      key: "club",
      name: "SCRIPE Club",
      desc: "The connected composition — facilities, programs, staff and customers as one.",
      color: "var(--accent-club)",
      href: "#club"
    }],
    megaMeta: "One platform — four product worlds",
    megaFooter: "Explore the platform",
    hero: {
      kicker: "The operational partner behind modern sports organizations",
      lines: ["Every session.", "Every pitch.", "Every athlete."],
      accent: "One operating rhythm.",
      lede: "SCRIPE is the Sports Operations OS that connects athletes, coaches, facilities, bookings, payments and evidence — so the whole organization runs as one.",
      cta1: "Book a demo",
      cta2: "Explore the platform",
      live: "Live",
      ticker: "TUE 17:00 · PITCH 2 · U14 A · ATTENDANCE 16/18 · NEXT: POSITION TRIAL — RW",
      shot: "Dawn training — first group arriving, coach walking the line",
      shotMeta: "Campaign film"
    },
    recog: {
      index: "01",
      eyebrow: "The daily reality",
      title: "Tuesday, 4:52pm.",
      lede: "Three pitches, five groups, two coaches out, one guardian on the phone. The operational layer nobody sees decides everything the crowd does.",
      frags: ["Sessions planned in one app", "Bookings held in a spreadsheet", "Evaluations in a coach's notebook", "Payments chased in chat threads"],
      note: "Fragmentation is the real opponent.",
      shot: "Academy reception at pick-up time — guardians, staff, kit bags",
      shotMeta: "Campaign photography"
    },
    os: {
      index: "02",
      eyebrow: "One operating system",
      title: "Connected, it becomes a rhythm.",
      lede: "Four product worlds, one operational truth — athletes, staff, facilities, money and evidence in a single connected system.",
      products: [{
        key: "academy",
        detail: "Multi-sport by design",
        micro: "Attendance 16/18"
      }, {
        key: "venue",
        detail: "Owned or rented facilities",
        micro: "Week utilization"
      }, {
        key: "football",
        detail: "Built with coaches",
        micro: "7v7 · Team A"
      }, {
        key: "club",
        detail: "The full composition",
        micro: "3 facilities · 1 club"
      }]
    },
    fi: {
      index: "03",
      eyebrow: "Football Intelligence",
      title: "From kick-off to evidence.",
      lede: "Coaches set the pitch context — 5v5 to 11v11 — run position trials, and leave every session with evidence they can stand behind.",
      bullets: ["Formations and positioning for every age group", "Position trials with structured observations", "Offline pitch-side — syncs when you're back"],
      pitchLabel: "Session — U14 A · Tuesday 17:00",
      trialLabel: "Position trial — RW",
      legend: {
        a: "Team A",
        b: "Team B",
        trial: "Position trial"
      }
    },
    venue: {
      index: "04",
      eyebrow: "Venue operations",
      title: "Every court, lane and half-pitch accounted for.",
      lede: "Availability, recurring reservations and conflicts resolved before they ever reach the front desk.",
      resources: ["Pitch 1 — Full", "Pitch 1 — Half A", "Padel Court 2", "Pool — Lane 4"],
      slots: ["16:00", "17:00", "18:00", "19:00", "20:00"],
      legend: {
        booked: "Booked",
        recurring: "Weekly",
        held: "Held",
        free: "Available"
      },
      note: "Full-pitch conflicts resolve into half-pitch alternatives automatically."
    },
    sports: {
      index: "05",
      eyebrow: "Beyond football",
      title: "Multi-sport from day one.",
      list: [{
        name: "Football",
        grade: "turf"
      }, {
        name: "Padel",
        grade: "court"
      }, {
        name: "Swimming",
        grade: "aqua"
      }, {
        name: "Basketball",
        grade: "dusk"
      }, {
        name: "Tennis",
        grade: "court"
      }, {
        name: "Gymnastics",
        grade: "dusk"
      }]
    },
    trust: {
      index: "06",
      eyebrow: "Trust",
      title: "Enterprise-ready, human-first.",
      bullets: ["Role-based access for staff, coaches and guardians", "Encrypted in transit and at rest", "Data residency options", "Accessibility to WCAG 2.2 AA"],
      stats: {
        worlds: "Product worlds",
        locales: "Languages, day one",
        formations: "Formation contexts"
      },
      quote: "For the first time, every coach walks onto the pitch already knowing the plan.",
      role: "Technical director",
      org: "Multi-branch football academy"
    },
    band: {
      title: "See SCRIPE around your operation.",
      lede: "A specialist walks your academy, venue or club through it — in English or Arabic.",
      cta1: "Book a demo",
      cta2: "Request a trial"
    },
    footer: {
      tagline: "The operational partner behind modern sports organizations.",
      cols: [{
        title: "Products",
        links: [{
          label: "SCRIPE Academy",
          dot: "var(--accent-academy)"
        }, {
          label: "SCRIPE Venue",
          dot: "var(--accent-venue)"
        }, {
          label: "SCRIPE Football Intelligence",
          dot: "var(--accent-football)"
        }, {
          label: "SCRIPE Club",
          dot: "var(--accent-club)"
        }]
      }, {
        title: "Solutions",
        links: [{
          label: "For academies"
        }, {
          label: "For venues"
        }, {
          label: "For clubs"
        }, {
          label: "For coaches"
        }]
      }, {
        title: "Resources",
        links: [{
          label: "Blog"
        }, {
          label: "Case studies"
        }, {
          label: "Knowledge center"
        }, {
          label: "Product updates"
        }]
      }, {
        title: "Company",
        links: [{
          label: "About"
        }, {
          label: "Careers"
        }, {
          label: "Contact"
        }, {
          label: "Trust & security"
        }]
      }],
      legal: [{
        label: "Privacy"
      }, {
        label: "Terms"
      }, {
        label: "Accessibility"
      }]
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Packaged around how you operate.",
      lede: "Sales-assisted from day one — pricing follows branches, sports and volume. No self-service lock-in.",
      price: "Custom",
      priceMeta: "Tailored to branches, sports and volume",
      cta: "Talk to sales",
      badge: "Most connected",
      tiers: [{
        name: "Academy",
        product: "academy",
        blurb: "Multi-sport academy operations.",
        includes: ["Athletes, guardians & staff records", "Programs, groups & sessions", "Attendance & evaluations", "Guardian communication"]
      }, {
        name: "Venue",
        product: "venue",
        blurb: "Facilities, bookings & utilization.",
        includes: ["Resource availability & pricing", "One-off & recurring bookings", "Payments & check-in", "Utilization insight"]
      }, {
        name: "Club",
        product: "club",
        featured: true,
        blurb: "The connected composition.",
        includes: ["Everything in Academy & Venue", "Football Intelligence ready", "Cross-facility operations", "Leadership reporting"]
      }],
      addon: "SCRIPE Football Intelligence — the coach app, formations, trials and evidence — extends Academy and Club.",
      faq: [["Can we start with a single branch?", "Yes — most organizations start with one branch or one product world and expand once the rhythm settles."], ["Is onboarding included?", "Every plan is sales-assisted: discovery, guided setup and a pilot plan with clear success criteria."], ["Do you support Arabic?", "English and Arabic are first-class across the product, the website and onboarding."]]
    },
    demo: {
      eyebrow: "Book a demo",
      title: "Around your operation, not a slideshow.",
      lede: "Tell us how you run today. We shape the walkthrough around your sports, facilities and season.",
      steps: [["Discovery call", "20 minutes on your sports, branches and current tools."], ["Guided walkthrough", "Your real workflows inside SCRIPE — sessions to bookings."], ["Pilot plan", "A scoped rollout with clear success criteria."]],
      trust: ["A specialist configures SCRIPE with you", "English and Arabic onboarding", "Your data stays yours — export any time"]
    },
    form: {}
  },
  ar: {
    nav: {
      products: "المنتجات",
      solutions: "الحلول",
      pricing: "الأسعار",
      resources: "الموارد",
      company: "الشركة",
      signIn: "تسجيل الدخول",
      cta: "احجز عرضًا"
    },
    mega: [{
      key: "academy",
      name: "SCRIPE Academy",
      desc: "البرامج والمجموعات والحصص والحضور والتطوير للأكاديميات متعددة الرياضات.",
      color: "var(--accent-academy)",
      href: "#academy"
    }, {
      key: "venue",
      name: "SCRIPE Venue",
      desc: "الإتاحة والحجوزات الفردية والمتكررة والمدفوعات وتسجيل الوصول ومعدلات الاستخدام.",
      color: "var(--accent-venue)",
      href: "#venue"
    }, {
      key: "football",
      name: "SCRIPE Football Intelligence",
      desc: "سياق الملعب والتشكيلات والتقييمات وتجارب المراكز وأدلة المدرب.",
      color: "var(--accent-football)",
      href: "#football"
    }, {
      key: "club",
      name: "SCRIPE Club",
      desc: "التركيبة المتصلة — المنشآت والبرامج والفرق والعملاء ككيان واحد.",
      color: "var(--accent-club)",
      href: "#club"
    }],
    megaMeta: "منصة واحدة — أربعة عوالم منتجات",
    megaFooter: "استكشف المنصة",
    hero: {
      kicker: "الشريك التشغيلي خلف المنظمات الرياضية الحديثة",
      lines: ["كل حصة.", "كل ملعب.", "كل رياضي."],
      accent: "إيقاع تشغيلي واحد.",
      lede: "‏SCRIPE هو نظام تشغيل العمليات الرياضية الذي يربط الرياضيين والمدربين والمنشآت والحجوزات والمدفوعات والأدلة — لتعمل منظمتك كلها كوحدة واحدة.",
      cta1: "احجز عرضًا توضيحيًا",
      cta2: "استكشف المنصة",
      live: "مباشر",
      ticker: "الثلاثاء ١٧:٠٠ · ملعب ٢ · تحت ١٤ أ · الحضور ١٦/١٨ · التالي: تجربة مركز — جناح أيمن",
      shot: "تدريب الفجر — وصول المجموعة الأولى والمدرب يتفقد الخط",
      shotMeta: "فيلم الحملة"
    },
    recog: {
      index: "٠١",
      eyebrow: "الواقع اليومي",
      title: "الثلاثاء، ٤:٥٢ مساءً.",
      lede: "ثلاثة ملاعب، خمس مجموعات، مدربان غائبان، وولي أمر على الهاتف. الطبقة التشغيلية التي لا يراها أحد تحسم كل ما يراه الجمهور.",
      frags: ["الحصص في تطبيق", "الحجوزات في جدول بيانات", "التقييمات في دفتر المدرب", "المدفوعات تُلاحق في المحادثات"],
      note: "التشتت هو الخصم الحقيقي.",
      shot: "استقبال الأكاديمية وقت الانصراف — أولياء أمور وموظفون وحقائب عدة",
      shotMeta: "تصوير الحملة"
    },
    os: {
      index: "٠٢",
      eyebrow: "نظام تشغيل واحد",
      title: "حين تتصل، تصبح إيقاعًا واحدًا.",
      lede: "أربعة عوالم منتجات وحقيقة تشغيلية واحدة — الرياضيون والفرق والمنشآت والأموال والأدلة في نظام متصل.",
      products: [{
        key: "academy",
        detail: "متعدد الرياضات بتصميمه",
        micro: "الحضور ١٦/١٨"
      }, {
        key: "venue",
        detail: "منشآت مملوكة أو مستأجرة",
        micro: "استخدام الأسبوع"
      }, {
        key: "football",
        detail: "بُني مع المدربين",
        micro: "7v7 · الفريق أ"
      }, {
        key: "club",
        detail: "التركيبة الكاملة",
        micro: "٣ منشآت · نادٍ واحد"
      }]
    },
    fi: {
      index: "٠٣",
      eyebrow: "الذكاء الكروي",
      title: "من ضربة البداية إلى الدليل.",
      lede: "يضبط المدرب سياق الملعب — من 5v5 إلى 11v11 — ويجري تجارب المراكز، ويغادر كل حصة بدليل يمكنه الوقوف خلفه.",
      bullets: ["تشكيلات وتمركز لكل فئة عمرية", "تجارب مراكز بملاحظات منظمة", "عمل دون اتصال بجانب الملعب — يتزامن عند العودة"],
      pitchLabel: "حصة — تحت ١٤ أ · الثلاثاء ١٧:٠٠",
      trialLabel: "تجربة مركز — جناح أيمن",
      legend: {
        a: "الفريق أ",
        b: "الفريق ب",
        trial: "تجربة مركز"
      }
    },
    venue: {
      index: "٠٤",
      eyebrow: "عمليات المنشآت",
      title: "كل ملعب ومسار ونصف ملعب محسوب.",
      lede: "الإتاحة والحجوزات المتكررة وحل التعارضات قبل أن تصل إلى الاستقبال.",
      resources: ["ملعب ١ — كامل", "ملعب ١ — نصف أ", "بادل ٢", "مسبح — مسار ٤"],
      slots: ["16:00", "17:00", "18:00", "19:00", "20:00"],
      legend: {
        booked: "محجوز",
        recurring: "أسبوعي",
        held: "معلّق",
        free: "متاح"
      },
      note: "تعارضات الملعب الكامل تُحل تلقائيًا ببدائل نصف الملعب."
    },
    sports: {
      index: "٠٥",
      eyebrow: "أبعد من كرة القدم",
      title: "متعدد الرياضات من اليوم الأول.",
      list: [{
        name: "كرة القدم",
        grade: "turf"
      }, {
        name: "بادل",
        grade: "court"
      }, {
        name: "سباحة",
        grade: "aqua"
      }, {
        name: "كرة السلة",
        grade: "dusk"
      }, {
        name: "تنس",
        grade: "court"
      }, {
        name: "جمباز",
        grade: "dusk"
      }]
    },
    trust: {
      index: "٠٦",
      eyebrow: "الثقة",
      title: "جاهز للمؤسسات، إنساني أولًا.",
      bullets: ["صلاحيات حسب الدور للموظفين والمدربين وأولياء الأمور", "تشفير أثناء النقل وفي التخزين", "خيارات إقامة البيانات", "إتاحة وفق WCAG 2.2 AA"],
      stats: {
        worlds: "عوالم منتجات",
        locales: "لغتان من اليوم الأول",
        formations: "سياقات التشكيلات"
      },
      quote: "لأول مرة، يدخل كل مدرب إلى الملعب وهو يعرف الخطة مسبقًا.",
      role: "مدير فني",
      org: "أكاديمية كرة قدم متعددة الفروع"
    },
    band: {
      title: "شاهد SCRIPE حول عمليتك أنت.",
      lede: "مختص يرافق أكاديميتك أو منشأتك أو ناديك خطوة بخطوة — بالعربية أو الإنجليزية.",
      cta1: "احجز عرضًا توضيحيًا",
      cta2: "اطلب نسخة تجريبية"
    },
    footer: {
      tagline: "الشريك التشغيلي خلف المنظمات الرياضية الحديثة.",
      cols: [{
        title: "المنتجات",
        links: [{
          label: "SCRIPE Academy",
          dot: "var(--accent-academy)"
        }, {
          label: "SCRIPE Venue",
          dot: "var(--accent-venue)"
        }, {
          label: "SCRIPE Football Intelligence",
          dot: "var(--accent-football)"
        }, {
          label: "SCRIPE Club",
          dot: "var(--accent-club)"
        }]
      }, {
        title: "الحلول",
        links: [{
          label: "للأكاديميات"
        }, {
          label: "للمنشآت"
        }, {
          label: "للأندية"
        }, {
          label: "للمدربين"
        }]
      }, {
        title: "الموارد",
        links: [{
          label: "المدونة"
        }, {
          label: "دراسات حالة"
        }, {
          label: "مركز المعرفة"
        }, {
          label: "تحديثات المنتج"
        }]
      }, {
        title: "الشركة",
        links: [{
          label: "من نحن"
        }, {
          label: "الوظائف"
        }, {
          label: "تواصل معنا"
        }, {
          label: "الثقة والأمان"
        }]
      }],
      legal: [{
        label: "الخصوصية"
      }, {
        label: "الشروط"
      }, {
        label: "إمكانية الوصول"
      }]
    },
    pricing: {
      eyebrow: "الأسعار",
      title: "باقات على قدر تشغيلك.",
      lede: "بمرافقة المبيعات منذ اليوم الأول — التسعير يتبع الفروع والرياضات والحجم. لا قوالب ذاتية مقفلة.",
      price: "حسب الطلب",
      priceMeta: "على قدر الفروع والرياضات والحجم",
      cta: "تحدث إلى المبيعات",
      badge: "الأكثر اتصالًا",
      tiers: [{
        name: "Academy",
        product: "academy",
        blurb: "عمليات أكاديمية متعددة الرياضات.",
        includes: ["سجلات الرياضيين وأولياء الأمور والموظفين", "البرامج والمجموعات والحصص", "الحضور والتقييمات", "التواصل مع أولياء الأمور"]
      }, {
        name: "Venue",
        product: "venue",
        blurb: "المنشآت والحجوزات ومعدلات الاستخدام.",
        includes: ["إتاحة الموارد والتسعير", "حجوزات فردية ومتكررة", "المدفوعات وتسجيل الوصول", "رؤية معدلات الاستخدام"]
      }, {
        name: "Club",
        product: "club",
        featured: true,
        blurb: "التركيبة المتصلة.",
        includes: ["كل ما في Academy وVenue", "جاهز لـ Football Intelligence", "عمليات عبر المنشآت", "تقارير القيادة"]
      }],
      addon: "‏SCRIPE Football Intelligence — تطبيق المدرب والتشكيلات والتجارب والأدلة — يوسّع Academy وClub.",
      faq: [["هل نبدأ بفرع واحد؟", "نعم — تبدأ معظم المنظمات بفرع واحد أو عالم منتج واحد ثم تتوسع حين يستقر الإيقاع."], ["هل الانضمام مشمول؟", "كل باقة بمرافقة المبيعات: مكالمة تعريفية وإعداد موجّه وخطة تجريبية بمعايير واضحة."], ["هل تدعمون العربية؟", "العربية والإنجليزية أساسيتان في المنتج والموقع والانضمام."]]
    },
    demo: {
      eyebrow: "احجز عرضًا",
      title: "حول عمليتك، لا عرض شرائح.",
      lede: "أخبرنا كيف تعمل اليوم، ونبني الجولة حول رياضاتك ومنشآتك وموسمك.",
      steps: [["مكالمة تعريفية", "٢٠ دقيقة حول رياضاتك وفروعك وأدواتك الحالية."], ["جولة موجهة", "سير عملك الحقيقي داخل SCRIPE — من الحصص إلى الحجوزات."], ["خطة تجريبية", "إطلاق محدود بمعايير نجاح واضحة."]],
      trust: ["مختص يهيئ SCRIPE معك", "انضمام بالعربية والإنجليزية", "بياناتك تبقى لك — صدّرها متى شئت"]
    },
    form: {
      name: "الاسم الكامل",
      namePh: "اسمك",
      email: "البريد المهني",
      emailPh: "name@organization.com",
      org: "المنظمة",
      orgPh: "اسم الأكاديمية أو النادي أو المنشأة",
      role: "دورك",
      rolePh: "اختر",
      roles: ["مالك / مدير", "مدير فني", "قائد عمليات", "مدرب", "مدير منشأة", "أخرى"],
      size: "حجم المنظمة",
      sizePh: "اختر",
      sizes: ["فرع واحد", "٢–٥ فروع", "٦ فروع فأكثر"],
      sports: "الرياضات التي تديرها",
      sportsList: ["كرة القدم", "بادل", "سباحة", "كرة السلة", "تنس", "جمباز", "أخرى"],
      products: "المنتجات التي تهمك",
      productLabels: {
        academy: "Academy",
        venue: "Venue",
        football: "Football Intelligence",
        club: "Club"
      },
      note: "ما الذي ينبغي أن نعرفه؟",
      notePh: "الأدوات الحالية، أعداد الرياضيين، الجداول الزمنية…",
      consent: "يمكنكم التواصل معي بشأن SCRIPE — بمرافقة المبيعات، دون رسائل مزعجة.",
      submit: "احجز عرضًا توضيحيًا",
      trialSubmit: "اطلب نسخة تجريبية",
      meta: "نرد خلال يوم عمل واحد.",
      successTitle: "استلمنا طلبك.",
      successBody: "سيتواصل معك مختص SCRIPE خلال يوم عمل واحد لتخطيط جولة حول عمليتك.",
      steps: ["مكالمة تعريفية", "جولة موجهة", "خطة تجريبية"]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/public_site/content.jsx", error: String((e && e.message) || e) }); }

// ui_kits/public_site/helpers.jsx
try { (() => {
function useInView(threshold = 0.16) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }), {
      threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on];
}
function Reveal({
  children,
  delay = 0,
  y = 26,
  style
}) {
  const [ref, on] = useInView();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      opacity: on ? 1 : 0,
      transform: on ? "none" : `translateY(calc(${y}px*var(--motion-travel)))`,
      transition: `opacity var(--motion-media) var(--ease-standard) ${delay}ms,transform var(--motion-reveal) var(--ease-enter) ${delay}ms`,
      ...style
    }
  }, children);
}
function Section({
  children,
  id,
  gap,
  pad = "var(--section-gap-sm)",
  style,
  wide
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      paddingBlock: pad,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: {
      display: "grid",
      gap: gap || "var(--space-8)"
    }
  }, children));
}
function Marking({
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sc-container",
    style: style
  }, /*#__PURE__*/React.createElement("hr", {
    className: "sc-marking"
  }));
}
window.SCRIPE_KIT = {
  useInView,
  Reveal,
  Section,
  Marking
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/public_site/helpers.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.DemoForm = __ds_scope.DemoForm;

__ds_ns.PricingTier = __ds_scope.PricingTier;

__ds_ns.SelectField = __ds_scope.SelectField;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.FormationPitch = __ds_scope.FormationPitch;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.LocaleSwitch = __ds_scope.LocaleSwitch;

__ds_ns.MegaMenu = __ds_scope.MegaMenu;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.ProductChip = __ds_scope.ProductChip;

__ds_ns.QuoteBlock = __ds_scope.QuoteBlock;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StatMetric = __ds_scope.StatMetric;

})();
