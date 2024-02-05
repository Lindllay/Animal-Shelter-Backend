const mongoose = require("mongoose");
const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "proszę podać imię"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "proszę podać wiek"],
  },
  species: {
    type: String,
    enum: {
      values: ["dog", "cat"],
      message: "{value} is not supported",
    },
  },
  breed: {
    type: String,
    trim: true,
  },
  weight: {
    type: Number,
    required: [true, "proszę podać wagę"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "{value} is not supported",
    },
    required: [true, "proszę wybrać płeć"],
  },
  description: {
    type: String,
    maxlength: [250, "opis nie może być dłuższy niż 250 znaków"],
  },
  adoptedAt: {
    type: Date,
  },
  imageSrc: {
    type: String,
    required: [true, "proszę dodać zdjęcie"],
  },
  imageSrcSmall: {
    type: String,
  },
  imageId: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Animal", AnimalSchema);
