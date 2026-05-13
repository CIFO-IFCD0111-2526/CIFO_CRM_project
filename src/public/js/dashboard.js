const setError = (input) => {
    input.classList.add("error");
};

const clearError = (input) => {
    input.classList.remove("error");
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#anotacionForm");
    if (!form) return;

    const textarea = form.querySelector("textarea");
    const anotacionMsg = document.querySelector("#anotacionMsg");

    const showMsg = (html, isError = true) => {
        anotacionMsg.innerHTML = html;
        anotacionMsg.style.display = "block";
        anotacionMsg.classList.toggle("error-msg", isError);
    };

    const clearMsg = () => {
        anotacionMsg.innerHTML = "";
        anotacionMsg.style.display = "none";
        anotacionMsg.classList.remove("error-msg");
    };

    textarea.addEventListener("input", () => {
        clearError(textarea);
        clearMsg();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const contenido = form.contenido.value.trim();

        if (!contenido) {
            showMsg("El contingut és obligatori.");
            setError(textarea);
            return;
        }

        try {
            const res = await fetch("/anotaciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contenido }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                showMsg(data.error || "Error al crear l'anotació");
                setError(textarea);
                return;
            }

            window.location.href = data.redirect;

        } catch (error) {
            console.error(error);
        /*  window.location.href = data.redirect;
        } catch (error) { */
            window.showModal?.({
                type: "error",
                title: "Error",
                message: "Error de connexió amb el servidor",
            });
        }
    });
textarea.addEventListener("input", () => {
        clearError(textarea);
        clearMsg();
    });
});