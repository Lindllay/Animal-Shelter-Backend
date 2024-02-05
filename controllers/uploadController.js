const CustomError = require("../errors");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("../lib/cloudinary");

const uploadImage = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new CustomError.UnauthorizedError(
      "Access to this resource on the server is denied"
    );
  }
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const image = req.files.image;

  if (!image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  if (image.size > 1024 * 1024 * 1024) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: false,
    folder: "photos",
  });
  fs.unlinkSync(image.tempFilePath);

  const srcSmall = result.secure_url
    .split("upload/")
    .join("upload/c_fill,w_300,h_300,ar_1:1,g_auto/");

  return res.status(StatusCodes.OK).json({
    image: { src: result.secure_url, srcSmall, public_id: result.public_id },
  });
};

module.exports = {
  uploadImage,
};
