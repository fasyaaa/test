const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connection = require("../../config/database");
const { loginLimiter } = require("../../middleware/rateLimiter");
const {
  blacklistToken,
  isTokenBlacklisted,
} = require("../../utils/tokenBlacklist");

const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("codeReferral").notEmpty().trim().escape(),
];

// POST /api/login
router.post("/", loginLimiter, ...validateLogin, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg || "Format input tidak valid",
    });
  }

  const { email, codeReferral } = req.body;

  if (!email || !codeReferral) {
    return res.status(400).json({
      success: false,
      message: "Email dan Kode Referral wajib diisi.",
    });
  }

  connection.query(
    "SELECT * FROM profile WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Login DB Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }

      if (!result.length || result[0].codeReferral !== codeReferral) {
        return res
          .status(401)
          .json({ success: false, message: "Login gagal. Email/Kode salah" });
      }

      const user = result[0];
      const payload = {
        codeReferral: user.codeReferral,
        namaProfile: user.namaProfile,
        email: user.email,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Login berhasil",
        user: payload,
      });
    }
  );
});

// POST /api/login/refresh
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || isTokenBlacklisted("refresh", refreshToken)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      {
        codeReferral: user.codeReferral,
        namaProfile: user.namaProfile,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true, message: "Access token refreshed" });
  });
});

// POST /api/login/logout
router.post("/logout", (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken) blacklistToken("access", accessToken);
  if (refreshToken) blacklistToken("refresh", refreshToken);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({ success: true, message: "Berhasil logout" });
});

module.exports = router;
