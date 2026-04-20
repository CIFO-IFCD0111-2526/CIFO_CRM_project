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


// Validacio de registre
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    if (!registerForm) return; // Si NO estem a /register, no fem res

    const nombreInput = document.querySelector("#registerNombre");
    const apellidosInput = document.querySelector("#registerApellidos");
    const emailInput = document.querySelector("#registerEmail");
    const passwordInput = document.querySelector("#registerPassword");
    const confirmPasswordInput = document.querySelector("#registerConfirmPassword");
    const registerMsg = document.querySelector("#registerMsg");

    registerForm.addEventListener("submit", async (e) => {
        let errors = [];

        const nombre = nombreInput.value.trim();
        const apellidos = apellidosInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Netejem dades en cas d'error previ.
        [nombreInput, apellidosInput, emailInput, passwordInput, confirmPasswordInput]
            .forEach(clearError);

        // Verifiquem que cada camp que compleixi els requisits.
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
            e.preventDefault();
            registerMsg.innerHTML = errors.join("<br>");
            registerMsg.style.display = "block";
            return;
        }

        registerMsg.innerHTML = "";
        registerMsg.style.display = "none";

        // FETCH
        e.preventDefault();

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    apellidos,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                registerMsg.innerHTML = data.message || "Error en el registre.";
                registerMsg.style.display = "block";
                return;
            }

            window.location.href = "/login";

        } catch (error) {
            registerMsg.innerHTML = "Error de connexió amb el servidor.";
            registerMsg.style.display = "block";
        }
    });

    // Si hi ha un error i l´usuari comença a escriure, netegem l´error visual.
    [nombreInput, apellidosInput, emailInput, passwordInput, confirmPasswordInput]
        .forEach(input => input.addEventListener("input", () => clearError(input)));
});
