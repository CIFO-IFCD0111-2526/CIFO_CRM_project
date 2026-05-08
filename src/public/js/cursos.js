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

// Buscador de cursos amb autocompletar
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("busquedaCurso");
    const dropdown = document.getElementById("dropdownResultados");
    if (input && dropdown) initBuscador(input, dropdown);
});

function initBuscador(input, dropdown) {
    let debounceTimer = null;

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (query.length < 2) {
            cerrarDropdown();
            return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => searchCursos(query), 250);
    });

    async function searchCursos(query) {
        try {
            const res = await fetch(`/cursos/buscar?q=${encodeURIComponent(query)}`, {
                credentials: "include",
            });
            const data = await res.json();
            renderResultados(data);
        } catch (error) {
            console.error("Error en cerca:", error);
        }
    }

    function renderResultados(cursos) {
        dropdown.innerHTML = "";
        if (!cursos.length) {
            dropdown.innerHTML = `<div class="item empty">Sense resultats</div>`;
        } else {
            cursos.forEach((curso) => {
                const item = document.createElement("div");
                item.classList.add("item");
                item.textContent = `${curso.codigo} — ${curso.nombre}`;
                item.addEventListener("click", () => {
                    window.location.href = `/cursos/${curso.id}`;
                });
                dropdown.appendChild(item);
            });
        }
        dropdown.classList.remove("hidden");
    }

    function cerrarDropdown() {
        dropdown.classList.add("hidden");
        dropdown.innerHTML = "";
    }

    input.addEventListener("blur", () => {
        setTimeout(cerrarDropdown, 150);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarDropdown();
            input.blur();
        }
    });
}

