const express = require("express");
const router = express.Router();
const connection = require("../../config/database");
const authenticateJWT = require("../../middleware/authenticateJWT");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * GET: foto profile user
 */
router.get("/", authenticateJWT, (req, res) => {
  const codeReferral = req.user.codeReferral;

  const query = "SELECT profilePicture FROM profile WHERE codeReferral = ?";
  connection.query(query, [codeReferral], (err, results) => {
    if (err || results.length === 0 || !results[0].profilePicture) {
      return res.status(404).send("Foto profil tidak ditemukan.");
    }

    res.set("Content-Type", "image/jpeg");
    res.send(results[0].profilePicture);
  });
});

/**
 * POST: Upload/update foto profile
 */
router.post("/", authenticateJWT, upload.single("photo"), (req, res) => {
  const codeReferral = req.user.codeReferral;
  if (!req.file)
    return res.status(400).json({ message: "File tidak ditemukan." });

  const query = "UPDATE profile SET profilePicture = ? WHERE codeReferral = ?";
  connection.query(query, [req.file.buffer, codeReferral], (err) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: "Gagal mengunggah foto profil." });
    }
    res.json({ message: "Foto profil berhasil diunggah." });
  });
});

/**
 * DELETE: foto profile
 */
router.post("/delete", authenticateJWT, (req, res) => {
  const codeReferral = req.user.codeReferral;

  const query =
    "UPDATE profile SET profilePicture = NULL WHERE codeReferral = ?";
  connection.query(query, [codeReferral], (err) => {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus foto profil." });
    res.json({ message: "Foto profil berhasil dihapus." });
  });
});

module.exports = router;
