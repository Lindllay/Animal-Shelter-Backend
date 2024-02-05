const Animal = require("../models/Animal");
const CustomErrors = require("../errors");
const { StatusCodes } = require("http-status-codes");

const cloudinary = require("../lib/cloudinary");

const getAllAnimals = async (req, res) => {
  const queryObject = {};

  const { name, age, weight, breed, gender, adoptedAt, species, sort, limit } =
    req.query;

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (age) {
    const [min, max] = age.split("-");
    queryObject.age = { $gte: min, $lte: max };
  }

  if (weight) {
    const [min, max] = weight.split("-");
    queryObject.weight = { $gte: min, $lte: max };
  }
  if (breed) {
    queryObject.breed = breed;
  }
  if (gender) {
    queryObject.gender = gender;
  }
  if (adoptedAt) {
    queryObject.adoptedAt = { $gte: adoptedAt };
  }
  if (species) {
    queryObject.species = species;
  }

  let result = Animal.find(queryObject);
  if (sort) {
    result.sort(`${sort}`);
  }
  if (limit) {
    result.limit(`${limit}`);
  }

  const animals = await result;

  const resizedImgAnimals = animals.map((animal) => ({
    ...animal._doc,
    imageSrc: animal.imageSrc
      .split("upload/")
      .join("upload/w_400,f_auto,q_auto/"),
  }));

  res
    .status(StatusCodes.OK)
    .json({ animals: resizedImgAnimals, amount: animals.length });
};

const getAnimal = async (req, res) => {
  const { id } = req.params;

  const result = await Animal.find({ _id: id });
  const animal = result[0];
  if (!animal)
    throw new CustomErrors.NotFoundError(
      "Nie znaleziono zwierzęcia o podanym id"
    );

  res.status(StatusCodes.OK).json(animal);
};

const getAnimalsByName = async (req, res) => {
  const { name } = req.params;

  const result = await Animal.find({ name: { $regex: name, $options: "i" } });

  res.status(StatusCodes.OK).json({ animals: result, count: result.length });
  result.map((animal) => {
    console.log(animal.name);
  });
};

const createAnimal = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new CustomErrors.UnauthorizedError(
      "Access to this resource on the server is denied"
    );
  }

  const {
    name,
    age,
    weight,
    species,
    breed,
    gender,
    description,
    adoptedAt,
    imageSrc,
    imageSrcSmall,
    imageId,
  } = req.body.data;

  if (
    !name ||
    !age ||
    !species ||
    !weight ||
    !gender ||
    !imageSrc ||
    !imageId
  ) {
    await cloudinary.uploader.destroy(req.body.data.imageId); // delete image from cloudinary if error occurs
    throw new CustomErrors.BadRequestError(
      "Proszę podać imię, wiek, wagę, płeć oraz dodać zdjęcie zwierzęcia"
    );
  }
  const animalObject = {
    name,
    age: Number(age),
    weight: Number(weight),
    species,
    breed,
    gender,
    description,
    adoptedAt,
    imageSrc,
    imageSrcSmall,
    imageId,
  };

  await Animal.create(animalObject);

  res.status(StatusCodes.CREATED).json({ msg: "Success" });
};

const deleteAnimal = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new CustomErrors.UnauthorizedError(
      "Access to this resource on the server is denied"
    );
  }

  const { id } = req.params;

  const animal = await Animal.findOneAndDelete({ _id: id });

  if (!animal)
    throw new CustomErrors.NotFoundError(
      "Nie znaleziono zwierzęcia o podanym id"
    );

  const imageId = "photos" + animal.imageSrc.split("/photos")[1].split(".")[0];

  await cloudinary.uploader.destroy(imageId);

  res.status(200).json({ msg: "Success!" });
};

const updateAnimal = async (req, res) => {
  res.send("update animal");
};

module.exports = {
  getAllAnimals,
  getAnimal,
  getAnimalsByName,
  createAnimal,
  deleteAnimal,
  updateAnimal,
};