// Edició inline de curs (vista detalle)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#cursoForm");
    if (!form || !form.dataset.id) return;

    const cursoMsg = document.querySelector("#cursoMsg");
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

    btnEditar?.addEventListener("click", (e) => {
        e.preventDefault();
        clearMsg();
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        saveSnapshot();
        document.querySelectorAll(".view-mode").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".edit-mode").forEach(el => el.classList.remove("hidden"));
        btnEditar.classList.add("hidden");
    });

    btnCancelar?.addEventListener("click", () => {
        restoreSnapshot();
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        clearMsg();
        document.querySelectorAll(".view-mode").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".edit-mode").forEach(el => el.classList.add("hidden"));
        btnEditar.classList.remove("hidden");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMsg();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.fecha_inicio = data.fecha_inicio || null;
        data.fecha_fin = data.fecha_fin || null;
        data.requisitos = data.requisitos !== "" ? data.requisitos : null;

        const errors = [];
        const nombreInput = form.querySelector('[name="nombre"]');
        const codigoInput = form.querySelector('[name="codigo"]');
        const fechaInicioInput = form.querySelector('[name="fecha_inicio"]');
        const fechaFinInput = form.querySelector('[name="fecha_fin"]');

        if (!data.nombre) {
            errors.push("El nom és obligatori.");
            setError(nombreInput);
        } else {
            clearError(nombreInput);
        }

        if (!data.codigo) {
            errors.push("El codi és obligatori.");
            setError(codigoInput);
        } else {
            clearError(codigoInput);
        }

        if (data.fecha_inicio && data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
            errors.push("La data fi no pot ser anterior a la data inici.");
            setError(fechaInicioInput);
            setError(fechaFinInput);
        }

        if (errors.length > 0) {
            showMsg(errors.join("<br>"));
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        try {
            const res = await fetch(`/cursos/${form.dataset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (submitBtn) submitBtn.disabled = false;

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
            if (submitBtn) submitBtn.disabled = false;
            await window.showModal({
                type: "error",
                title: "Error",
                message: "No s'ha pogut desar el curs.",
            });
        }
    });
});
// Buscador de cursos amb autocompletar
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("busquedaCurso");
    const dropdown = document.getElementById("dropdownResultados");
    if (input && dropdown) initBuscador(input, dropdown);
});

function initBuscador(input, dropdown) {
    let debounceTimer = null;

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (query.length < 2) {
            cerrarDropdown();
            return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => searchCursos(query), 250);
    });

    async function searchCursos(query) {
        try {
            const res = await fetch(`/cursos/buscar?q=${encodeURIComponent(query)}`, {
                credentials: "include",
            });
            const data = await res.json();
            renderResultados(data);
        } catch (error) {
            console.error("Error en cerca:", error);
        }
    }

    function renderResultados(cursos) {
        dropdown.innerHTML = "";
        if (!cursos.length) {
            dropdown.innerHTML = `<div class="item empty">Sense resultats</div>`;
        } else {
            cursos.forEach((curso) => {
                const item = document.createElement("div");
                item.classList.add("item");
                item.textContent = `${curso.codigo} — ${curso.nombre}`;
                item.addEventListener("click", () => {
                    window.location.href = `/cursos/${curso.id}`;
                });
                dropdown.appendChild(item);
            });
        }
        dropdown.classList.remove("hidden");
    }

    function cerrarDropdown() {
        dropdown.classList.add("hidden");
        dropdown.innerHTML = "";
    }

    input.addEventListener("blur", () => {
        setTimeout(cerrarDropdown, 150);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarDropdown();
            input.blur();
        }
    });
}

// Edició inline de curs (vista detalle)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#cursoForm");
    if (!form || !form.dataset.id) return;

    const cursoMsg = document.querySelector("#cursoMsg");
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

    btnEditar?.addEventListener("click", (e) => {
        e.preventDefault();
        clearMsg();
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        saveSnapshot();
        document.querySelectorAll(".view-mode").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".edit-mode").forEach(el => el.classList.remove("hidden"));
        btnEditar.classList.add("hidden");
    });

    btnCancelar?.addEventListener("click", () => {
        restoreSnapshot();
        form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        clearMsg();
        document.querySelectorAll(".view-mode").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".edit-mode").forEach(el => el.classList.add("hidden"));
        btnEditar.classList.remove("hidden");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMsg();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.fecha_inicio = data.fecha_inicio || null;
        data.fecha_fin = data.fecha_fin || null;
        data.requisitos = data.requisitos !== "" ? data.requisitos : null;

        const errors = [];
        const nombreInput = form.querySelector('[name="nombre"]');
        const codigoInput = form.querySelector('[name="codigo"]');
        const fechaInicioInput = form.querySelector('[name="fecha_inicio"]');
        const fechaFinInput = form.querySelector('[name="fecha_fin"]');

        if (!data.nombre) {
            errors.push("El nom és obligatori.");
            setError(nombreInput);
        } else {
            clearError(nombreInput);
        }

        if (!data.codigo) {
            errors.push("El codi és obligatori.");
            setError(codigoInput);
        } else {
            clearError(codigoInput);
        }

        if (data.fecha_inicio && data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
            errors.push("La data fi no pot ser anterior a la data inici.");
            setError(fechaInicioInput);
            setError(fechaFinInput);
        }

        if (errors.length > 0) {
            showMsg(errors.join("<br>"));
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        try {
            const res = await fetch(`/cursos/${form.dataset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (submitBtn) submitBtn.disabled = false;

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
            if (submitBtn) submitBtn.disabled = false;
            await window.showModal({
                type: "error",
                title: "Error",
                message: "No s'ha pogut desar el curs.",
            });
        }
    });
});
// Buscador de cursos amb autocompletar
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("busquedaCurso");
    const dropdown = document.getElementById("dropdownResultados");
    if (input && dropdown) initBuscador(input, dropdown);
});

function initBuscador(input, dropdown) {
    let debounceTimer = null;

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (query.length < 2) {
            cerrarDropdown();
            return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => searchCursos(query), 250);
    });

    async function searchCursos(query) {
        try {
            const res = await fetch(`/cursos/buscar?q=${encodeURIComponent(query)}`, {
                credentials: "include",
            });
            const data = await res.json();
            renderResultados(data);
        } catch (error) {
            console.error("Error en cerca:", error);
        }
    }

    function renderResultados(cursos) {
        dropdown.innerHTML = "";
        if (!cursos.length) {
            dropdown.innerHTML = `<div class="item empty">Sense resultats</div>`;
        } else {
            cursos.forEach((curso) => {
                const item = document.createElement("div");
                item.classList.add("item");
                item.textContent = `${curso.codigo} — ${curso.nombre}`;
                item.addEventListener("click", () => {
                    window.location.href = `/cursos/${curso.id}`;
                });
                dropdown.appendChild(item);
            });
        }
        dropdown.classList.remove("hidden");
    }

    function cerrarDropdown() {
        dropdown.classList.add("hidden");
        dropdown.innerHTML = "";
    }

    input.addEventListener("blur", () => {
        setTimeout(cerrarDropdown, 150);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarDropdown();
            input.blur();
        }
    });
}

