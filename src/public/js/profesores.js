const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const setError = (input) => {
  if (input) input.classList.add("error");
};

const clearError = (input) => {
  if (input) input.classList.remove("error");
};

// Crear/editar profesor (vista form)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#profesorForm");
  if (!form) return;

  const profesorMsg = document.querySelector("#profesorMsg");
  const nombre = document.querySelector("#profesorNombre");
  const apellidos = document.querySelector("#profesorApellidos");
  const telefono = document.querySelector("#profesorTelefono");
  const email = document.querySelector("#profesorEmail");

  const showMsg = (html, isError = true) => {
    profesorMsg.innerHTML = html;
    profesorMsg.style.display = "block";
    profesorMsg.classList.toggle("error-msg", isError);
  };

  const clearMsg = () => {
    profesorMsg.innerHTML = "";
    profesorMsg.style.display = "none";
    profesorMsg.classList.remove("error-msg");
  };


  [nombre, apellidos, email].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => clearError(input));
  });

  const profesorId = form.dataset.id;
  const metodo = profesorId ? "PUT" : "POST";
  const url = profesorId ? `/profesores/${profesorId}` : "/profesores";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const errors = [];

    if (!data.nombre) {
      errors.push("El nom és obligatori.");
      setError(nombre);
    }

    if (!data.apellidos) {
      errors.push("Els cognoms són obligatoris.");
      setError(apellidos);
    }

    if (!data.email) {
      errors.push("L'email és obligatori.");
      setError(email);
    } else if (!isValidEmail(data.email)) {
      errors.push("El format de l'email no és vàlid.");
      setError(email);
    }

    if (errors.length > 0) {
      showMsg(errors.join("<br>"));
      return;
    }

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!json.ok) {
      showMsg(json.error);
      return;
    }

    window.location.href = json.redirect;
  });
});

// Eliminar profesor (delegación global)
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-eliminar");
  if (!btn) return;

  const id = btn.dataset.id;
  const row = btn.closest("tr");
  const nombre = row?.querySelector(".profesor-nombre")?.textContent.trim() || "aquest professor";

  const ok = await window.showConfirm({
    title: "Eliminar professor",
    message: `Segur que vols eliminar ${nombre}? Aquesta acció no es pot desfer.`,
    confirmText: "Eliminar",
    cancelText: "Cancel·lar",
  });

  if (!ok) return;

  try {
    const res = await fetch(`/profesores/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.ok) { throw new Error("Error eliminant professor"); }
    window.location.href = json.redirect || "/profesores";
  } catch (err) {
    await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut eliminar el professor.",
    });
  }
});

// Buscador d'profesores amb autocompletar
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("busquedaProfesor");
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
    debounceTimer = setTimeout(() => searchProfesores(query), 250);
  });

  async function searchProfesores(query) {
    try {
      const res = await fetch(`/profesores/buscar?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await res.json();
      renderResultados(data);
    } catch (error) {
      console.error("Error en cerca:", error);
    }
  }

  function renderResultados(profesores) {
    dropdown.innerHTML = "";
    if (!profesores.length) {
      dropdown.innerHTML = `<div class="item empty">Sense resultats</div>`;
    } else {
      profesores.forEach((profesor) => {
        const item = document.createElement("div");
        item.classList.add("item");
        item.textContent = `${profesor.apellidos}, ${profesor.nombre} — ${profesor.email}`;
        item.addEventListener("click", () => {
          window.location.href = `/profesores/${profesor.id}`;
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