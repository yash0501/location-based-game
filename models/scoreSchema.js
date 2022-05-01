const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  zealId: { type: String, required: true, unique: true },
  score: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Score", scoreSchema);
