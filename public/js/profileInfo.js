const profileAvatar = document.getElementById("profileAvatar");
const photoModal = document.getElementById("photoModal");
const closeModalBtn = document.getElementById("closeModalBtn");

profileAvatar.addEventListener("click", () => {
  photoModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  photoModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === photoModal) {
    photoModal.style.display = "none";
  }
});
