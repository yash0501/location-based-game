const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchedUserSchema = new Schema(
  {
    userId1: { type: String, required: true },
    userId2: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MatchedUser", matchedUserSchema);
