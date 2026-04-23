(() => {
  const overlay = document.getElementById("appModal");
  if (!overlay) return;

  const card = overlay.querySelector(".modal-card");
  const iconEl = overlay.querySelector(".modal-icon");
  const titleEl = overlay.querySelector(".modal-title");
  const messageEl = overlay.querySelector(".modal-message");
  const closeBtn = overlay.querySelector(".modal-close");
  const confirmBtn = overlay.querySelector(".modal-confirm");
  const cancelBtn = overlay.querySelector(".modal-cancel");

  const ICONS = {
    success: '<i class="fa-solid fa-circle-check"></i>',
    error: '<i class="fa-solid fa-circle-xmark"></i>',
    confirm: '<i class="fa-solid fa-triangle-exclamation"></i>',
  };

  let autoCloseTimer = null;
  let pendingResolve = null;

  const closeModal = (result = false) => {
    overlay.classList.remove("is-open", "is-confirm");
    card.classList.remove("is-success", "is-error", "is-confirm");
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    if (pendingResolve) {
      const resolve = pendingResolve;
      pendingResolve = null;
      resolve(result);
    }
  };

  const openModal = ({ type = "success", title = "", message = "" } = {}) => {
    card.classList.remove("is-success", "is-error", "is-confirm");
    overlay.classList.remove("is-confirm");
    card.classList.add(type === "error" ? "is-error" : "is-success");
    iconEl.innerHTML = ICONS[type] || ICONS.success;
    titleEl.textContent = title;
    messageEl.textContent = message;
    overlay.classList.add("is-open");
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => closeModal(false), 3000);
  };

  const openConfirm = ({
    title = "Confirmar acció",
    message = "Estàs segur?",
    confirmText = "Confirmar",
    cancelText = "Cancel·lar",
  } = {}) => {
    card.classList.remove("is-success", "is-error");
    card.classList.add("is-confirm");
    overlay.classList.add("is-confirm");
    iconEl.innerHTML = ICONS.confirm;
    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;
    overlay.classList.add("is-open");
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    return new Promise((resolve) => {
      pendingResolve = resolve;
    });
  };

  closeBtn.addEventListener("click", () => closeModal(false));
  cancelBtn.addEventListener("click", () => closeModal(false));
  confirmBtn.addEventListener("click", () => closeModal(true));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal(false);
  });

  window.showModal = openModal;
  window.showConfirm = openConfirm;
  window.closeModal = closeModal;
})();
