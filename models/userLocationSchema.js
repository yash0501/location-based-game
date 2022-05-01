const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userLocationSchema = new Schema({
  userId: { type: String, required: true },
  zealId: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  time: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

module.exports = mongoose.model("UserLocation", userLocationSchema);
