const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const setError = (input) => {
  input.classList.add("error");
};

const clearError = (input) => {
  input.classList.remove("error");
};

document.addEventListener("DOMContentLoaded", () => {    

    const RegAlalumnoMsg = document.querySelector("#RegAlalumnoMsg");

    const showMsg = (html, isError = true) => {
      RegAlalumnoMsg.innerHTML = html;
      RegAlalumnoMsg.style.display = "block";
      RegAlalumnoMsg.classList.toggle("error-msg", isError);
    };

    const clearMsg = () => {
      RegAlalumnoMsg.innerHTML = "";
      RegAlalumnoMsg.style.display = "none";
      RegAlalumnoMsg.classList.remove("error-msg");
    };

    // Agafem el formulari de la pàgina
    
    const form = document.querySelector("#alumnoForm");
    const RegAlNombre = document.querySelector("#RegAlNombre");
    const RegAlApellidos = document.querySelector("#RegAlApellidos");
    const RegAlDni = document.querySelector("#RegAlDni");
    const RegAlEmail = document.querySelector("#RegAlEmail");
    const RegAltipo = document.querySelector("#RegAltipo");

    // Netejem els errors de la pàgina    

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
        
       [RegAlNombre, RegAlApellidos, RegAlDni, RegAlEmail, RegAltipo].forEach(
         (input) => {
           input.addEventListener("input", () => {
             clearError(input);
           });
         },
       );
        
        // Convertim el formulari en un objecte JS
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        //Preparem els checkboxes per ser activats, canviem el valor a true/false

    const json = await res.json();

        const errors = [];
        // ADAPTAR A FUNCIONALIDAD ACTUAL

        if (!data.nombre) {
          errors.push("El nom és obligatori.");
          setError(RegAlNombre);
        }

        if (!data.apellidos) {
          errors.push("Un cognom és obligatori.");
          setError(RegAlApellidos);
        }

        if (!data.dni) {
          errors.push("El DNI o NIE és obligatori");
          setError(RegAlDni);
        } else if (data.dni.length < 9) {
          errors.push("Format incorrecte (DNI: 12345679A. NIE: Y1234567Z)");
          setError(passwordInput);
        }

        if (!data.email) {
          errors.push("El email és obligatori.");
          setError(RegAlEmail);
        } else if (!isValidEmail(data.email)) {
          errors.push("El format de l'email no és vàlid.");
          setError(RegAlEmail);
        }
        
        if (!data.tipo) {
          errors.push("És obligatori escollir un tipus.");
          setError(RegAltipo);
        }

        if (errors.length > 0) {
          showMsg(errors.join("<br>"));
          return;
        }

        // Enviem al backend
        const res = await fetch("/alumnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    
    if (!ok) return;

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
