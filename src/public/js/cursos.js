document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#cursoForm");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        data.requisitos = data.requisitos ? parseInt(data.requisitos) : null;
        data.fecha_inicio = data.fecha_inicio || null;
        data.fecha_fin = data.fecha_fin || null;

        //ligera validacion
        if (!data.nombre || !data.codigo) {
            return window.showModal({
                type: "error",
                title: "Error",
                message: "Nom i codi són obligatoris"
            });
        }
        try {
            const res = await fetch("/cursos", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
                throw json;
            }
            await window.showModal({
                type: "success",
                title: "Curs creat",
                message: "El curs s'ha creat correctament.",
            });
            window.location.href = json.redirect;
        } catch (err) {
            const errores = err.errores || ["Error inesperat"];
            await window.showModal({
                type: "error",
                title: "Error",
                message: errores.join("<br>")
            });
        }
    });
});