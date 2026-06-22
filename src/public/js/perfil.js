const form = document.getElementById("perfilPasswordForm");
const msg = document.getElementById("perfilPasswordMsg");

const showMsg = (text, isError = true) => {
    if (!msg) return;
    msg.textContent = text;
    msg.style.display = "block";
    msg.classList.toggle("error-msg", isError);
};

const clearMsg = () => {
    if (!msg) return;
    msg.textContent = "";
    msg.style.display = "none";
    msg.classList.remove("error-msg");
};

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const passwordActual = document.getElementById("passwordActual").value;
    const passwordNova = document.getElementById("passwordNova").value;
    const passwordConfirmar = document.getElementById("passwordConfirmar").value;

    if (!passwordActual || !passwordNova || !passwordConfirmar) {
        return showMsg("Tots els camps són obligatoris.");
    }

    if (passwordNova.length < 6) {
        return showMsg("La contrasenya nova ha de tenir mínim 6 caràcters.");
    }

    if (passwordNova !== passwordConfirmar) {
        return showMsg("Les contrasenyes no coincideixen.");
    }

    window.showLoader();
    try {
        const res = await fetch("/perfil/password", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ passwordActual, passwordNova }),
        });
        const json = await res.json();

        if (!json.ok) {
            return showMsg(json.error || "Error desconegut");
        }

        window.location.href = json.redirect;
    } catch (err) {
        await window.showModal({
            type: "error",
            title: "Error",
            message: "No s'ha pogut canviar la contrasenya.",
        });
    } finally {
        window.hideLoader();
    }
});
