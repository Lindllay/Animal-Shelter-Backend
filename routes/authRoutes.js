const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const { login, logout, dashboard } = require("../controllers/authController");

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/dashboard").get(authMiddleware, dashboard);

module.exports = router;
