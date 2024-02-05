require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();

// additional packages
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// database
const connectDB = require("./db/connect");

// routers

const animalRouter = require("./routes/animalRoutes");
const authRouter = require("./routes/authRoutes");
const articleRouter = require("./routes/articleRoutes");
const uploadRouter = require("./routes/uploadRoutes");

// middleware

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// controllers

app.use(express.json({ limit: "5mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "5mb", parameterLimit: 50000 })
);
app.use(cors());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));
app.use(morgan("tiny"));

app.use("/api/v1/animals", animalRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(5000, async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Server is listening on port 5000...");
  } catch (err) {
    console.log(err);
  }
});
