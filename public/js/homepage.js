document.addEventListener("DOMContentLoaded", () => {
  const avatarTrigger = document.getElementById("avatarTrigger");
  const infoModal = document.getElementById("infoModal");
  const closeInfoModalBtn = document.getElementById("closeInfoModalBtn");

  avatarTrigger?.addEventListener("click", () => {
    infoModal.style.display = "block";
  });

  closeInfoModalBtn?.addEventListener("click", () => {
    infoModal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target === infoModal) {
      infoModal.style.display = "none";
    }
  };
});
