const Article = require("../models/Article");
const CustomErrors = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../lib/cloudinary");

const getArticle = async (req, res) => {
  const { id } = req.params;

  const result = await Article.find({ _id: id });

  const article = result[0];
  if (!article)
    throw new CustomErrors.NotFoundError(
      "Nie znaleziono artykułu o podanym id"
    );

  res.status(StatusCodes.OK).json(article);
};

const getAllArticles = async (req, res) => {
  const articles = await Article.find({});

  res.status(StatusCodes.OK).json({ articles, amount: articles.length });
};

const createArticle = async (req, res) => {
  const { title, date, imageSrc, imageId, introduction, description, alt } =
    req.body.data;
  if (
    !title ||
    !date ||
    !imageSrc ||
    !imageId ||
    !introduction ||
    !description ||
    !alt
  ) {
    await cloudinary.uploader.destroy(req.body.data.imageId); // delete image from cloudinary if error occurs
    throw new CustomErrors.BadRequestError(
      "Proszę podać tytuł, datę, wstęp i treść artykułu oraz dodać zdjęcie wraz z jego opisem"
    );
  }

  const articleObject = {
    title,
    date,
    imageSrc,
    imageId,
    introduction,
    description,
    alt,
  };

  await Article.create(articleObject);

  res.status(StatusCodes.CREATED).json({ msg: "Success!" });
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Article.findOneAndDelete({ _id: id });

  if (!article)
    throw new CustomErrors.NotFoundError(
      "Nie znaleziono zwierzęcia o podanym id"
    );

  const imageId = "photos" + article.imageSrc.split("/photos")[1].split(".")[0];

  await cloudinary.uploader.destroy(imageId);

  res.status(200).json({ msg: "Success!" });
};

const updateArticle = async (req, res) => {
  res.send("Update Article");
};

module.exports = {
  getArticle,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