//Modo matricular alumno
document.addEventListener("DOMContentLoaded", () => {

    const btnMostrar = document.querySelector("#btnMostrarBuscador");
    const btnCancelar = document.querySelector("#btnCancelarMatricula");
    const box = document.querySelector("#matriculaBox");

    if (btnMostrar && btnCancelar && box) {

        btnMostrar.addEventListener("click", () => {

            box.classList.remove("hidden");
            btnCancelar.classList.remove("hidden");
            btnMostrar.classList.add("hidden");

        });

        btnCancelar.addEventListener("click", () => {

            box.classList.add("hidden");
            btnCancelar.classList.add("hidden");
            btnMostrar.classList.remove("hidden");

        });

    }

    const input = document.querySelector("#busquedaAlumnoCurso");
    const dropdown = document.querySelector("#dropdownAlumnosCurso");

    if (!input || !dropdown) return;

    initBuscadorCurso(input, dropdown, async (alumno) => {

        const ok = await window.showConfirm({
            title: "Inscriure alumne",
            message:
                `Segur que vols inscriure ${alumno.nombre} ${alumno.apellidos}?`,
            confirmText: "Inscriure",
            cancelText: "Cancel·lar",
        });

        if (!ok) return;
        const cursoId = document.querySelector("#cursoForm").dataset.id;

        try {

            const res = await fetch(`/cursos/${cursoId}/alumnos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    alumnoId: alumno.id,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {

                await window.showModal({
                    type: "error",
                    title: "Error",
                    message: json.error || "No s'ha pogut inscriure l'alumne",
                });

                return;

            }


            const ul = document.querySelector("#listaAlumnosCurso");

            const li = document.createElement("li");
            li.classList.add("curso-alumno-item");

            li.innerHTML = `
        <span class="alumno-nombre">
          ${alumno.nombre} ${alumno.apellidos}
        </span>
        <button
          type="button"
          class="btn btn-danger btn-sm btn-desmatricular"
          data-alumno-id="${alumno.id}"
          data-curso-id="${cursoId}"
        >
          Dar de baixa
        </button>
      `;

            ul.appendChild(li);

            input.value = "";
            await window.showModal({
                type: "success",
                title: "Matrícula correcta",
                message: `${alumno.nombre} ${alumno.apellidos} s'ha inscrit correctament al curs.`,
            });
        } catch (err) {

            console.error(err);

            await window.showModal({
                type: "error",
                title: "Error",
                message: "Error de connexió amb el servidor",
            });

        }
    });

});

function initBuscadorCurso(input, dropdown, onSelect) {

    let debounceTimer = null;

    input.addEventListener("input", () => {

        const query = input.value.trim();

        if (query.length < 2) {

            cerrarDropdown();
            return;

        }

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {

            searchAlumnos(query);

        }, 250);

    });

    async function searchAlumnos(query) {

        try {
            console.log("Buscando:", query);
            const res = await fetch(
                `/alumnos/buscar?q=${encodeURIComponent(query)}`,
                {
                    credentials: "include",
                }
            );

            const data = await res.json();
            renderResultados(data);

        } catch (error) {

            console.error("Error en cerca:", error);

        }

    }

    function renderResultados(alumnos) {

        dropdown.innerHTML = "";

        if (!alumnos.length) {

            dropdown.innerHTML = `
        <div class="item empty">
          Sense resultats
        </div>
      `;

        } else {

            alumnos.forEach((alumno) => {

                const item = document.createElement("div");

                item.classList.add("item");

                item.textContent =
                    `${alumno.apellidos}, ${alumno.nombre} — ${alumno.dni}`;

                item.addEventListener("click", () => {

                    cerrarDropdown();

                    if (typeof onSelect === "function") {

                        onSelect(alumno);

                    }

                });

                dropdown.appendChild(item);

            });

        }

        dropdown.classList.remove("hidden");

    }

    function cerrarDropdown() {

        dropdown.classList.add("hidden");
        dropdown.innerHTML = "";

    }

    input.addEventListener("blur", () => {

        setTimeout(cerrarDropdown, 150);

    });

    input.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            cerrarDropdown();
            input.blur();

        }

    });

}
