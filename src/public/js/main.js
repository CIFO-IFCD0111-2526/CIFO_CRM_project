
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        window.showLoader();

        try {
            const res = await fetch("/logout", { method: "POST" });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error("Error tancant sessió");
            }
            window.location.href = data.redirect + "?logout=1";
        } catch (err) {
            console.error(err);
            await window.showModal({
                type: "error",
                title: "Error",
                message: "No s'ha pogut tancar la sessió.",
            });
        } finally {
            window.hideLoader();
        }
    });
}