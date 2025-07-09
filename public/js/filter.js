  document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("month");
    if (monthSelect) {
      monthSelect.addEventListener("change", function () {
        this.form.submit();
      });
    }
  });