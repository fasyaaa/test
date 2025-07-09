const express = require("express");
const router = express.Router();
const connection = require("../../config/database");
const authenticateJWT = require("../../middleware/authenticateJWT.js");
const moment = require("moment");
const getProfileData = require("../../middleware/getProfileData");

router.get("/", authenticateJWT, getProfileData, (req, res) => {
  const codeReferral = req.user.codeReferral;
  const selectedMonth = req.query.month ? parseInt(req.query.month) : null;
  const currentYear = new Date().getFullYear();

  // Ganti nilai nya saja jika ada perubahan INSENTIF
  const INSENTIF_PER_MSISDN = 25000;

  const profileQuery = "SELECT * FROM profile WHERE codeReferral = ?";
  const msisdnDetailQuery = `
  SELECT 
    MSISDN, 
    DATE_FORMAT(activeDate, '%d-%m-%Y') AS activeDate, 
    productCode
  FROM selling 
  WHERE codeReferral = ?
  ORDER BY activeDate DESC
`;

  const totalMsisdnQuery = `
    SELECT COUNT(DISTINCT MSISDN) AS totalMSISDN 
    FROM selling 
    WHERE codeReferral = ?  AND YEAR(activeDate) = ?`;

  let msisdnPerMonthQuery = `
    SELECT DATE_FORMAT(activeDate, '%Y-%m') AS month,
           COUNT(DISTINCT MSISDN) AS totalMSISDN
    FROM selling
    WHERE codeReferral = ?`;

  const params = [codeReferral];

  if (selectedMonth) {
    const year = new Date().getFullYear();
    msisdnPerMonthQuery += ` AND MONTH(activeDate) = ? AND YEAR(activeDate) = ?`;
    params.push(selectedMonth, year);
  }

  msisdnPerMonthQuery += ` GROUP BY month ORDER BY month ASC`;

  connection.query(profileQuery, [codeReferral], (err, profileResult) => {
    if (err) return res.status(500).send("Internal Server Error");
    if (profileResult.length === 0)
      return res.status(404).send("Profile not found");

    const user = profileResult[0];
    const today = moment().startOf("day");
    const validThru = moment(user.validThru);
    const isActive = validThru.isSameOrAfter(today);
    const status = isActive ? "active" : "inactive";

    connection.query(
      totalMsisdnQuery,
      [codeReferral, currentYear],
      (err, totalResult) => {
        if (err) return res.status(500).send("Internal Server Error");

        const totalMsisdn = totalResult[0]?.totalMSISDN || 0;
        const totalRevenue = totalMsisdn * INSENTIF_PER_MSISDN;
        const formattedRevenue =
          "Rp" + Number(totalRevenue).toLocaleString("id-ID");

        connection.query(msisdnPerMonthQuery, params, (err, msisdnResult) => {
          if (err) return res.status(500).send("Internal Server Error");

          const msisdnPerMonth = msisdnResult.map((row) => ({
            ...row,
            monthlyRevenue: row.totalMSISDN * INSENTIF_PER_MSISDN,
          }));

          res.json({
            title: `Performance`,
            title2: `${user.referralGroup}`,
            user: req.user,
            profileData: req.profileData,
            profilestatus: req.profileStatus,
            totalRevenue: formattedRevenue,
            msisdnPerMonth,
            status,
            selectedMonth,
            currentYear,
          });
        });
      }
    );
  });
});

module.exports = router;
