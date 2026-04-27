document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#alumnoForm");
  if (!form) return;

  // --Editar--

  const btnEditar = document.querySelector(".btn-secundario");
  btnEditar?.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".view-mode").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".edit-mode").forEach(el => el.classList.remove("hidden"));
  });

  // -- Lógica para Cancelar (Opcional pero recomendada) --
  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar?.addEventListener("click", () => {
    document.querySelectorAll(".view-mode").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".edit-mode").forEach(el => el.classList.add("hidden"));
  });

  // -- SUBMIT (POST o PUT) --

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.derechos_imagen = form.querySelector('[name="derechos_imagen"]')?.checked || false;
    data.cesion_material = form.querySelector('[name="cesion_material"]')?.checked || false;

    const id = document.querySelector(".btn-eliminar")?.dataset.id;

    // Si hay ID, usamos PUT a /alumnos/:id. Si no, POST a /alumnos
    const url = id ? `/alumnos/${id}` : "/alumnos";
    const metodo = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      submitBtn.disabled = false;

      const json = await res.json();

      if (!json.ok) {
        // Tu lógica original de mostrar errores
        console.log("Errors rebuts del backend:", json.errores || json.mensaje);
        document.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));

        if (json.errores) {
          for (const camp in json.errores) {
            const span = document.querySelector(`#error-${camp}`);
            if (span) span.textContent = json.errores[camp];
          }
        } else if (json.mensaje) {
          alert(json.mensaje); // Para errores genéricos como el DNI duplicado
        }
        return;
      }
      window.location.href = json.redirect;

    } catch (err) {
      console.error("Error en la petició:", err);
    }
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




