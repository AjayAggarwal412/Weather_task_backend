const { Signup, Login } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);

router.post("/login", Login);

// router.post("/", userVerification);

router.post("/home", userVerification, (req, res) => {
  res.json({ message: "Welcome to your home page!" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, withCredentials: true });
  res.json({ message: "Logged out successfully!" });
});

module.exports = router;
