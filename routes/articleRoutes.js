const express = require("express");
const router = express.Router();

const {
  getArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

const { uploadImage } = require("../controllers/uploadController");

router.route("/").get(getAllArticles).post(createArticle);
router.route("/:id").get(getArticle).delete(deleteArticle).patch(updateArticle);

module.exports = router;
