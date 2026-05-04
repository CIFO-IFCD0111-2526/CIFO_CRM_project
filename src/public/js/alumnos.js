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
    const json = await res.json();
    if (!res.ok || !json.ok) { throw new Error("Error eliminant alumne"); }
    window.location.href = json.redirect || "/alumnos";
  } catch (err) {
    await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut eliminar l'alumne.",
    });
  }
});

// Edició inline d'alumne (vista detalle)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#alumnoForm");
  if (!form || !form.dataset.id) return;

  const msgBox = document.querySelector("#AlDetMsg");
  if (!msgBox) return;

  const showMsg = (html, isError = true) => {
    if (!msgBox) return;
    msgBox.innerHTML = html;
    msgBox.style.display = "block";
    msgBox.classList.toggle("error-msg", isError);
  };

  const clearMsg = () => {
    if (!msgBox) return;
    msgBox.innerHTML = "";
    msgBox.style.display = "none";
    msgBox.classList.remove("error-msg");
  };

  const btnEditar = document.querySelector("#btnEditar");
  const btnCancelar = document.querySelector("#btnCancelar");

  const SELECTOR = ".edit-mode input, .edit-mode select, .edit-mode textarea, input.edit-mode, select.edit-mode, textarea.edit-mode";

  // ── Guardem snapshot dels valors originals ──────────────────
  let snapshot = {};

  const saveSnapshot = () => {
    snapshot = {};
    form.querySelectorAll(SELECTOR).forEach(el => {
      snapshot[el.name] = el.type === "checkbox" ? el.checked : el.value;
    });
  };

  const restoreSnapshot = () => {
    form.querySelectorAll(SELECTOR).forEach(el => {
      if (!(el.name in snapshot)) return;
      if (el.type === "checkbox") el.checked = snapshot[el.name];
      else el.value = snapshot[el.name];
    });
  };

  btnEditar?.addEventListener("click", (e) => {
    e.preventDefault();
    clearMsg();
    //Limpiar errores visuales
    form.querySelectorAll(".error").forEach(el => {
      el.classList.remove("error");
    });
    saveSnapshot(); // Guardem abans d'entrar en mode edició
    document.querySelectorAll(".view-mode").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".edit-mode").forEach(el => el.classList.remove("hidden"));
    btnEditar.classList.add("hidden");
  });

  btnCancelar?.addEventListener("click", () => {
    restoreSnapshot(); // Restaurem els valors originals
    // Limpiar errores visuales
    form.querySelectorAll(".error").forEach(el => {
      el.classList.remove("error");
    });
    clearMsg();
    document.querySelectorAll(".view-mode").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".edit-mode").forEach(el => el.classList.add("hidden"));
    btnEditar.classList.remove("hidden");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.derechos_imagen = form.querySelector('[name="derechos_imagen"]')?.checked || false;
    data.cesion_material = form.querySelector('[name="cesion_material"]')?.checked || false;

    // ── Validacions ──────────────────────────────────────────────
    const errors = [];
    const nombreInput = form.querySelector('[name="nombre"]');
    const apellidosInput = form.querySelector('[name="apellidos"]');
    const tipoInput = form.querySelector('[name="tipo"]');
    const dniInput = form.querySelector('[name="dni"]');
    const emailInput = form.querySelector('[name="email"]');
    const telInput = form.querySelector('[name="telefono"]');

    // Nombre
    if (!data.nombre) {
      errors.push("El nom és obligatori.");
      setError(nombreInput);
    } else {
      clearError(nombreInput);
    }

    // Apellidos
    if (!data.apellidos) {
      errors.push("Un cognom és obligatori.");
      setError(apellidosInput);
    } else {
      clearError(apellidosInput);
    }

    // Tipo
    if (!data.tipo) {
      errors.push("És obligatori escollir un tipus.");
      setError(tipoInput);
    } else {
      clearError(tipoInput);
    }

    if (!data.dni) {
      errors.push("El DNI o NIE és obligatori.");
      setError(dniInput);
    } else if (!validDniCifNie(data.dni)) {
      errors.push("Format incorrecte (DNI: 12345678A · NIE: Y1234567Z)");
      setError(dniInput);
    } else {
      clearError(dniInput);
    }

    if (!data.email && !data.telefono) {
      errors.push("És necessari informar l'email o el telèfon.");
      setError(emailInput);
      setError(telInput);
    } else if (data.email && !isValidEmail(data.email)) {
      errors.push("El format de l'email no és vàlid.");
      setError(emailInput);
    } else {
      clearError(emailInput);
      clearError(telInput);
      if (data.email?.length === 0) data.email = null;
    }

    if (errors.length > 0) {
      showMsg(errors.join("<br>"));
      submitBtn.disabled = false;
      return;
    }
    // ─────────────────────────────────────────────────────────────    

    const id = form.dataset.id;
    
    try {
      const res = await fetch(`/alumnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      submitBtn.disabled = false;

      if (!json.ok) {
        if (json.error) {
          showMsg(json.error);
        } else if (json.errores) {
          const errores = Object.values(json.errores);
          showMsg(errores.join("<br>"));
        } else {
          showMsg("Error desconegut");  // fallback por si acaso
        }
        submitBtn.disabled = false;
        return;
      }
      window.location.href = json.redirect;
    } catch (err) {
      console.error("Error en la petició:", err);

      await window.showModal({
        type: "error",
        title: "Error",
        message: "No s'ha pogut desar l'alumne.",
      });

      submitBtn.disabled = false;
    }
  });
});

// Buscador d'alumnes amb autocompletar
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("busquedaAlumno");
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
    debounceTimer = setTimeout(() => buscarAlumnos(query), 250);
  });

  async function buscarAlumnos(query) {
    try {
      const res = await fetch(`/alumnos/buscar?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await res.json();
      renderResultados(data);
    } catch (error) {
      console.error("Error en cerca:", error);
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
