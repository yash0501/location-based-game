const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  members: [
    {
      userId: { type: String, required: true, unique: true },
      zealId: { type: String, required: true, unique: true },
    },
  ],
});

module.exports = mongoose.model("Team", teamSchema);
