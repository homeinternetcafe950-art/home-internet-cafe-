/* WhatsApp link generation — builds wa.me links with pre-filled messages */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "27845924683"; // international format, no plus/spaces

  function buildWhatsAppLink(message) {
    var base = "https://wa.me/" + WHATSAPP_NUMBER;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  // Expose a small API for other scripts (e.g. quote.js) to reuse
  window.HICWhatsApp = {
    buildLink: buildWhatsAppLink,
    number: WHATSAPP_NUMBER,
  };

  function wireStaticButtons() {
    // Any element with [data-wa-message] gets its href built on load
    document.querySelectorAll("[data-wa-message]").forEach(function (el) {
      var message = el.getAttribute("data-wa-message");
      el.setAttribute("href", buildWhatsAppLink(message));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // Service "Book This Service" buttons carry [data-service-name]
    document.querySelectorAll("[data-service-name]").forEach(function (el) {
      var serviceName = el.getAttribute("data-service-name");
      var message =
        "Hello Home Internet Cafe, I would like to book the " +
        serviceName +
        " service. Please let me know your availability.";
      el.setAttribute("href", buildWhatsAppLink(message));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  document.addEventListener("DOMContentLoaded", wireStaticButtons);
})();
