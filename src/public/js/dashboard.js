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

        const editingId = form.dataset.editingId;
        const url = editingId ? `/anotaciones/${editingId}` : "/anotaciones";
        const method = editingId ? "PUT" : "POST";
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contenido }),
            });

            // try {
            //     const res = await fetch("/anotaciones", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({ contenido }),
            //     });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                showMsg(data.error || "Error al crear l'anotació");
                setError(textarea);
                return;
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

    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", e => {
            const item = e.target.closest(".anotacion-item");
            const id = item.dataset.id;
            const text = item.querySelector(".anotacio-text").textContent.trim();

            // Posem el text al textarea principal
            textarea.value = text;
            textarea.focus();

            // Guardem l'ID que s'està editant
            form.dataset.editingId = id;

            // Canviem el text del botó
            document.querySelector("#btnAfegirAnotacio").textContent = "Guardar canvis";
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async e => {
            const item = e.target.closest(".anotacion-item");
            const id = item.dataset.id;

            if (!confirm("Vols eliminar aquesta anotació?")) return;

            const res = await fetch(`/anotaciones/${id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.ok) {
                location.reload();
            } else {
                showMsg("No s'ha pogut eliminar l'anotació.");
            }
        });
    });
});



