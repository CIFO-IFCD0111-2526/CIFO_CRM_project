const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const setError = (input) => {
  input.classList.add("error");
};

const clearError = (input) => {
  input.classList.remove("error");
};

const validacion = (input) => {
  const errors = [];
    // ADAPTAR A FUNCIONALIDAD ACTUAL
  if (!email) {
    errors.push("El email és obligatori.");
    setError(emailInput);
  } else if (!isValidEmail(email)) {
    errors.push("El format de l'email no és vàlid.");
    setError(emailInput);
  }

  if (!password) {
    errors.push("La contraseña és obligatòria.");
    setError(passwordInput);
  } else if (password.length < 6) {
    errors.push("La contraseña deu tenir al menys 6 caràcters.");
    setError(passwordInput);
  }

  if (errors.length > 0) {
    showMsg(errors.join("<br>"));
    return;
  }
};

document.addEventListener("DOMContentLoaded", () => {
    // Agafem el formulari de la pàgina
    console.log(setError);
    const form = document.querySelector("#alumnoForm");
    const RegAlNombre = document.querySelector("#RegAlNombre");
    const RegAlApellidos = document.querySelector("#RegAlApellidos");
    const RegAlDni = document.querySelector("#RegAlDni");
    const RegAlEmail = document.querySelector("#RegAlEmail");
    const RegAltipo = document.querySelector("#RegAltipo");

    if (sessionStorage.getItem("alumnoCreado")){
        sessionStorage.removeItem("alumnoCreado");   
        window.showModal?.({
            type: "success",
            title: "Alumne creat",
            message: "Has creat l'alumne correctament.",
        });
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();        

        // Convertim el formulari en un objecte JS
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        //Preparem els checkboxes per ser activats

        data.derechos_imagen = form.querySelector('[name="derechos_imagen"]')?.checked || false;
        data.cesion_material = form.querySelector('[name="cesion_material"]')?.checked || false;

        // Enviem al backend
        const res = await fetch("/alumnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        // Si hi ha errors → mostrar-los
        if (!json.ok) {
            console.log("Errors rebuts del backend:", json.errores);

            // Netejar errors anteriors
            document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");

            // Mostrar errors nous
            for (const camp in json.errores) {
                const span = document.querySelector(`#error-${camp}`);
                if (span) span.textContent = json.errores[camp];
            }

            return;
        }

        // Si tot va bé → redirigir a /alumnos/:id

        sessionStorage.setItem("alumnoCreado", true);
        window.location.href = json.redirect;
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
    if (!res.ok) throw new Error("Error al eliminar");
    row?.remove();
    window.showModal({
      type: "success",
      title: "Alumne eliminat",
      message: "L'alumne s'ha eliminat correctament.",
    });
  } catch (err) {
    window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut eliminar l'alumne.",
    });
  }
});
