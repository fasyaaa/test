document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerMenu");
  const mobileSidebar = document.getElementById("mobileSidebar");
  const closeSidebarBtn = document.getElementById("closeSidebar"); 

  const openSidebar = () => {
    mobileSidebar.classList.add("open");
    if (hamburger) { 
      hamburger.style.display = "none";
    }
  };

  const closeSidebar = () => {
    mobileSidebar.classList.remove("open");
    if (hamburger) {
      hamburger.style.display = "block";
    }
  };

  hamburger?.addEventListener("click", openSidebar);
  closeSidebarBtn?.addEventListener("click", closeSidebar);

  // Swipe gesture for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (
      mobileSidebar.classList.contains("open") &&
      !mobileSidebar.contains(e.target) &&
      (!hamburger || !hamburger.contains(e.target))
    ) {
      closeSidebar();
    }
  });

  function handleSwipeGesture() {
    const swipeThreshold = 50;
    if (mobileSidebar && hamburger) { 
      if (touchEndX - touchStartX > swipeThreshold && !mobileSidebar.classList.contains("open")) {
        openSidebar();
      } else if (touchStartX - touchEndX > swipeThreshold && mobileSidebar.classList.contains("open")) {
        closeSidebar();
      }
    }
  }
});
