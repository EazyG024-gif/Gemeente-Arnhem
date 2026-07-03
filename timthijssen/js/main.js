/* Tim Thijssen — minimale, dependency-vrije interactie */
(function () {
  "use strict";

  /* Mobiel menu */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Sluit menu na klik op een link (anchor-navigatie)
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Contactformulier: opent een vooringevulde e-mail.
     Sluit desgewenst een formdienst (bijv. Formspree) aan door
     het action-attribuut te vullen en dit blok te verwijderen. */
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var voorkeur =
        data.get("voorkeur") === "terugbellen"
          ? "Bel mij binnen 24 uur terug"
          : "Ik wil een vrijblijvend adviesgesprek";

      var body = [
        "Naam: " + (data.get("naam") || ""),
        "Organisatie: " + (data.get("organisatie") || "-"),
        "E-mail: " + (data.get("email") || ""),
        "Telefoon: " + (data.get("telefoon") || "-"),
        "Voorkeur: " + voorkeur,
        "",
        "Situatie:",
        data.get("bericht") || "-"
      ].join("\n");

      var mailto =
        "mailto:info@timthijssen.nl" +
        "?subject=" + encodeURIComponent("Aanvraag adviesgesprek via timthijssen.nl") +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent =
          "Uw e-mailprogramma wordt geopend. Lukt dat niet? Mail dan direct naar info@timthijssen.nl of bel 06 19 83 10 32.";
      }
    });
  }

  /* Jaartal in footer */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
