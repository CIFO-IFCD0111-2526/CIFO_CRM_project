async function aprovarUsuario(id) {
  try {
    const nivel_acceso = document.getElementById(`rol-${id}`).value;

    const res = await fetch(`/usuarios/${id}/aprovar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nivel_acceso,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Error aprovant l'usuari");
    }

    window.location.href = json.redirect || "/admin";
  } catch (error) {
    console.error("Error aprovant usuari:", error);
    await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut aprovar l'usuari",
    });
  }
}

async function rebutjarUsuario(id) {
  const ok = await window.showConfirm({
    title: "Rebutjar usuari",
    message: "Segur que vols rebutjar aquest usuari? Aquesta acció no es pot desfer.",
    confirmText: "Rebutjar",
    cancelText: "Cancel·lar",
  });

  if (ok !== true) return;

  try {
    const res = await fetch(`/usuarios/${id}`, { method: "DELETE" });
    const json = await res.json();

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Error rebutjant l'usuari");
    }

    window.location.href = json.redirect || "/admin";
  } catch (error) {
    console.error("Error rebutjant usuari:", error);
    await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut rebutjar l'usuari",
    });
  }
}

async function actualitzarRol(id) {
  try {
    const nivel_acceso = document.getElementById(`rol-activo-${id}`).value;

    const res = await fetch(`/usuarios/${id}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nivel_acceso,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Error actualitzant rol");
    }

    await window.showModal({
      type: "success",
      title: "Rol actualitzat",
      message: "El rol de l'usuari s'ha actualitzat correctament.",
    });

  } catch (error) {
    console.error("Error actualitzant rol:", error);

    await window.showModal({
      type: "error",
      title: "Error",
      message: "No s'ha pogut actualitzar el rol.",
    });
  }
}