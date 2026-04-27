document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#alumnoForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.derechos_imagen = form.querySelector('[name="derechos_imagen"]')?.checked || false;
    data.cesion_material = form.querySelector('[name="cesion_material"]')?.checked || false;

    const res = await fetch("/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!json.ok) {
      console.log("Errors rebuts del backend:", json.errores);
      document.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));
      for (const camp in json.errores) {
        const span = document.querySelector(`#error-${camp}`);
        if (span) span.textContent = json.errores[camp];
      }
      return;
    }

    window.location.href = json.redirect;
  });
});

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-eliminar");
  if (!btn) return;

  const id = btn.dataset.id;
  const row = btn.closest("tr");
  const nombre = row?.querySelector(".alumno-nombre")?.textContent.trim() || "aquest alumne";

  const ok = await window.showConfirm({
    title: "Eliminar alumne",
    message: `Segur que vols eliminar ${nombre}? Aquesta acció no es pot desfer.`,
    confirmText: "Eliminar",
    cancelText: "Cancel·lar",
  });

  if (!ok) return;

  try {
    const res = await fetch(`/alumnos/${id}`, { method: "DELETE" });
    if (!res.ok) { throw new Error("Error eliminanta alumne"); }
    await window.showModal({
      type: "success",
      title: "Alumne eliminat",
      message: "L'alumne s'ha eliminat correctament.",
    });
    await new Promise(r => setTimeout(r, 1000));
    window.location.href = "/alumnos";
  } catch (err) {
   await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut eliminar l'alumne.",
    });
  }
});


const input = document.getElementById("busquedaAlumno");
const dropdown = document.getElementById("dropdownResultados");

let debounceTimer = null;

input.addEventListener("input", () => {
  const query = input.value.trim();

 
  if (query.length < 2) {
    cerrarDropdown();
    return;
  }

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    buscarAlumnos(query);
  }, 250);
});

async function buscarAlumnos(query) {
  try {
    const res = await fetch(`/alumnos/buscar?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    renderResultados(data);
  } catch (error) {
    console.error("Error en búsqueda:", error);
  }
}

function renderResultados(alumnos) {
  dropdown.innerHTML = "";

  if (!alumnos.length) {
    dropdown.innerHTML = `<div class="item empty">Sense resultats</div>`;
  } else {
    alumnos.forEach((alumno) => {
      const item = document.createElement("div");
      item.classList.add("item");

      item.textContent = `${alumno.apellidos}, ${alumno.nombre} — ${alumno.dni}`;

      item.addEventListener("click", () => {
        window.location.href = `/alumnos/${alumno.id}`;
      });

      dropdown.appendChild(item);
    });
  }

  abrirDropdown();
}

function abrirDropdown() {
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