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

// editar curso  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // seleccionem els botons 
    const btnEditar     = document.querySelector("#btn-curso-editar");                 
    const btnGuardar    = document.querySelector("#btn-curso-guardar");
    const btnCancelar   = document.querySelector("#btn-curso-cancelar-edit");
    const formEdit      = document.querySelector("#form-editable");
    const formShow      = document.querySelector("#form-ple");
    const reqSelect     = document.querySelector("#RegCursoRequisitos");
// DATOS DEL FORM //
const curs_codi = document.querySelector("#codi_curs");
const curs_requisits = document.querySelector("#RegCursoRequisitos");
const curs_inici = document.querySelector("#data_inici ");
const curs_final = document.querySelector("#fi_curs");


    
//console.log(params);
   // const id            = btn.dataset.id; // per saber el id del curs
if (btnEditar ) { 
    btnEditar.addEventListener("click", async (e) => {

        btnGuardar  .classList.remove("hidden");    // fem visible el de guardar 
        btnCancelar .classList.remove("hidden");    // fem visible el de cancelar edició
        formEdit    .classList.remove("hidden");    // fem visible el formulari editable

        formShow    .classList.add("hidden");       // amaguem el que mostrava la info
        btnEditar   .classList.add("hidden");       // ja estem editant, no cal mostrar-lo    
    });
};

if (btnGuardar ) { 
    btnGuardar.addEventListener("click", async (e) => { 
// logica de trucada a DB per updatejar les dades del curs
//console.log(req.params.id);
    const id = btnGuardar.dataset.id;
    const data_curso = {
      codi: curs_codi.value,
      data_inici: curs_inici.value,
      data_fi: curs_final.value,
      requisits: curs_requisits.value,
    };

    try {    
 console.log(data_curso);
 
    const res = await fetch(`/cursos/${id}`, { 
            method: "PUT" ,
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify(data_curso)
            // body : data_curso
        });
    console.log("PUT_RESPONSE: ",res, "_______");
        
    } catch (error) {
        console.log("ERR:: ", error);
    }  

    });
} ;
if (btnCancelar) { 
    btnCancelar.addEventListener("click", async (e) => { 
    // logica de retorn al curs sense guardar canvis, tornem a mostrar l'anterior que ja era ple de les dades correctes
            btnGuardar  .classList.add("hidden");    // fem invisible el de guardar 
            btnCancelar .classList.add("hidden");    // fem invisible el de cancelar edició
            formEdit    .classList.add("hidden");    // fem invisible el formulari editable

            formShow    .classList.remove("hidden"); // mostrem el que mostrava la info
            btnEditar   .classList.remove("hidden"); // ja no estem editant, cal mostrar-lo altre cop
    });
};

/*
const nuevoCurso = await Curso.create({
            codigo,
            nombre,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null,
            requisitos: requisitos || null
        });

        req.session.flash = {
            type: "success",
            title: "Curs creat",
            message: `El curs ${nuevoCurso.nombre} s'ha creat correctament.`,
        };
*/
