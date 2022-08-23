const jwt = require("jsonwebtoken");
require("dotenv").config;

module.exports = function (req, res, next) {
  if (!token) {
    return res
      .status(400)
      .json({ Warning: "There is no token, please login." });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded.user;
  } catch (err) {
    res
      .status(401)
      .json({ Warning: "This token does not have the proper authorization." });
  }
};
