
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        const res = await fetch("/logout", { method: "POST" });
        const data = await res.json();
        if (data.ok) window.location.href = data.redirect + "?logout=1";
    });
}