const form = document.getElementById("perfilPasswordForm");

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

        msg.innerHTML = "";
        msg.className = "";

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

            if (!response.ok) {
                throw new Error(data.message);
            }

            if (data.redirect) {
                window.location.href = data.redirect;
            }

        } catch (error) {

            msg.textContent =
                error.message || "Error inesperat";

            msg.classList.add("error");
        }
    });
}