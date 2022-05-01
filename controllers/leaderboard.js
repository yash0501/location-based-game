const models = require("../models");
const Score = models.Score;
const User = models.User;

const leaderboardController = {
  async getLeaderboard(req, res, next) {
    try {
      const users = await User.find({}).sort({ score: -1 });
      console.log(users);
      res.status(200).json(users);
      /*
      const scores = await Score.find({}).sort({ score: -1 });
      console.log(scores);
      res.status(200).json(scores);
      */
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  },
};

module.exports = leaderboardController;
