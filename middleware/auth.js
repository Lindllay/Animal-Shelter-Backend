require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    throw new UnauthorizedError("Authentication invalid");
  }
};

module.exports = authenticationMiddleware;
