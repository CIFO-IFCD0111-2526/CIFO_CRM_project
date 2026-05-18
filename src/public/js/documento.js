document.addEventListener("DOMContentLoaded", () => {
  initDocuments();
});

async function initDocuments() {
  const forms = document.querySelectorAll(".document-form");

  for (const form of forms) {
    const entidadTipo = form.dataset.entidadTipo;
    const entidadId = form.dataset.entidadId;

    await loadDocuments(form, entidadTipo, entidadId);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const res = await fetch(
          `/documentos/${entidadTipo}/${entidadId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Error HTTP");
        }

        const json = await res.json();

        if (!json.ok) {
          await window.showModal({
            type: "error",
            title: "Error",
            message: json.error || "Error al subir document",
          });

          return;
        }

        await window.showModal({
          type: "success",
          title: "OK",
          message: "Document pujat correctament",
        });

        form.reset();

        await loadDocuments(form, entidadTipo, entidadId);

      } catch (err) {
        console.error(err);

        await window.showModal({
          type: "error",
          title: "Error",
          message: "Error de connexió",
        });
      }
    });
  }
}

async function loadDocuments(form, entidadTipo, entidadId) {
  try {
    const res = await fetch(
      `/documentos/${entidadTipo}/${entidadId}`
    );

    if (!res.ok) {
      throw new Error("Error carregant documents");
    }

    const json = await res.json();

    if (!json.ok) return;

    renderDocuments(form, json.documentos);

  } catch (err) {
    console.error(err);
  }
}

function renderDocuments(form, documentos) {
  const container = form.parentElement;

  const lista = container.querySelector(
    ".detalle-lista-documentos"
  );

  if (!lista) return;

  if (!documentos.length) {
    lista.innerHTML = `
      <p class="detalle-empty">
        Encara no hi ha documents.
      </p>
    `;
    return;
  }

  lista.innerHTML = documentos
    .map((doc) => {
      return `
        <li class="document-item">

          <div class="document-info">
            <strong>${doc.nombre_original}</strong>

            <small>
              ${doc.mime_type}
              ·
              ${formatBytes(doc.tamano)}
            </small>
          </div>

          <div class="document-actions">

            <a
              href="/documentos/${doc.entidad_tipo}/${doc.entidad_id}/${doc.id}/descarregar"
              class="btn btn-secundario"
            >
              Descarregar
            </a>

            <button
              class="btn btn-danger btn-delete-document"
              data-id="${doc.id}"
            >
              Eliminar
            </button>

          </div>

        </li>
      `;
    })
    .join("");

  bindDeleteEvents(form);
}

function bindDeleteEvents(form) {
  const entidadTipo = form.dataset.entidadTipo;
  const entidadId = form.dataset.entidadId;

  const buttons = form.parentElement.querySelectorAll(
    ".btn-delete-document"
  );

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmed = await window.showConfirm({
        title: "Eliminar document",
        message: "Segur que vols eliminar aquest document?",
      });

      if (confirmed !== true) return;

      try {
        const res = await fetch(`/documentos/${id}`, {
          method: "DELETE",
        });
        const json = await res.json();

        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Error eliminant");
        }
        await window.showModal({
          type: "success",
          title: "Document eliminat",
          message: "El document s'ha eliminat correctament",
        });
        
        await loadDocuments(
          form,
          entidadTipo,
          entidadId
        );

      } catch (err) {
        console.error(err);

        await window.showModal({
          type: "error",
          title: "Error",
          message: "No s'ha pogut eliminar",
        });
      }
    });
  });
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];

  const i = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return (
    (bytes / Math.pow(1024, i)).toFixed(2) +
    " " +
    sizes[i]
  );
}