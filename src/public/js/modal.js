(() => {
  const overlay = document.getElementById("appModal");
  if (!overlay) return;

  const card = overlay.querySelector(".modal-card");
  const iconEl = overlay.querySelector(".modal-icon");
  const titleEl = overlay.querySelector(".modal-title");
  const messageEl = overlay.querySelector(".modal-message");
  const closeBtn = overlay.querySelector(".modal-close");

  const ICONS = {
    success: '<i class="fa-solid fa-circle-check"></i>',
    error: '<i class="fa-solid fa-circle-xmark"></i>',
  };

  let autoCloseTimer = null;

  const closeModal = () => {
    overlay.classList.remove("is-open");
    card.classList.remove("is-success", "is-error");
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
  };

  const openModal = ({ type = "success", title = "", message = "" } = {}) => {
    card.classList.remove("is-success", "is-error");
    card.classList.add(type === "error" ? "is-error" : "is-success");
    iconEl.innerHTML = ICONS[type] || ICONS.success;
    titleEl.textContent = title;
    messageEl.textContent = message;
    overlay.classList.add("is-open");
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeModal, 3000);
  };

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
  });

  window.showModal = openModal;
  window.closeModal = closeModal;
})();
