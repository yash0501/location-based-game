const dotenv = require("dotenv");
dotenv.config();

const { PORT, DB_URL, JWT_SECRET } = process.env;

module.exports = {
  PORT,
  DB_URL,
  JWT_SECRET,
};
