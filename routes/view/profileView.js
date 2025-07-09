const express = require("express");
const router = express.Router();
const axios = require("axios");
const authenticateJWT = require("../../middleware/authenticateJWT");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const selectedMonth = req.query.month || "";
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const response = await axios.get(
      `${baseUrl}/api/profile?month=${selectedMonth}`,
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      }
    );

    const {
      title,
      title2,
      user,
      profileData,
      profileStatus,
      totalRevenue,
      msisdnPerMonth,
      status,
      currentYear,
    } = response.data;

    res.render("profile", {
      title,
      title2,
      user,
      data: profileData,
      status,
      totalRevenue,
      msisdnPerMonth,
      selectedMonth,
      moment: require("moment"),
      currentYear,
      currentPath: req.path,
    });
  } catch (error) {
    console.error("Error loading profile view:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return res.status(500).send("Gagal memuat halaman profile.");
  }
});

module.exports = router;
