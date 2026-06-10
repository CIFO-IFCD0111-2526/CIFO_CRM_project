/* =====================================================================
   responsive.js
   ---------------------------------------------------------------------
   Controla el menú lateral (sidebar) en pantalles petites (mòbil/tauleta).

   En escriptori el sidebar sempre és visible. En mòbil queda amagat fora
   de la pantalla i s'obre amb el botó hamburguesa de la topbar.

   Aquest fitxer s'encarrega NOMÉS del comportament (obrir/tancar).
   L'aparença i quan apareix el botó es defineixen a responsive.css.

   Elements que fa servir (definits a layout.ejs):
     #navToggle  → botó hamburguesa de la topbar
     #mainNav    → el <nav> lateral
     #navOverlay → capa fosca que tapa el contingut quan el menú està obert
   ===================================================================== */

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navOverlay = document.getElementById("navOverlay");

// Només activem la lògica si existeixen els elements (no hi són a login/registre).
if (navToggle && mainNav && navOverlay) {

    // Obre el menú: afegeix la classe .is-open al nav i a l'overlay.
    const obrirMenu = () => {
        mainNav.classList.add("is-open");
        navOverlay.classList.add("is-open");
        navToggle.setAttribute("aria-expanded", "true");
    };

    // Tanca el menú: treu la classe .is-open dels dos.
    const tancarMenu = () => {
        mainNav.classList.remove("is-open");
        navOverlay.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    };

    // El botó hamburguesa fa toggle: si està obert tanca, si no obre.
    navToggle.addEventListener("click", () => {
        if (mainNav.classList.contains("is-open")) {
            tancarMenu();
        } else {
            obrirMenu();
        }
    });

    // Clic a la capa fosca → tanca el menú.
    navOverlay.addEventListener("click", tancarMenu);

    // Tecla Escape → tanca el menú.
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") tancarMenu();
    });
}
