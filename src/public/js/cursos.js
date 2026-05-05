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
        cancelText: "Cancelar",
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

// editar curso 
    // seleccionem els botons 
    const btnEditar     = document.querySelector("#btn-curso-editar");                 
    const btnGuardar    = document.querySelector("#btn-curso-guardar");
    const btnCancelar   = document.querySelector("#btn-curso-cancelar-edit");
    const formEdit      = document.querySelector("#form-editable");
    const formShow      = document.querySelector("#form-ple");
    const reqSelect     = document.querySelector("#RegCursoRequisitos");

btnEditar.addEventListener("click", async (e) => {

        btnGuardar  .classList.remove("hidden");    // fem visible el de guardar 
        btnCancelar .classList.remove("hidden");    // fem visible el de cancelar edició
        formEdit    .classList.remove("hidden");    // fem visible el formulari editable

        formShow    .classList.add("hidden");       // amaguem el que mostrava la info
        btnEditar   .classList.add("hidden");       // ja estem editant, no cal mostrar-lo    
});

btnGuardar.addEventListener("click", async (e) => { 
// logica de trucada a DB per updatejar les dades del curs


});


btnCancelar.addEventListener("click", async (e) => { 
// logica de retorn al curs sense guardar canvis
        btnGuardar  .classList.add("hidden");    // fem visible el de guardar 
        btnCancelar .classList.add("hidden");    // fem visible el de cancelar edició
        formEdit    .classList.add("hidden");    // fem visible el formulari editable

        formShow    .classList.remove("hidden");       // amaguem el que mostrava la info
        btnEditar   .classList.remove("hidden");       // ja estem editant, no cal mostrar-lo
});