const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    zealId: { type: String, required: true },
    email: { type: String, required: true },
    teamId: { type: String, required: false},
    avatarId: { type: String, required: false, default: null },
    score: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
