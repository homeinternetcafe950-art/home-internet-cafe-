/* Quote request form: client-side validation + WhatsApp message build */
(function () {
  "use strict";

  function sanitize(value) {
    // Strip anything that isn't plain text — avoids markup being carried
    // into the constructed message.
    return value.replace(/[<>]/g, "").trim();
  }

  function setError(field, message) {
    var wrapper = field.closest(".form-field");
    var errorEl = wrapper.querySelector(".field-error");
    wrapper.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9+()\s-]{7,15}$/.test(value);
  }

  function validateForm(form) {
    var valid = true;

    var name = form.querySelector("#full-name");
    if (!sanitize(name.value)) {
      setError(name, "Please enter your full name.");
      valid = false;
    } else {
      setError(name, "");
    }

    var whatsapp = form.querySelector("#whatsapp-number");
    if (!isValidPhone(whatsapp.value)) {
      setError(whatsapp, "Please enter a valid WhatsApp number.");
      valid = false;
    } else {
      setError(whatsapp, "");
    }

    var email = form.querySelector("#email-address");
    if (email.value && !isValidEmail(email.value)) {
      setError(email, "Please enter a valid email address.");
      valid = false;
    } else {
      setError(email, "");
    }

    var service = form.querySelector("#service-required");
    if (!service.value) {
      setError(service, "Please select a service.");
      valid = false;
    } else {
      setError(service, "");
    }

    return valid;
  }

  function buildMessage(form) {
    var name = sanitize(form.querySelector("#full-name").value);
    var whatsapp = sanitize(form.querySelector("#whatsapp-number").value);
    var email = sanitize(form.querySelector("#email-address").value);
    var service = sanitize(form.querySelector("#service-required").value);
    var date = sanitize(form.querySelector("#preferred-date").value);
    var details = sanitize(form.querySelector("#additional-details").value);

    var lines = [
      "Hello Home Internet Cafe, I would like to request a quote.",
      "Name: " + name,
      "WhatsApp: " + whatsapp,
    ];
    if (email) lines.push("Email: " + email);
    lines.push("Service required: " + service);
    if (date) lines.push("Preferred date: " + date);
    if (details) lines.push("Additional details: " + details);

    return lines.join("\n");
  }

  function initQuoteForm() {
    var form = document.querySelector("#quote-form");
    if (!form) return;

    var status = form.querySelector(".form-status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm(form)) {
        status.className = "form-status is-error";
        status.textContent =
          "Please fix the highlighted fields and try again.";
        var firstError = form.querySelector(".has-error input, .has-error select");
        if (firstError) firstError.focus();
        return;
      }

      var message = buildMessage(form);
      var link = window.HICWhatsApp
        ? window.HICWhatsApp.buildLink(message)
        : "https://wa.me/27845924683?text=" + encodeURIComponent(message);

      status.className = "form-status is-success";
      status.textContent =
        "Thanks! Opening WhatsApp so you can send your request.";

      window.open(link, "_blank", "noopener,noreferrer");
    });
  }

  document.addEventListener("DOMContentLoaded", initQuoteForm);
})();
