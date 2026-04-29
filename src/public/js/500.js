const backButton = document.querySelector("#backButton");

if (backButton) {
    backButton.addEventListener("click", (event) => {
        if (window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        } else {
            window.location.href = "/";
        }
  });
}