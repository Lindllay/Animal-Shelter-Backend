const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const { uploadImage } = require("../controllers/uploadController");

router.route("/").post(authMiddleware, uploadImage);

module.exports = router;
