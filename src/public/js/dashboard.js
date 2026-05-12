/* A DEFINIR EN ISSUES POSTERIORES:

    - Lógica de fetching de la DB de alumnos, cursos, y anotaciones para mostrar en 'public/dashboard.ejs'.

*/
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#anotacionForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const contenido = form.contenido.value.trim();

    try {
      const res = await fetch("/anotaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contenido }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        return window.showModal({
          title: "Error",
          text: data.error || "Error al crear anotació",
          icon: "error",
        });
      }

      // recarga dashboard para ver flash + lista actualizada
      window.location.href = data.redirect;

    } catch (error) {
      console.error(error);

      window.showModal({
        title: "Error",
        text: "Error de connexió amb el servidor",
        icon: "error",
      });
    }
  });
});