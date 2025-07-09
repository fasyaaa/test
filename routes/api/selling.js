const express = require("express");
const router = express.Router();
const connection = require("../../config/database");
const authenticateJWT = require("../../middleware/authenticateJWT.js");
const moment = require("moment");

// GET /myorbit/profile/selling
router.get("/", authenticateJWT, (req, res) => {
  const codeReferral = req.user.codeReferral;
  const selectedMonth = req.query.month ? parseInt(req.query.month) : null;

  let query = `
    SELECT *
    FROM selling
    WHERE codeReferral = ?
  `;
  const params = [codeReferral];

  if (selectedMonth && selectedMonth >= 1 && selectedMonth <= 12) {
    const currentYear = new Date().getFullYear();
    query += ` AND MONTH(activeDate) = ? AND YEAR(activeDate) = ?`;
    params.push(selectedMonth, currentYear);
  }

  query += ` ORDER BY activeDate ASC`;

  connection.query(query, params, (err, rows) => {
    if (err) return res.status(500).send("Internal Server Error");

    return res.json({
      title: `Detail Penjualan ${new Date().getFullYear()}`,
      data: rows,
      user: req.user,
      month: selectedMonth
    });
  });
});

module.exports = router;
