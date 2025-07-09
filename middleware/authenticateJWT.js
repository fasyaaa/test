const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

function authenticateJWT(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token || isTokenBlacklisted("access", token)) {
    return res.redirect("/myorbit");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/myorbit");

    req.user = user;
    next();
  });
}

module.exports = authenticateJWT;
