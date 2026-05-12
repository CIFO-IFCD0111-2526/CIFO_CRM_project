document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#anotacionForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const contenido = form.contenido.value.trim();

        try {
            const res = await fetch("/anotaciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contenido }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                return window.showModal({
                    type: "error",
                    title: "Error",
                    message: data.error || "Error al crear l'anotació",
                });
            }

            window.location.href = data.redirect;
        } catch (error) {
            window.showModal({
                type: "error",
                title: "Error",
                message: "Error de connexió amb el servidor",
            });
        }
    });
});
