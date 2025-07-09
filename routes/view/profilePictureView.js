const express = require("express");
const router = express.Router();
const axios = require("axios");
const authenticateJWT = require("../../middleware/authenticateJWT");
const multer = require("multer");
const FormData = require("form-data");
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * GET: Render foto profile user (untuk ditampilkan di <img>)
 */
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const response = await axios.get(
      `${
        process.env.BASE_URL || "http://localhost:3000"
      }/api/profile/profilePicture`,
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
        responseType: "arraybuffer", // <== penting!
        withCredentials: true,
      }
    );

    res.set("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (err) {
    console.error("Foto profil tidak ditemukan:", err.message);
    res.status(404).send("Foto profil tidak ditemukan.");
  }
});

/**
 * POST: Upload foto melalui API
 */
router.post("/", authenticateJWT, upload.single("photo"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("photo", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    await axios.post(
      `${
        process.env.BASE_URL || "http://localhost:3000"
      }/api/profile/profilePicture`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      }
    );

    res.redirect("/myorbit/profile");
  } catch (err) {
    console.error("Upload Error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    res.status(500).send("Gagal mengunggah foto profil.");
  }
});

/**
 * POST: Hapus foto melalui API
 */
router.post("/delete", authenticateJWT, async (req, res) => {
  try {
    await axios.post(
      `${
        process.env.BASE_URL || "http://localhost:3000"
      }/api/profile/profilePicture/delete`,
      {},
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      }
    );
    res.redirect("/myorbit/profile");
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).send("Gagal menghapus foto profil.");
  }
});

module.exports = router;
