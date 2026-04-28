/**
 * Validar DNI (NIF), CIF, NIE en JavaScript
 *
 * @param {string} dni Número de identificación
 * @returns {boolean} true si es válido, false en caso contrario
 */
function validDniCifNie(dni) {
  dni = dni.toUpperCase(); // Normalizar a mayúsculas
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

  // Validación formato general
  if (!/^[A-Z0-9]{9}$/.test(dni)) {
    return false;
  }

  // NIF estándar (8 números + 1 letra)
  if (/^[0-9]{8}[A-Z]$/.test(dni)) {
    const numero = parseInt(dni.slice(0, 8), 10);
    const letra = dni[8];
    return letra === letras[numero % 23];
  }

  // NIE (X, Y, Z seguido de 7 números y una letra)
  if (/^[XYZ][0-9]{7}[A-Z]$/.test(dni)) {
    const reemplazo = { X: "0", Y: "1", Z: "2" };
    const numero = reemplazo[dni[0]] + dni.slice(1, 8);
    const letra = dni[8];
    return letra === letras[parseInt(numero, 10) % 23];
  }

  // CIF (letra + 7 números + letra/número)
  if (/^[ABCDEFGHJNPQRSUVW][0-9]{7}[A-Z0-9]$/.test(dni)) {
    let sumaPar = 0;
    let sumaImpar = 0;

    for (let i = 1; i <= 6; i += 2) {
      sumaPar += parseInt(dni[i], 10);
    }

    for (let i = 0; i <= 6; i += 2) {
      let doble = parseInt(dni[i], 10) * 2;
      sumaImpar += doble > 9 ? doble - 9 : doble;
    }

    const sumaTotal = sumaPar + sumaImpar;
    const control = (10 - (sumaTotal % 10)) % 10;
    const controlEsperado = dni[8];

    if (/[A-Z]/.test(controlEsperado)) {
      return controlEsperado === String.fromCharCode(64 + control); // Letra
    } else {
      return parseInt(controlEsperado, 10) === control; // Número
    }
  }

  // NIE especial (T seguido de 8 dígitos)
  if (/^T[0-9]{8}$/.test(dni)) {
    return true;
  }

  return false;
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const setError = (input) => {
  input.classList.add("error");
};

const clearError = (input) => {
  input.classList.remove("error");
};

// INICIO DE LÓGICA DE LA PÁGINA

document.addEventListener("DOMContentLoaded", () => {

  const RegAlalumnoMsg = document.querySelector("#RegAlalumnoMsg");
  if (!RegAlalumnoMsg) return;

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
  if (!form) return;
  const RegAlNombre = document.querySelector("#RegAlNombre");
  const RegAlApellidos = document.querySelector("#RegAlApellidos");
  const RegAlDni = document.querySelector("#RegAlDni");
  const RegAlTelefono = document.querySelector("#RegAlTelefono");
  const RegAlEmail = document.querySelector("#RegAlEmail");
  const RegAltipo = document.querySelector("#RegAltipo");

  // Netejem els errors de la pàgina

  if (sessionStorage.getItem("alumnoCreado")) {
    sessionStorage.removeItem("alumnoCreado");
    window.showModal?.({
      type: "success",
      title: "Alumne creat",
      message: "Has creat l'alumne correctament.",
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpiamos los errores.
    [
      RegAlNombre,
      RegAlApellidos,
      RegAlDni,
      RegAlTelefono,
      RegAlEmail,
      RegAltipo,
    ].forEach((input) => {
      input.addEventListener("input", () => {
        clearError(input);
      });
    });

    clearMsg();

    // Convertim el formulari en un objecte JS
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    //Preparem els checkboxes per ser activats, canviem el valor a true/false

    data.derechos_imagen =
      form.querySelector('[name="derechos_imagen"]')?.checked || false;
    data.cesion_material =
      form.querySelector('[name="cesion_material"]')?.checked || false;

    const errors = [];

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
    } else if (!validDniCifNie(data.dni)) {
      errors.push("Format incorrecte (DNI: 12345679A. NIE: Y1234567Z)");
      setError(RegAlDni);
    }

    let valTelMail = false;

    do {
      if (!data.telefono && !data.email) {
        errors.push("És necessari informar l'email o el telèfon.");
        setError(RegAlEmail);
        setError(RegAlTelefono);
        break;
      } else if (!isValidEmail(data.email) && !data.telefono) {
        errors.push("El format de l'email no és vàlid.");
        setError(RegAlEmail);
        break;
      } else if (data.email.length > 0 && !isValidEmail(data.email) && data.telefono) {
        errors.push("El format de l'email no és vàlid.");
        setError(RegAlEmail);
        break;
      } else {
        if (data.email.length === 0) { data.email = null };
        clearError(RegAlEmail);
        clearError(RegAlTelefono);
        valTelMail = true;
      };
    } while (valTelMail === false);

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
      body: JSON.stringify(data),
    });

    const json = await res.json();

    // Si hi ha errors → mostrar-los
    if (!json.ok) {
      console.log("Errors rebuts del backend:", json.error);

      // CONTROL DE ERRORES ANTERIOR, HACÍA REFERENCIA A UN SPAN QUE NO EXISTE.
      // // Netejar errors anteriors
      // document
      //   .querySelectorAll(".error-msg")
      //   .forEach((e) => (e.textContent = ""));

      // // Mostrar errors nous
      // for (const camp in json.errores) {
      //   const span = document.querySelector(`#error-${camp}`);
      //   if (span) span.textContent = json.errores[camp];
      // }

      showMsg(json.error);

      return;
    }

    // Si tot va bé → redirigir a /alumnos

    sessionStorage.setItem("alumnoCreado", true);
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#alumnoForm");
  if (!form) return;

  // --Editar--

  const btnEditar = document.querySelector("#btnEditar");
  btnEditar?.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".view-mode").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".edit-mode").forEach(el => el.classList.remove("hidden"));
    btnEditar.classList.add("hidden");
  });

  // -- Lógica para Cancelar (Opcional pero recomendada) --
  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar?.addEventListener("click", () => {
    document.querySelectorAll(".view-mode").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".edit-mode").forEach(el => el.classList.add("hidden"));
    btnEditar.classList.remove("hidden");
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

    const id = form.dataset.id;

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