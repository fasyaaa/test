const form = document.getElementById("loginForm");
const errorDisplay = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const codeReferral = document.getElementById("codeReferral").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, codeReferral }),
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = "/myorbit/homepage";
    } else {
      errorDisplay.textContent = data.message || "Login gagal.";
    }
  } catch (err) {
    errorDisplay.textContent = "Terjadi kesalahan saat login.";
  }
});
