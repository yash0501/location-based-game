const jwt = require("jsonwebtoken");
const config = require("../config");
const JWT_SECRET = config.JWT_SECRET;

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
