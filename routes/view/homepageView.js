const express = require("express");
const router = express.Router();
const axios = require("axios");
const authenticateJWT = require("../../middleware/authenticateJWT");
const moment = require("moment");

// GET /myorbit/homepage
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const apiResponse = await axios.get(
      `${process.env.BASE_URL || "http://localhost:3000"}/api/homepage`,
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      }
    );

    const data = apiResponse.data;

    res.render("homepage", {
      title: data.title,
      user: data.user,
      data: data.profileData,
      status: data.profileStatus,
      top3Agents: data.top3Agents,
      leaderboard: data.leaderboard,
      topLabels: JSON.stringify(data.topLabels),
      topData: JSON.stringify(data.topData),
      monthName: data.monthName,
      year: data.year,
      currentPath: req.originalUrl,
      moment 
    });
  } catch (error) {
    console.error("Error loading homepage view:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error", error.message);
    }
    return res.status(500).send("Gagal memuat halaman dashboard.");
  }
});

module.exports = router;
