const models = require("../models");
const Score = models.Score;
const User = models.User;
const UserLocation = models.UserLocation;
const Team = models.Team;
const MatchedUser = models.MatchedUser;
const config = require("../config");
const geolib = require("geolib");

const updateScoreController = {
  async updateScore(req, res, next) {
    const { userId1, userId2 } = req.body;
    if (!userId1 || !userId2) {
      console.log("userId1 or userId2 is missing");
      return res.status(400).json({ msg: "Please fill out all fields" });
    }
    console.log(userId1, userId2);
    if (
      !userId1.match(/^[0-9a-fA-F]{24}$/) ||
      !userId2.match(/^[0-9a-fA-F]{24}$/)
    ) {
      console.log("userId1 or userId2 is not valid");
      return res.status(400).json({ msg: "obejct id not correct" });
    }
    try {
      console.log(userId1);
      console.log(userId2);
      const user1 = await User.findOne({ _id: String(userId1) });
      const user2 = await User.findOne({ _id: String(userId2) });
      console.log(user1);
      console.log(user2);
      if (!user1 || !user2) {
        console.log("user1 or user2 is missing");
        return res.status(404).json({ msg: "User not found" });
      }
      if(user1.teamId==null || user2.teamId==null){
        console.log("not in team");
        return res.status(404).json({ msg: "User not in team" });
      }
      const match1 = await MatchedUser.findOne({
        userId1: userId1,
        userId2: userId2,
      });
      const match2 = await MatchedUser.findOne({
        userId1: userId2,
        userId2: userId1,
      });
      console.log(match1);
      console.log(match2);
      if (match1 || match2) {
        console.log("user1 or user2 is matched, scan already done");
        return res
          .status(400)
          .json({ msg: "User is matched, scan already done" });
      }
      if (user1.teamId !== user2.teamId) {
        console.log("user1 and user2 are not in the same team");
        return res.status(400).json({ msg: "User are not in the same team" });
      }
      // update score
      const updateUser1 = await User.findOneAndUpdate(
        { _id: userId1 },
        { $inc: { score: 1 } },
        { new: true }
      );
      const updateUser2 = await User.findOneAndUpdate(
        { _id: userId2 },
        { $inc: { score: 1 } },
        { new: true }
      );
      console.log(updateUser1);
      console.log(updateUser2);

      /*const score1 = await Score.findOne({ userId: userId1 });
      const score2 = await Score.findOne({ userId: userId2 });
      if (!score1 || !score2) {
        console.log("score1 or score2 is missing");
        return res.status(404).json({ msg: "Score not found" });
      }
      const newScore1 = await Score.findOneAndUpdate(
        { userId: userId1 },
        {
          userId: userId1,
          username: user1.username,
          score: score1.score + 1,
          updatedAt: Date.now(),
        }
      );
      const newScore2 = await Score.findOneAndUpdate(
        { userId: userId2 },
        {
          userId: userId2,
          username: user2.username,
          score: score2.score + 1,
          updatedAt: Date.now(),
        }
      );
      */
      const newMatchedUser = new MatchedUser({
        userId1: userId1,
        userId2: userId2,
        updatedAt: Date.now(),
      });
      await newMatchedUser.save();
      // console.log(newScore1);
      // console.log(newScore2);
      console.log(newMatchedUser);
      res.status(200).json({ msg: "Score updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  },
};

module.exports = updateScoreController;
