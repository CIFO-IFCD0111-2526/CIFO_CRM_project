async function aprovarUsuario(id) {
  try {
    const response = await fetch(`/usuarios/${id}/aprovar`, {
      method: "PUT"
    });

    const json = await response.json();   // ← AIXÒ ERA EL QUE FALTAVA

    if (json.redirect) {
      window.location.href = json.redirect;
      return;
    }

    window.location.reload();

  } catch (error) {
    console.error("Error aprovant usuari:", error);
    alert("Error del servidor en aprovar l'usuari");
  }
}

async function rebutjarUsuario(id) {
  const ok = window.confirm("Segur que vols rebutjar aquest usuari?");
  if (!ok) return;

  try {
    const response = await fetch(`/usuarios/${id}`, {
      method: "DELETE"
    });

    const json = await response.json();   

    if (json.redirect) {
      window.location.href = json.redirect;
      return;
    }

    window.location.reload();

  } catch (error) {
    console.error("Error rebutjant usuari:", error);
    alert("Error del servidor en rebutjar l'usuari");
  }
}
