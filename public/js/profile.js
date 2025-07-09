document.addEventListener("DOMContentLoaded", function () {
  const photoModal = document.getElementById("photoModal");
  const infoModal = document.getElementById("infoModal");

  const avatar = document.getElementById("avatarTrigger");
  const closePhotoBtn = document.getElementById("closeModalBtnFoto");
  const closeInfoBtn = document.getElementById("closeInfoModalBtn");

  const modalAvatar = document.getElementById("modalAvatar");
  const closeBtnUpload = document.getElementById("closeModalBtn");

  if (closeBtnUpload) {
    closeBtnUpload.addEventListener("click", () => {
      photoModal.style.display = "none";
    });
  }

  if (avatar) {
    avatar.addEventListener("click", () => {
      infoModal.style.display = "block";
    });
  }

  if (closeInfoBtn) {
    closeInfoBtn.addEventListener("click", () => {
      infoModal.style.display = "none";
    });
  }

  if (closePhotoBtn) {
    closePhotoBtn.addEventListener("click", () => {
      photoModal.style.display = "none";
    });
  }

  if (modalAvatar) {
    modalAvatar.addEventListener("click", () => {
      infoModal.style.display = "none";
      photoModal.style.display = "block";
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === infoModal) {
      infoModal.style.display = "none";
    }
    if (event.target === photoModal) {
      photoModal.style.display = "none";
    }
  });

  document
    .getElementById("photoInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const preview = document.querySelector(".current-photo-preview img");

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
});
