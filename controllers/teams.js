const models = require("../models");
const User = models.User;
const Score = models.Score;
const UserLocation = models.UserLocation;
const Team = models.Team;
const config = require("../config");

const teamsController = {
  async createTeam(req, res, next) {
    const { memberCount, teamCount } = req.body;
    try {
      const users = await User.find({});
      let i = 0,
        j = 0,
        mCount = memberCount;
      for (i = 0; i < teamCount; i++) {
        const team = new Team({
          members: [],
        });
        for (j = 0; j < mCount; j++) {
          console.log(users[i + j * teamCount]._id);
          team.members.push({
            userId: users[i + j * teamCount]._id,
            zealId: users[i + j * teamCount].zealId,
          });
        }
        await team.save();
        console.log(team);
        console.log("mCount");
        console.log(mCount);

        for (j = 0; j < mCount; j++) {
          console.log("update user");
          await User.findOneAndUpdate(
            { _id: users[i + j * teamCount]._id },
            {
              teamId: team._id,
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log(err);
              }
              console.log(doc);
            }
          ).clone();
          console.log(users[i + j * teamCount].zealId);
        }
      }
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Server error" });
    }
  },
};

module.exports = teamsController;
