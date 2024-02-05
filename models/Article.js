const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Proszę podać tytuł"],
    trim: true,
    maxlength: [250, "Tytuł nie może być dłuższy niż 250 znaków"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  imageSrc: {
    type: String,
  },
  imageId: {
    type: String,
  },
  introduction: {
    type: String,
    required: [true, "Proszę dodać wstęp"],
    trim: true,
    maxlength: [500, "Wstęp nie może być dłuższy niż 250 znaków"],
  },
  description: {
    type: String,
    required: [true, "Proszę podać opis"],
    trim: true,
  },
  alt: {
    type: String,
    required: [true, "Proszę podać opis zdjęcia"],
    maxlength: [125, "Opis zdjęcia nie może być dłuższy niż 125 znaków"],
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
