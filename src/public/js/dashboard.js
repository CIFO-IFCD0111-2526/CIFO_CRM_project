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

            const data = await res.json();

            if (!res.ok || !data.ok) {
                showMsg(data.error || "No s'ha pogut desar l'anotació");
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
            const text = item.querySelector(".anotacion-texto").textContent.trim();

            textarea.value = text;
            textarea.focus();
            form.dataset.editingId = id;
            document.querySelector("#btnAfegirAnotacio").textContent = "Guardar canvis";
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", async e => {
            const item = e.target.closest(".anotacion-item");
            const id = item.dataset.id;

            const ok = await window.showConfirm({
                title: "Eliminar anotació",
                message: "Segur que vols eliminar aquesta anotació?",
                confirmText: "Eliminar",
                cancelText: "Cancel·lar",
            });

            if (ok !== true) return;

            try {
                const res = await fetch(`/anotaciones/${id}`, { method: "DELETE" });
                const data = await res.json();

                if (!res.ok || !data.ok) {
                    throw new Error(data.error || "No s'ha pogut eliminar l'anotació");
                }

                location.reload();
            } catch (error) {
                await window.showModal({
                    type: "error",
                    title: "Error",
                    message: "No s'ha pogut eliminar l'anotació",
                });
            }
        });
    });
});
