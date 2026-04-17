const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
});

// Valores de formulario
const nombre = document.getElementById("registerNombre").value.trim();
const apellidos = document.getElementById("registerApellidos").value.trim();
const email = document.getElementById("registerForm.Email").value.trim();

const password = document.getElementById("registerPassword").value;
const confirmPassword = document.getElementById("registerConfirmPassword").value;

//para el mensaje 
const msg = document.getElementById("registerMsg");
msg.innerHTML = "";

// array error
const error = [];

// validaciones

if (!nombre || !apellidos || !email || !password || !confirmPassword) {
    error.push("Tots els camps són obligatoris");
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!email.match(emailRegex)) {
    error.push("email no valit");
}

if (password.lengt < 6) {
    error.push("La contrasenya ha de tenir com a mínim 6 caràcters.")
}

if (password !== confirmPassword) {
    error.push("Les contrasenyes no coincideixen.");
}

if (error.length > 0) {
    msg.innerHTML = error.join("<br>");
    msg.style.color = "red";
    return;
}

// if todo ok!

try {
    const res = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            apellidos,
            email,
            password
        })
    });

    const data = await res.json();

    msg.innerHTML = data.message;
    msg.style.color = "green";

} catch (error) {
    msg.innerHTML = "Error al registrar";
    msg.style.color = "red";
}
