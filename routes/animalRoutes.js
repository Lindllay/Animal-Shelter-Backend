const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  getAllAnimals,
  getAnimal,
  getAnimalsByName,
  createAnimal,
  deleteAnimal,
  updateAnimal,
} = require("../controllers/animalController");
const { uploadImage } = require("../controllers/uploadController");

router.route("/uploadImage").post(uploadImage);
router.route("/").get(getAllAnimals).post(authMiddleware, createAnimal);
router.route("/find/:name").get(getAnimalsByName);
router
  .route("/:id")
  .get(getAnimal)
  .delete(authMiddleware, deleteAnimal)
  .patch(updateAnimal);

module.exports = router;
