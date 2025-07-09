const connection = require("../config/database");
const moment = require("moment");

module.exports = function getProfileData(req, res, next) {
  const codeReferral = req.user.codeReferral;

  const query = "SELECT * FROM profile WHERE codeReferral = ?";
  connection.query(query, [codeReferral], (err, result) => {
    if (err || !result.length) {
      console.error("Error get profile:", err);
      return res.status(500).send("Internal Server Error");
    }

    const userData = result[0];
    const today = moment().startOf("day");
    const validThru = moment(userData.validThru);
    const status = validThru.isSameOrAfter(today) ? "active" : "inactive";

    req.profileData = result;
    req.profileStatus = status;

    next();
  });
};
