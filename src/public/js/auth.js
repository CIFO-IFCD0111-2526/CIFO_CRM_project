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
  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const rememberInput = document.querySelector("#loginRemember");
  const loginMsg = document.querySelector("#loginMsg");

  if (!form) return;

  if (new URLSearchParams(window.location.search).get("logout") === "1") {
    window.showModal?.({
      type: "success",
      title: "Sessió tancada",
      message: "Has tancat la sessió correctament.",
    });
    window.history.replaceState({}, "", window.location.pathname);
  }

  const showMsg = (html, isError = true) => {
    loginMsg.innerHTML = html;
    loginMsg.style.display = "block";
    loginMsg.classList.toggle("error-msg", isError);
  };

  const clearMsg = () => {
    loginMsg.innerHTML = "";
    loginMsg.style.display = "none";
    loginMsg.classList.remove("error-msg");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const remember = rememberInput ? rememberInput.checked : false;

    clearError(emailInput);
    clearError(passwordInput);
    clearMsg();

    const errors = [];

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

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginEmail: email,
          loginPassword: password,
          loginRemember: remember,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        window.showModal?.({
          type: "success",
          title: "Sessió iniciada",
          message: "Accedint al panell...",
        });
        setTimeout(() => { window.location.href = data.redirect; }, 2000);
      } else if (res.status >= 500) {
        window.showModal?.({
          type: "error",
          title: "Error del servidor",
          message: "Torna-ho a provar d'aquí uns minuts.",
        });
      } else {
        showMsg(data.error || "No s'ha pogut iniciar sessió.");
      }
    } catch (error) {
      window.showModal?.({
        type: "error",
        title: "Error de connexió",
        message: "No s'ha pogut contactar amb el servidor.",
      });
    }
  });

  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input);
    });
  });

});



// Validacio de registre
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#registerForm");
  if (!registerForm) return;

  const nombreInput = document.querySelector("#registerNombre");
  const apellidosInput = document.querySelector("#registerApellidos");
  const emailInput = document.querySelector("#registerEmail");
  const passwordInput = document.querySelector("#registerPassword");
  const confirmPasswordInput = document.querySelector("#registerConfirmPassword");
  const registerMsg = document.querySelector("#registerMsg");

  const showMsg = (html) => {
    registerMsg.innerHTML = html;
    registerMsg.style.display = "block";
  };

  const clearMsg = () => {
    registerMsg.innerHTML = "";
    registerMsg.style.display = "none";
  };

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    [nombreInput, apellidosInput, emailInput, passwordInput, confirmPasswordInput]
      .forEach(clearError);
    clearMsg();

    const errors = [];

    if (!nombre) {
      errors.push("El nom és obligatori.");
      setError(nombreInput);
    }

    if (!apellidos) {
      errors.push("Els cognoms són obligatoris.");
      setError(apellidosInput);
    }

    if (!email) {
      errors.push("L'email és obligatori.");
      setError(emailInput);
    } else if (!isValidEmail(email)) {
      errors.push("El format de l'email no és vàlid.");
      setError(emailInput);
    }

    if (!password) {
      errors.push("La contrasenya és obligatòria.");
      setError(passwordInput);
    } else if (password.length < 6) {
      errors.push("La contrasenya ha de tenir almenys 6 caràcters.");
      setError(passwordInput);
    }

    if (!confirmPassword) {
      errors.push("Has de confirmar la contrasenya.");
      setError(confirmPasswordInput);
    } else if (password !== confirmPassword) {
      errors.push("Les contrasenyes no coincideixen.");
      setError(confirmPasswordInput);
    }

    if (errors.length > 0) {
      showMsg(errors.join("<br>"));
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, email, password }),
      });

      const data = await response.json();

      if (data.ok) {
        window.showModal?.({
          type: "success",
          title: "Compte creat",
          message: "Benvingut/da! Entrant al panell...",
        });
        setTimeout(() => { window.location.href = data.redirect; }, 2000);
      } else if (response.status >= 500) {
        window.showModal?.({
          type: "error",
          title: "Error del servidor",
          message: "Torna-ho a provar d'aquí uns minuts.",
        });
      } else {
        showMsg(data.error || "Error en el registre.");
      }
    } catch (error) {
      window.showModal?.({
        type: "error",
        title: "Error de connexió",
        message: "No s'ha pogut contactar amb el servidor.",
      });
    }
  });

  [nombreInput, apellidosInput, emailInput, passwordInput, confirmPasswordInput]
    .forEach((input) => input.addEventListener("input", () => clearError(input)));
});
