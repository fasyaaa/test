require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

// --- Security ---
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },
  })
);

// --- Middleware ---
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
// --- Prevent browser caching (disable back after logout) ---
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- View engine setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// --- Rate limiting ---
const { loginLimiter, generalLimiter } = require("./middleware/rateLimiter");
app.use("/myorbit", generalLimiter);

// --- API routes ---
const apiLoginRouter = require("./routes/api/login");
const apiHomepageRouter = require("./routes/api/homepage");
const apiProfileRouter = require("./routes/api/profile");
const apiProfilePictureRouter = require("./routes/api/profilePicture");
const apiSellingRouter = require("./routes/api/selling");

app.use("/api/login", apiLoginRouter);
app.use("/api/homepage", apiHomepageRouter);
app.use("/api/profile/profilePicture", apiProfilePictureRouter);
app.use("/api/profile", apiProfileRouter);
app.use("/api/profile/selling", apiSellingRouter);

// --- View routes (EJS-based) ---
const loginViewRouter = require("./routes/view/loginView");
const homepageViewRouter = require("./routes/view/homepageView");
const profileViewRouter = require("./routes/view/profileView");
const profilePictureViewRouter = require("./routes/view/profilePictureView");
const profileInfoViewRouter = require("./routes/view/profileInfoView");
const sellingRouter = require("./routes/view/sellingView");

app.use("/myorbit", loginViewRouter); 
app.use("/myorbit/homepage", homepageViewRouter);
app.use("/myorbit/profile", profileViewRouter);
app.use("/myorbit/profile/picture", profilePictureViewRouter);
app.use("/myorbit/profile/info", profileInfoViewRouter);
app.use("/myorbit/profile/selling", sellingRouter);

// --- EJS Layout helper ---
app.use((req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
});

// --- Root redirect ---
app.get("/", (req, res) => {
  res.redirect("/myorbit");
});

// --- Start server ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
