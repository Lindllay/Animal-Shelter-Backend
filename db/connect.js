const mongoose = require("mongoose");

const connectDB = (connectionString) => {
	mongoose.set("strictQuery", true);
	return mongoose.connect(connectionString);
};

module.exports = connectDB;
