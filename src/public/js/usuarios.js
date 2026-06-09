async function aprovarUsuario(id) {
  try {
    const res = await fetch(`/usuarios/${id}/aprovar`, { method: "PUT" });
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
