const express = require("express");
const router = express.Router();
const connection = require("../../config/database");
const authenticateJWT = require("../../middleware/authenticateJWT.js");
const getProfileData = require("../../middleware/getProfileData");


router.get("/", authenticateJWT, getProfileData, (req, res) => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const now = new Date();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const leaderboardQuery = `
    SELECT
      p.namaProfile,
      s.codeReferral,
      COUNT(DISTINCT s.MSISDN) AS totalPenjualan
    FROM selling s
    JOIN profile p ON s.codeReferral = p.codeReferral
    WHERE MONTH(s.activeDate) = '6' AND YEAR(s.activeDate) = '2025'
    GROUP BY s.codeReferral
    ORDER BY totalPenjualan DESC
    LIMIT 10
  `;

  connection.query(
    leaderboardQuery,
    [currentMonth, currentYear],
    (err, fullLeaderboard) => {
      if (err) {
        console.error("SQL Error fetching leaderboard:", err);
        return res.status(500).send("Internal Server Error");
      }

      const top3Agents = fullLeaderboard.slice(0, 3);

      const reorderedTop3 = [
        top3Agents[1] || null,
        top3Agents[0] || null,
        top3Agents[2] || null,
      ];

      const topLabels = reorderedTop3.map((agent) =>
        agent ? agent.namaProfile : ""
      );
      const topData = reorderedTop3.map((agent) =>
        agent ? agent.totalPenjualan : 0
      );

      const remainingLeaderboard = fullLeaderboard.slice(3);

      res.json({
        title: "Dashboard",
        user: req.user,
        profileData: req.profileData,
        profileStatus: req.profileStatus,
        leaderboard: remainingLeaderboard,
        top3Agents,
        topLabels,
        topData,
        monthName: monthNames[currentMonth - 1],
        year: currentYear,
        currentPath: req.path
      });
    }
  );
});

module.exports = router;
