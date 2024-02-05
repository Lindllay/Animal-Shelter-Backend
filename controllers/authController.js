const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide email and password");

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const token = user.createJWT();
  const { role } = user;

  res.status(StatusCodes.OK).json({ token, role });
};

const logout = async (req, res) => {
  res.send("Logout");
};

const dashboard = async (req, res) => {
  if (req.user.role !== "demo" || "admin") res.status(StatusCodes.FORBIDDEN);

  res.status(StatusCodes.OK).json({ role: req.user.role });
};

module.exports = { login, logout, dashboard };
