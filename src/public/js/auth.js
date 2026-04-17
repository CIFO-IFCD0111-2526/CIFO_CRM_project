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
        window.location.href = data.redirect;
      } else {
        showMsg(data.error || "No s'ha pogut iniciar sessió.");
      }
    } catch (error) {
      showMsg("No s'ha pogut iniciar sessió. Torna-ho a provar.");
    }
  });

  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input);
    });
  });
});