const toggleBtn = document.getElementById("togglePasswordForm");
const form = document.getElementById("perfilPasswordForm");

if (toggleBtn && form) {
    toggleBtn.addEventListener("click", () => {
        form.style.display = "block";   // només mostra el formulari de canvi de contrasenya
        toggleBtn.style.display = "none"; // amaga el botó de toggle.
    });
}


if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const passwordActual =
            document.getElementById("passwordActual").value;

        const passwordNova =
            document.getElementById("passwordNova").value;

        const passwordConfirmar =
            document.getElementById("passwordConfirmar").value;

        const msg =
            document.getElementById("perfilPasswordMsg");
        msg.classList.add("perfil-password-flash");
        msg.innerHTML = "";
        msg.classList.remove("error", "success");
        // msg.className = "";

        // Validacions client

        if (
            !passwordActual ||
            !passwordNova ||
            !passwordConfirmar
        ) {
            msg.textContent = "Tots els camps són obligatoris";
            msg.classList.add("error");
            return;
        }

        if (passwordNova.length < 6) {
            msg.textContent =
                "La contrasenya ha de tenir mínim 6 caràcters";

            msg.classList.add("error");
            return;
        }

        if (passwordNova !== passwordConfirmar) {
            msg.textContent =
                "Les contrasenyes no coincideixen";

            msg.classList.add("error");
            return;
        }

        try {

            const response = await fetch("/perfil/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passwordActual,
                    passwordNova
                })
            });

            const data = await response.json();

            // ERROR DEL BACKEND
            if (!data.ok) {
                msg.textContent = data.message || "Error inesperat";
                msg.classList.add("error");
                return;
            }

            // ÈXIT → REDIRECT (el missatge sortirà a /perfil via flash)
            if (data.redirect) {
                window.location.href = data.redirect;
            }

        } catch (error) {
            showModal({
                type: "error",
                title: "Error",
                message: error.message || "Error inesperat"
            });
        }


    });
}
