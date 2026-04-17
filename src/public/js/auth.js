document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const loginMsg = document.querySelector("#loginMsg");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setError = (input) => {
    input.classList.add("error");
  };

  const clearError = (input) => {
    input.classList.remove("error");
  };

  form.addEventListener("submit", (e) => {
    let errors = [];

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset visual
    clearError(emailInput);
    clearError(passwordInput);

    // Email
    if (!email) {
      errors.push("El email és obligatori.");
      setError(emailInput);
    } else if (!isValidEmail(email)) {
      errors.push("El format de l'email no és vàlid.");
      setError(emailInput);
    }

    // Password
    if (!password) {
      errors.push("La contraseña és obligatòria.");
      setError(passwordInput);
    } else if (password.length < 6) {
      errors.push("La contraseña deu tenir al menys 6 caràcters.");
      setError(passwordInput);
    }

    if (errors.length > 0) {
      e.preventDefault();
      loginMsg.innerHTML = errors.join("<br>");
      loginMsg.style.display = "block";
    } else {
      loginMsg.innerHTML = "";
      loginMsg.style.display = "none";
    }
  });

  // Limpia error al escribir
  [emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", () => {
      clearError(input);
    });
  });
});