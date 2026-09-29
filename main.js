/* Main site behaviours: scroll reveal, back-to-top, FAQ accordion, filters */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 480);
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    var questions = document.querySelectorAll(".faq-question");
    if (!questions.length) return;

    questions.forEach(function (btn) {
      var answer = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";

        // Close all others (single-open accordion)
        questions.forEach(function (other) {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            var otherAnswer = document.getElementById(
              other.getAttribute("aria-controls")
            );
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        btn.setAttribute("aria-expanded", String(!isOpen));
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.style.maxHeight = null;
        }
      });
    });
  }

  /* ---------- Service filter tabs (services.html) ---------- */
  function initFilterTabs() {
    var tabs = document.querySelectorAll(".filter-tab");
    if (!tabs.length) return;

    var groups = document.querySelectorAll("[data-service-group]");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        var target = tab.getAttribute("data-filter");

        groups.forEach(function (group) {
          var show = target === "all" || group.getAttribute("data-service-group") === target;
          group.hidden = !show;
        });
      });
    });
  }

  /* ---------- Footer year ---------- */
  function setFooterYear() {
    var el = document.querySelector("#footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initBackToTop();
    initFaqAccordion();
    initFilterTabs();
    setFooterYear();
  });
})();
