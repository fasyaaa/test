const express = require("express");
const router = express.Router();
const axios = require("axios");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

function checkAlreadyLogin(req, res, next) {
  if (req.cookies.accessToken) {
    return res.redirect("/myorbit/homepage");
  }
  next();
}

router.get("/", checkAlreadyLogin, (req, res) => {
  res.render("login", {
    title: "Login",
    error: null,
    csrfToken: "",
  });
});

// GET /myorbit → tampilkan form login
router.get("/", (req, res) => {
  console.log("Render login - data:", {
    title: "Login",
    error: null,
    csrfToken: "",
  });
  res.render("login", {
    title: "Login",
    error: null,
    csrfToken: "", // jika pakai CSRF protection
  });
});

// POST /myorbit → form login submit
router.post("/", async (req, res) => {
  const { email, codeReferral } = req.body;

  try {
    // Kirim data ke endpoint API login
    const response = await axios.post(
      `${process.env.BASE_URL || "http://localhost:3000"}/api/login`,
      { email, codeReferral },
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie || "",
        },
      }
    );

    // Ambil cookie dari response dan forward ke client
    const setCookies = response.headers["set-cookie"];
    if (setCookies) {
      setCookies.forEach((cookie) => {
        res.append("Set-Cookie", cookie);
      });
    }

    // Redirect ke homepage jika berhasil login
    return res.redirect("/myorbit/homepage");
  } catch (error) {
    let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return res.status(401).render("login", {
      title: "Login",
      error: errorMessage,
      csrfToken: "", // sesuaikan kalau pakai CSRF token
    });
  }
});

// POST /myorbit/logout → redirect ke login setelah logout
router.post("/logout", async (req, res) => {
  try {
    await axios.post(
      `${process.env.BASE_URL || "http://localhost:3000"}/api/login/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie || "",
        },
      }
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.render("logoutRedirect");
  } catch (error) {
    return res.render("logoutRedirect");
  }
});

module.exports = router;
