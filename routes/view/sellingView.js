const express = require("express");
const router = express.Router();
const axios = require("axios");
const authenticateJWT = require("../../middleware/authenticateJWT");
const moment = require("moment");

// GET /myorbit/profile/selling
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const month = req.query.month || "";

    const apiResponse = await axios.get(
      `${process.env.BASE_URL || "http://localhost:3000"}/api/profile/selling`,
      {
        params: { month },
        headers: {
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      }
    );

    const { title, data, user, selectedMonth } = apiResponse.data;

    res.render({
      title,
      data,
      user,
      month,
      moment,
    });
  } catch (error) {
    console.error("Error loading selling view:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return res.status(500).send("Gagal memuat halaman selling.");
  }
});

module.exports = router;
