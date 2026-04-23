//Esborrany del alumnos.js pendent que el company acabi de fer el commit i poder treballar-lo.

document.addEventListener("DOMContentLoaded", () => {
    // Agafem el formulari de la pàgina

    const form = document.querySelector("#alumnoForm");

    if (!form) return; // Si no és la pàgina del formulari, sortim

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Convertim el formulari en un objecte JS
        const formData = new FormData(alumnoForm);
        const data = Object.fromEntries(formData.entries());

        //Preparem els checkboxes per ser activats

        data.derechos_imagen = form.querySelector('[name="derechos_imagen"]')?.checked || false;
        data.cesion_material = form.querySelector('[name="cesion_material"]')?.checked || false;

        // Enviem al backend
        const res = await fetch("/alumnos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        // Si hi ha errors → mostrar-los
        if (!json.ok) {
            console.log("Errors rebuts del backend:", json.errores);

            // Netejar errors anteriors
            document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");

            // Mostrar errors nous
            for (const camp in json.errores) {
                const span = document.querySelector(`#error-${camp}`);
                if (span) span.textContent = json.errores[camp];
            }

            return;
        }

        // Si tot va bé → redirigir a /alumnos/:id
        window.location.href = json.redirect;
    });
});
