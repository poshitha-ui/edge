/* Edge Ark concept homepage: interactions
   No dependencies. Everything degrades gracefully if this file fails to load. */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Config: set FORM_ENDPOINT to a real form service
     (Formspree, Netlify Forms, your own API...) to enable live
     submission. While empty, the form validates but sends nothing
     and says so clearly.
  ------------------------------------------------------------- */
  const FORM_ENDPOINT = "";
  const CONTACT_EMAIL = "info@edgeark.com.au";

  /* ------------------------------------------------------------
     Header: compact on scroll
  ------------------------------------------------------------- */
  const header = document.getElementById("site-header");
  const setScrolled = () => {
    header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
  };
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  /* ------------------------------------------------------------
     Mobile menu
  ------------------------------------------------------------- */
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const desktopQuery = window.matchMedia("(min-width: 1024px)");

  const setMenu = (open, { returnFocus = false } = {}) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.dataset.open = String(open);
    header.dataset.menuOpen = String(open);
    if (!open && returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.dataset.open === "true") setMenu(false, { returnFocus: true });
  });
  desktopQuery.addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* ------------------------------------------------------------
     Active nav link (scroll-spy)
  ------------------------------------------------------------- */
  const navLinks = [...document.querySelectorAll('nav[aria-label="Primary"] a.nav-link')];
  const spyTargets = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => {
            const active = a.getAttribute("href") === `#${entry.target.id}`;
            if (active) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    spyTargets.forEach((s) => spy.observe(s));
  }

  /* ------------------------------------------------------------
     Scroll reveal
  ------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------
     FAQ accordion (one open at a time)
  ------------------------------------------------------------- */
  const faqList = document.getElementById("faq-list");
  if (faqList) {
    const items = [...faqList.querySelectorAll(".acc-item")];

    const setItem = (item, open) => {
      item.dataset.open = String(open);
      item.querySelector(".acc-trigger").setAttribute("aria-expanded", String(open));
    };

    faqList.addEventListener("click", (e) => {
      const trigger = e.target.closest(".acc-trigger");
      if (!trigger) return;
      const item = trigger.closest(".acc-item");
      const willOpen = item.dataset.open !== "true";
      items.forEach((i) => setItem(i, i === item ? willOpen : false));
    });

    // Arrow / Home / End move focus between questions
    faqList.addEventListener("keydown", (e) => {
      const triggers = items.map((i) => i.querySelector(".acc-trigger"));
      const idx = triggers.indexOf(document.activeElement);
      if (idx === -1) return;
      let next = null;
      if (e.key === "ArrowDown") next = triggers[(idx + 1) % triggers.length];
      else if (e.key === "ArrowUp") next = triggers[(idx - 1 + triggers.length) % triggers.length];
      else if (e.key === "Home") next = triggers[0];
      else if (e.key === "End") next = triggers[triggers.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    });
  }

  /* ------------------------------------------------------------
     Contact form
  ------------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const submitBtn = document.getElementById("f-submit");
    const submitLabel = submitBtn.querySelector("[data-label]");
    const statusBox = document.getElementById("f-status");
    const message = document.getElementById("f-message");
    const counter = document.getElementById("f-count");

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const rules = {
      name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
      email: (v) => {
        if (!v.trim()) return "Please enter your email address.";
        return emailRe.test(v.trim()) ? "" : "That doesn't look like a valid email address.";
      },
      phone: (v) => {
        if (!v.trim()) return ""; // optional
        const digits = v.replace(/\D/g, "");
        return /^[+()\d\s-]+$/.test(v) && digits.length >= 6 && digits.length <= 15
          ? ""
          : "Please enter a valid phone number, or leave it blank.";
      },
      subject: (v) => (v.trim().length < 3 ? "Please add a short subject." : ""),
      message: (v) => (v.trim().length < 10 ? "Please tell us a little more (at least 10 characters)." : ""),
    };

    const fieldFor = (name) => form.elements[name];
    const errorFor = (name) => document.getElementById(`f-${name}-err`);

    const validateField = (name) => {
      const input = fieldFor(name);
      const msg = rules[name](input.value);
      errorFor(name).textContent = msg;
      if (msg) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
      return !msg;
    };

    Object.keys(rules).forEach((name) => {
      const input = fieldFor(name);
      input.addEventListener("blur", () => validateField(name));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") validateField(name);
      });
    });

    message.addEventListener("input", () => {
      counter.textContent = `${message.value.length} / 500`;
    });

    const showStatus = (type, text, extra) => {
      const styles = {
        info: ["border-amber-300", "bg-amber-50", "text-amber-900"],
        success: ["border-emerald-300", "bg-emerald-50", "text-emerald-900"],
        error: ["border-red-300", "bg-red-50", "text-red-900"],
      };
      statusBox.className = "mt-5 rounded-md border px-4 py-3 text-sm leading-relaxed";
      statusBox.classList.add(...styles[type]);
      statusBox.textContent = text;
      if (extra) statusBox.append(" ", extra);
      statusBox.classList.remove("hidden");
    };

    const setLoading = (loading) => {
      submitBtn.disabled = loading;
      submitBtn.setAttribute("aria-busy", String(loading));
      submitBtn.classList.toggle("opacity-70", loading);
      submitLabel.textContent = loading ? "Sending…" : "Request a consultation";
    };

    const mailtoLink = (data) => {
      const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "-"}\n\n${data.message}`;
      const a = document.createElement("a");
      a.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      a.textContent = "Email us instead";
      a.className = "font-semibold underline underline-offset-4";
      return a;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusBox.classList.add("hidden");

      const results = Object.keys(rules).map((n) => [n, validateField(n)]);
      const firstInvalid = results.find(([, ok]) => !ok);
      if (firstInvalid) {
        fieldFor(firstInvalid[0]).focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());

      // No backend connected: say so honestly, offer a real alternative.
      if (!FORM_ENDPOINT) {
        showStatus(
          "info",
          "Your details look good, but this concept page isn't connected to a form service yet, so nothing has been sent.",
          mailtoLink(data)
        );
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showStatus("success", "Thanks, your message has been sent. The team will be in touch.");
        form.reset();
        counter.textContent = "0 / 500";
      } catch (err) {
        showStatus("error", "Something went wrong and your message wasn't sent.", mailtoLink(data));
      } finally {
        setLoading(false);
      }
    });
  }
})();
