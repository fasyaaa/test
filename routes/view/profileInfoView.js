const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../middleware/authenticateJWT");
const axios = require("axios");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const response = await axios.get(`${baseUrl}/api/profile`, {
      headers: { Cookie: req.headers.cookie || "" },
      withCredentials: true,
    });

    res.render("profileInfo", {
      data: response.data.profileData[0],
      moment: require("moment"),
    });
  } catch (error) {
    console.error("Error loading profile info:", error.message);
    res.status(500).send("Gagal memuat data profil.");
  }
});

module.exports = router;
