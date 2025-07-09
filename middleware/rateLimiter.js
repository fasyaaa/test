const rateLimit = require("express-rate-limit");

// Endpoint login
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 1000,
  message: "Terlalu banyak percobaan login. Coba lagi nanti."
});

// Endpoint umum
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, 
  message: "Terlalu banyak permintaan. Coba lagi nanti."
});

module.exports = {
  loginLimiter,
  generalLimiter
};
