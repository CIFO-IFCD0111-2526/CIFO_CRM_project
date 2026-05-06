const setError = (input) => {
    if (input) input.classList.add("error");
};

const clearError = (input) => {
    if (input) input.classList.remove("error");
};

// Edició inline d'UF (vista detalle)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#ufForm");
    if (!form || !form.dataset.id) return;

    const btnEditar = document.querySelector("#btnEditar");
    const btnCancelar = document.querySelector("#btnCancelar");

    const SELECTOR = ".edit-mode input, .edit-mode select, .edit-mode textarea, input.edit-mode, select.edit-mode, textarea.edit-mode";

    let snapshot = {};

    const saveSnapshot = () => {
        snapshot = {};
        form.querySelectorAll(SELECTOR).forEach(el => {
            snapshot[el.name] = el.value;
        });
    };

    const restoreSnapshot = () => {
        form.querySelectorAll(SELECTOR).forEach(el => {
            if (el.name in snapshot) el.value = snapshot[el.name];
        });
    };

    btnEditar?.addEventListener("click", (e) => {
        e.preventDefault();
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        saveSnapshot();
        document.querySelectorAll(".view-mode").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".edit-mode").forEach(el => el.classList.remove("hidden"));
        btnEditar.classList.add("hidden");
    });

    btnCancelar?.addEventListener("click", () => {
        restoreSnapshot();
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        document.querySelectorAll(".view-mode").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".edit-mode").forEach(el => el.classList.add("hidden"));
        btnEditar.classList.remove("hidden");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`/ufs/${form.dataset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!json.ok) {
                const msg = json.errores
                    ? Object.values(json.errores).join("\n")
                    : (json.error || "Error desconegut");
                await window.showModal({ type: "error", title: "Error", message: msg });
                return;
            }

            window.location.href = json.redirect;
        } catch (err) {
            await window.showModal({
                type: "error",
                title: "Error",
                message: "No s'ha pogut desar la UF.",
            });
        }
    });
});

// Crear UF (vista form)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#ufForm");
    if (!form || form.dataset.id) return;

    const ufMsg = document.querySelector("#ufMsg");
    const codigo = document.querySelector("#ufCodigo");
    const nombre = document.querySelector("#ufNombre");
    const horas = document.querySelector("#ufHoras");

    const showMsg = (html, isError = true) => {
        if (!ufMsg) return;
        ufMsg.innerHTML = html;
        ufMsg.style.display = "block";
        ufMsg.classList.toggle("error-msg", isError);
    };

    const clearMsg = () => {
        if (!ufMsg) return;
        ufMsg.innerHTML = "";
        ufMsg.style.display = "none";
        ufMsg.classList.remove("error-msg");
    };

    [codigo, nombre, horas].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => clearError(input));
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMsg();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const errors = [];

        if (!data.codigo || data.codigo.trim() === "") {
            errors.push("El codi és obligatori.");
            setError(codigo);
        }

        if (!data.nombre || data.nombre.trim() === "") {
            errors.push("El nom és obligatori.");
            setError(nombre);
        }

        if (data.horas && isNaN(Number(data.horas))) {
            errors.push("Les hores han de ser numèriques.");
            setError(horas);
        }

        if (errors.length > 0) {
            showMsg(errors.join("<br>"));
            return;
        }

        const ufId = form.dataset.id;
        const url = ufId ? `/ufs/${ufId}` : "/ufs";
        const metodo = ufId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!json.ok) {
                if (json.errores) {
                    const msgs = Object.values(json.errores);
                    showMsg(msgs.join("<br>"));
                } else if (json.error) {
                    showMsg(json.error);
                } else {
                    showMsg("Error desconegut");
                }
                return;
            }

            window.location.href = json.redirect;
        } catch (err) {
            await window.showModal({
                type: "error",
                title: "Error",
                message: "No s'ha pogut desar la UF.",
            });
        }
    });
});

// Eliminar UF (delegación global)
document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    const id = btn.dataset.id;
    const row = btn.closest("tr");
    const nombreFromRow = row?.querySelector(".uf-nombre")?.textContent.trim();
    const nombreFromForm = document.querySelector("#ufForm .view-mode")?.textContent.trim();
    const nombre = nombreFromRow || nombreFromForm || "aquesta UF";

    const ok = await window.showConfirm({
        title: "Eliminar UF",
        message: `Segur que vols eliminar ${nombre}? Aquesta acció no es pot desfer.`,
        confirmText: "Eliminar",
        cancelText: "Cancel·lar",
    });

    if (!ok) return;

    try {
        const res = await fetch(`/ufs/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok || !json.ok) { throw new Error("Error eliminant UF"); }
        window.location.href = json.redirect;
    } catch (err) {
        await window.showModal({
            type: "error",
            title: "Error",
            message: "No s'ha pogut eliminar la UF.",
        });
    }
});