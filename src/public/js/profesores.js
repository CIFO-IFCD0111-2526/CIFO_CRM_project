const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const setError = (input) => input.classList.add("error");
const clearError = (input) => input.classList.remove("error");

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

  const botonesEliminar = document.querySelectorAll(".btn-eliminar");

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
});

  if (sessionStorage.getItem("professorCreat")) {
    sessionStorage.removeItem("professorCreat");
    window.showModal?.({
      type: "success",
      title: "Professor creat",
      message: "Has creat el professor correctament.",
    });
  }

  [nombre, apellidos, email].forEach((input) => {
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
