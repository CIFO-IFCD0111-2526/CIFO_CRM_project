const setError = (input) => {
    if (input) input.classList.add("error");
};

const clearError = (input) => {
    if (input) input.classList.remove("error");
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#cursoForm");
    if (!form) return;

    const cursoMsg = document.querySelector("#RegCursoMsg");
    const nombre = document.querySelector("#RegCursoNombre");
    const codigo = document.querySelector("#RegCursoCodigo");
    const fechaInicio = document.querySelector("#RegCursoFechaInicio");
    const fechaFin = document.querySelector("#RegCursoFechaFin");

    const showMsg = (html, isError = true) => {
        if (!cursoMsg) return;
        cursoMsg.innerHTML = html;
        cursoMsg.style.display = "block";
        cursoMsg.classList.toggle("error-msg", isError);
    };

    const clearMsg = () => {
        if (!cursoMsg) return;
        cursoMsg.innerHTML = "";
        cursoMsg.style.display = "none";
        cursoMsg.classList.remove("error-msg");
    };

    [nombre, codigo, fechaInicio, fechaFin].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => clearError(input));
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMsg();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.requisitos = data.requisitos ? parseInt(data.requisitos) : null;
        data.fecha_inicio = data.fecha_inicio || null;
        data.fecha_fin = data.fecha_fin || null;

        const errors = [];

        if (!data.nombre) {
            errors.push("El nom és obligatori.");
            setError(nombre);
        }

        if (!data.codigo) {
            errors.push("El codi és obligatori.");
            setError(codigo);
        }

        if (data.fecha_inicio && data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
            errors.push("La data fi no pot ser anterior a la data inici.");
            setError(fechaInicio);
            setError(fechaFin);
        }

        if (errors.length > 0) {
            showMsg(errors.join("<br>"));
            return;
        }

        try {
            const res = await fetch("/cursos", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (!json.ok) {
                if (json.errores) {
                    const msgs = Array.isArray(json.errores)
                        ? json.errores
                        : Object.values(json.errores);
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
                message: "No s'ha pogut desar el curs.",
            });
        }
    });
});

// Eliminar curso

document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    const id = btn.dataset.id;
    const row = btn.closest("tr");
    const nombre = btn.dataset.nombre
        || btn.closest("tr")?.querySelector(".curso-nombre")?.textContent.trim()
        || "aquest curs";

    const ok = await window.showConfirm({
        title: "Confirmar eliminació",
        message: `Segur que vols eliminar ${nombre}? Aquesta acció no es pot desfer.`,
        confirmText: "Eliminar",
        cancelText: "Cancel·lar",
    });

    if (!ok) return;

    try {
        const res = await fetch(`/cursos/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok) { throw new Error("Error eliminant el curs"); }
        window.location.href = json.redirect || "/cursos";
    } catch (err) {
        await window.showModal({
            type: "error",
            title: "Error",
            message: "No s'ha pogut eliminar el curs. Torna-ho a intentar més tard."
        });
    }
});

// Edició inline de curs (vista detalle)
document.addEventListener("DOMContentLoaded", () => {
    const btnEditar = document.querySelector("#btn-curso-editar");
    const btnGuardar = document.querySelector("#btn-curso-guardar");
    const btnCancelar = document.querySelector("#btn-curso-cancelar-edit");
    const formEdit = document.querySelector("#form-editable");
    const formShow = document.querySelector("#form-ple");
    const formCurso = document.querySelector("#form-curso");

    if (!btnEditar || !btnGuardar || !btnCancelar || !formEdit || !formShow || !formCurso) return;

    const inputNombre = document.querySelector("#nom_curs");
    const inputCodigo = document.querySelector("#codi_curs");
    const inputFechaInicio = document.querySelector("#data_inici");
    const inputFechaFin = document.querySelector("#fi_curs");
    const selectRequisitos = document.querySelector("#RegCursoRequisitos");

    btnEditar.addEventListener("click", (e) => {
        e.preventDefault();
        btnGuardar.classList.remove("hidden");
        btnCancelar.classList.remove("hidden");
        formEdit.classList.remove("hidden");
        formShow.classList.add("hidden");
        btnEditar.classList.add("hidden");
    });

    btnCancelar.addEventListener("click", () => {
        btnGuardar.classList.add("hidden");
        btnCancelar.classList.add("hidden");
        formEdit.classList.add("hidden");
        formShow.classList.remove("hidden");
        btnEditar.classList.remove("hidden");
    });

    btnGuardar.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = btnGuardar.dataset.id;

        // El backend espera estos nombres exactos (campos del modelo Curso)
        const data = {
            codigo: inputCodigo?.value || "",
            nombre: inputNombre?.value || "",
            fecha_inicio: inputFechaInicio?.value || null,
            fecha_fin: inputFechaFin?.value || null,
            requisitos: selectRequisitos?.value || null,
        };

        try {
            const res = await fetch(`/cursos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (!json.ok) {
                const msg = json.errores
                    ? (Array.isArray(json.errores) ? json.errores.join("\n") : Object.values(json.errores).join("\n"))
                    : (json.error || "Error desconegut");
                await window.showModal({ type: "error", title: "Error", message: msg });
                return;
            }

            window.location.href = json.redirect;
        } catch (err) {
            await window.showModal({
                type: "error",
                title: "Error",
                message: "No s'ha pogut desar el curs.",
            });
        }
    });
});
