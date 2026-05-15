document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".document-form");
  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const entidadTipo = form.dataset.entidadTipo;
      const entidadId = form.dataset.entidadId;

      const formData = new FormData(form);

      try {
        const res = await fetch(
          `/documentos/${entidadTipo}/${entidadId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const json = await res.json();

        if (!json.ok) {
          await window.showModal({
            type: "error",
            title: "Error",
            message: json.error || "Error al subir documento",
          });
          return;
        }

        await window.showModal({
          type: "success",
          title: "OK",
          message: "Documento subido correctamente",
        });

        form.reset();

        // aquí luego meterás render en lista
      } catch (err) {
        console.error(err);

        await window.showModal({
          type: "error",
          title: "Error",
          message: "Error de conexión",
        });
      }
    });
  });
});