document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    const id = btn.dataset.id;
    const row = btn.closest("tr");
    const nombreFromRow = row?.querySelector(".uf-nombre")?.textContent.trim();
    const nombreFromForm = document.querySelector("#ufForm .view-mode")?.textContent.trim();
    const nombre = nombreFromRow || nombreFromForm || "aquesta UF";

    const ok = await window.showConfirm({
        title: "Eliminar UF",
        message: `Segur que vols eliminar ${nombre}? Aquesta acció no es pot desfer.`,
        confirmText: "Eliminar",
        cancelText: "Cancel·lar",
    });

    if (!ok) return;

    try {
        const res = await fetch(`/ufs/${id}`, { method: "DELETE" });
        const json = await res.json();
        if (!res.ok || !json.ok) { throw new Error("Error eliminant UF"); }
        window.location.href = json.redirect;
    } catch (err) {
        await window.showModal({
            type: "error",
            title: "Error",
            message: "No s'ha pogut eliminar la UF.",
        });
    }
});