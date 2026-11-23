/* ==========================================================================
   AJD Custom Interior Upholstery — site behaviour

   1. Language switch (EN / ES) with localStorage persistence
   2. Live "open now / closed" status from the listed hours
   3. Mobile navigation drawer
   4. Scroll reveal (disabled under prefers-reduced-motion)
   5. Estimate note builder — composes a mailto: message in the visitor's
      own email client. Nothing is posted anywhere and nothing is stored.

   Every page renders its full English copy from the HTML itself, so the
   site is complete and readable with JavaScript switched off. This file
   only enhances: it swaps the language, it makes the hours pill live, and
   it assembles the email on the contact page.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "ajd-lang";
  var DEFAULT_LANG = "en";
  var DICT = window.AJD_I18N || { en: {}, es: {} };

  /* --- Listed hours, America/Chicago ----------------------------------
     Index 0 = Sunday. Values are [openMinute, closeMinute] or null.
     Source: the business's Google Business Profile, read 18 Nov 2026.
     Mon–Fri 8:00 AM – 5:00 PM · Sat 12:00 PM – 5:00 PM · Sun closed.
     If these change, edit this array AND the hours lists in the HTML.  */
  var SCHEDULE = [
    null,          /* Sun — closed              */
    [480, 1020],   /* Mon —  8:00 AM – 5:00 PM  */
    [480, 1020],   /* Tue                       */
    [480, 1020],   /* Wed                       */
    [480, 1020],   /* Thu                       */
    [480, 1020],   /* Fri                       */
    [720, 1020]    /* Sat — 12:00 PM – 5:00 PM  */
  ];
  var DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function readStoredLang() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return v === "en" || v === "es" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* Private mode or blocked storage — the switch still works for this visit. */
    }
  }

  function detectLang() {
    var stored = readStoredLang();
    if (stored) return stored;
    var nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    return nav.indexOf("es") === 0 ? "es" : DEFAULT_LANG;
  }

  function currentLang() {
    return document.documentElement.lang === "es" ? "es" : "en";
  }

  function t(lang, key) {
    var table = DICT[lang] || DICT[DEFAULT_LANG] || {};
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    var fallback = DICT[DEFAULT_LANG] || {};
    return Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : "";
  }

  /* ------------------------------------------------------------------ */
  /* 1. Translation                                                      */
  /* ------------------------------------------------------------------ */
  var ATTR_BINDINGS = [
    ["data-i18n-alt", "alt"],
    ["data-i18n-aria-label", "aria-label"],
    ["data-i18n-title", "title"],
    ["data-i18n-content", "content"],
    ["data-i18n-placeholder", "placeholder"]
  ];

  function translate(lang) {
    var i, nodes, value;

    nodes = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < nodes.length; i++) {
      value = t(lang, nodes[i].getAttribute("data-i18n"));
      if (value) nodes[i].textContent = value;
    }

    /* Values that intentionally contain <em>, <br> or <strong> */
    nodes = document.querySelectorAll("[data-i18n-html]");
    for (i = 0; i < nodes.length; i++) {
      value = t(lang, nodes[i].getAttribute("data-i18n-html"));
      if (value) nodes[i].innerHTML = value;
    }

    for (var b = 0; b < ATTR_BINDINGS.length; b++) {
      var dataAttr = ATTR_BINDINGS[b][0];
      var target = ATTR_BINDINGS[b][1];
      nodes = document.querySelectorAll("[" + dataAttr + "]");
      for (i = 0; i < nodes.length; i++) {
        value = t(lang, nodes[i].getAttribute(dataAttr));
        if (value) nodes[i].setAttribute(target, value);
      }
    }

    document.documentElement.setAttribute("lang", lang);

    var buttons = document.querySelectorAll("[data-lang-btn]");
    for (i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        "aria-pressed",
        buttons[i].getAttribute("data-lang-btn") === lang ? "true" : "false"
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. Live open / closed status                                        */
  /* ------------------------------------------------------------------ */
  function shopNow() {
    var now = new Date();
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(now);

      var found = {};
      for (var i = 0; i < parts.length; i++) found[parts[i].type] = parts[i].value;

      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(found.hour, 10);
      if (hour === 24 || isNaN(hour)) hour = 0;
      return { day: map[found.weekday], minutes: hour * 60 + parseInt(found.minute, 10) };
    } catch (e) {
      /* Browser without IANA time zone data — fall back to the visitor's clock. */
      return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
    }
  }

  function openTimeKey(day) {
    return day === 6 ? "t.open.sat" : "t.open.weekday";
  }
  function closeTimeKey(day) {
    return day === 6 ? "t.close.sat" : "t.close.weekday";
  }

  function computeStatus(lang) {
    var now = shopNow();
    var today = SCHEDULE[now.day];

    if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      return {
        state: "open",
        text: t(lang, "status.open"),
        note: t(lang, "status.closes").replace("{time}", t(lang, closeTimeKey(now.day)))
      };
    }

    if (today && now.minutes < today[0]) {
      return {
        state: "closed",
        text: t(lang, "status.closed"),
        note: t(lang, "status.opens").replace("{time}", t(lang, openTimeKey(now.day)))
      };
    }

    for (var step = 1; step <= 7; step++) {
      var day = (now.day + step) % 7;
      if (SCHEDULE[day]) {
        return {
          state: "closed",
          text: t(lang, "status.closed"),
          note: t(lang, "status.opensDay")
            .replace("{day}", t(lang, "hours." + DAY_KEYS[day] + "Short"))
            .replace("{time}", t(lang, openTimeKey(day)))
        };
      }
    }
    return { state: "closed", text: t(lang, "status.closed"), note: "" };
  }

  function renderStatus(lang) {
    var status = computeStatus(lang);
    var pills = document.querySelectorAll("[data-status]");
    for (var i = 0; i < pills.length; i++) {
      pills[i].setAttribute("data-state", status.state);
      var label = pills[i].querySelector("[data-status-text]");
      var note = pills[i].querySelector("[data-status-note]");
      if (label) label.textContent = status.text;
      if (note) note.textContent = status.note;
    }

    /* Highlight today's row in every hours list. */
    var today = shopNow().day;
    var rows = document.querySelectorAll("[data-day]");
    for (var r = 0; r < rows.length; r++) {
      rows[r].setAttribute(
        "data-today",
        rows[r].getAttribute("data-day") === String(today) ? "true" : "false"
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. Mobile drawer                                                    */
  /* ------------------------------------------------------------------ */
  function initDrawer() {
    var burger = document.querySelector("[data-burger]");
    var drawer = document.querySelector("[data-drawer]");
    if (!burger || !drawer) return;

    function setOpen(open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.setAttribute("data-open", open ? "true" : "false");
      var key = open ? "nav.close" : "nav.open";
      burger.setAttribute("data-i18n-aria-label", key);
      burger.setAttribute("aria-label", t(currentLang(), key));
    }

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    drawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Scroll reveal                                                    */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  /* ------------------------------------------------------------------ */
  /* 5. Estimate note builder                                            */
  /*                                                                     */
  /* There is no server behind this site, so the form does not post      */
  /* anywhere. It assembles what the visitor typed into a message and    */
  /* hands it to their own email client, addressed to the email the      */
  /* business publishes on its Facebook page. Nothing leaves the browser */
  /* until the visitor presses send in their own mail app.               */
  /* ------------------------------------------------------------------ */
  function initEstimateForm() {
    var form = document.querySelector("[data-estimate-form]");
    if (!form) return;

    var address = form.getAttribute("data-mailto") || "";
    if (!address) return;

    /* Look controls up by name attribute, NOT through form.elements.<name>.
       HTMLFormControlsCollection already owns item() / namedItem() / length,
       so form.elements.item would hand back the built-in method instead of
       the field called "item". */
    function control(fieldName) {
      return form.querySelector('[name="' + fieldName + '"]');
    }

    function valueOf(fieldName) {
      var el = control(fieldName);
      return el ? el.value : "";
    }

    function fieldOf(input) {
      return input.closest(".field");
    }

    function setInvalid(input, invalid) {
      var field = fieldOf(input);
      if (field) field.setAttribute("data-invalid", invalid ? "true" : "false");
      input.setAttribute("aria-invalid", invalid ? "true" : "false");
    }

    var required = form.querySelectorAll("[data-required]");
    for (var i = 0; i < required.length; i++) {
      required[i].addEventListener("input", function (event) {
        if (event.target.value.trim()) setInvalid(event.target, false);
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstBad = null;
      for (var r = 0; r < required.length; r++) {
        var bad = !required[r].value.trim();
        setInvalid(required[r], bad);
        if (bad && !firstBad) firstBad = required[r];
      }
      if (firstBad) {
        firstBad.focus();
        return;
      }

      var lang = currentLang();
      var lines = [];

      function add(labelKey, value) {
        var v = (value || "").trim();
        if (!v) return;
        lines.push(t(lang, labelKey) + ": " + v);
      }

      add("contact.form.name", valueOf("name"));
      add("contact.form.phone", valueOf("phone"));
      add("contact.form.item", valueOf("item"));
      add("contact.form.pieces", valueOf("pieces"));

      var materialSelect = control("material");
      if (materialSelect && materialSelect.value) {
        add("contact.form.material", t(lang, materialSelect.value));
      }

      var detail = valueOf("detail").trim();
      if (detail) {
        lines.push("");
        lines.push(t(lang, "contact.form.detail") + ":");
        lines.push(detail);
      }

      var href =
        "mailto:" +
        address +
        "?subject=" +
        encodeURIComponent(t(lang, "contact.form.subject")) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      window.location.href = href;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function setLanguage(lang) {
    translate(lang);
    renderStatus(lang);
    storeLang(lang);
  }

  function init() {
    var lang = detectLang();
    translate(lang);
    renderStatus(lang);

    var buttons = document.querySelectorAll("[data-lang-btn]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        setLanguage(event.currentTarget.getAttribute("data-lang-btn"));
      });
    }

    initDrawer();
    initReveal();
    initEstimateForm();

    /* Keep the open/closed pill honest if the page is left open. */
    setInterval(function () {
      renderStatus(currentLang());
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
