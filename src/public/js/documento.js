document.addEventListener("DOMContentLoaded", () => {
  initDocuments();
});

const MIME_PERMITIDOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const TAMANO_MAXIMO = 10 * 1024 * 1024;

async function initDocuments() {
  const forms = document.querySelectorAll(".document-form");

  for (const form of forms) {
    const entidadTipo = form.dataset.entidadTipo;
    const entidadId = form.dataset.entidadId;
    const fileInput = form.querySelector('input[type="file"]');
    const msgBox = form.querySelector(".form-msg");

    const showMsg = (html, isError = true) => {
      if (!msgBox) return;
      msgBox.innerHTML = html;
      msgBox.style.display = "block";
      msgBox.classList.toggle("error-msg", isError);
    };

    const clearMsg = () => {
      if (!msgBox) return;
      msgBox.innerHTML = "";
      msgBox.style.display = "none";
      msgBox.classList.remove("error-msg");
    };

    await loadDocuments(form, entidadTipo, entidadId);

    const nameSpan = form.querySelector(".file-picker-name");

    fileInput?.addEventListener("change", () => {
      clearMsg();
      if (nameSpan) {
        nameSpan.textContent = fileInput.files?.[0]?.name || "Cap fitxer seleccionat";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearMsg();

      const file = fileInput?.files?.[0];

      if (!file) {
        showMsg("Selecciona un fitxer abans de pujar.");
        return;
      }
      if (file.size > TAMANO_MAXIMO) {
        showMsg("El fitxer supera el límit de 10MB.");
        return;
      }
      if (!MIME_PERMITIDOS.includes(file.type)) {
        showMsg("Tipus de fitxer no permès (PDF, JPG, PNG o DOCX).");
        return;
      }

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

        if (!res.ok || !json.ok) {
          showMsg(json.error || "Error al pujar document");
          return;
        }

        showMsg("Document pujat correctament", false);
        form.reset();
        if (nameSpan) nameSpan.textContent = "Cap fitxer seleccionat";

        await loadDocuments(form, entidadTipo, entidadId);

      } catch (err) {
        console.error(err);
        showMsg("Error de connexió");
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
            <strong>${escapeHtml(doc.nombre_original)}</strong>

            <small>
              ${escapeHtml(doc.mime_type)}
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

  const sizes = ["B", "KB", "MB"];

  const i = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return (
    (bytes / Math.pow(1024, i)).toFixed(2) +
    " " +
    sizes[i]
  );
}

function escapeHtml(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}
