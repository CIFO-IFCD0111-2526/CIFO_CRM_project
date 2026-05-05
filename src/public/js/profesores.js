const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
console.log("profesores.js cargado");
const setError = (input) => {
  if (input) input.classList.add("error");
};

const clearError = (input) => {
  if (input) input.classList.remove("error");
};

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

document.addEventListener("click", (e) => {
  console.log("CLICK detectado", e.target);
});

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-eliminar");
  if (!btn) return;

  const id = btn.dataset.id;
  const row = btn.closest("tr");

  const nombreProfesor = row?.querySelector(".profesor-nombre")?.textContent.trim() || "aquest professor";

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

    if (!res.ok || !json.ok) {
      throw new Error("Error eliminant professor");
    }

    window.location.href = json.redirect || "/profesores";

  } catch (err) {
    await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut eliminar el professor.",
    });
  }
});

  /* const botonesEliminar = document.querySelectorAll(".btn-eliminar");

botonesEliminar.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.id;

    const confirmacion = confirm("¿Segur que vols esborrar aquest professor?");
    if (!confirmacion) return;

    try {
      const res = await fetch(`/profesores/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (data.ok) {
        window.location.href = data.redirect;
      } else {
        alert(data.message || "Errada al esborrar el professor");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexió amb el servidor");
    }
  });
});*/

  if (sessionStorage.getItem("professorCreat")) {
    sessionStorage.removeItem("professorCreat");
    window.showModal?.({
      type: "success",
      title: "Professor creat",
      message: "Has creat el professor correctament.",
    });
  }

  [nombre, apellidos, email].forEach((input) => {
    /* input.addEventListener("input", () => clearError(input)); */
    if (!input) return;
    input.addEventListener("input", () => clearError(input));
  });

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

    const res = await fetch("/profesores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!json.ok) {
      showMsg(json.error);
      return;
    }

    sessionStorage.setItem("professorCreat", "true");
    window.location.href = json.redirect;
  });
});
