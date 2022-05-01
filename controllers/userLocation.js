const models = require("../models");
const User = models.User;
const Score = models.Score;
const UserLocation = models.UserLocation;
const Team = models.Team;
const config = require("../config");
const geolib = require("geolib");

const userLocationController = {
  async setUserLocation(req, res, next) {
    const { lat, long, zealId, userId } = req.body;
    if (!userId || !zealId || !lat || !long) {
      return res.status(400).json({ msg: "Please fill out all fields" });
    }

    try {
      const user = await UserLocation.findOne({ userId });
      if (user) {
        const updateLocation = await UserLocation.findOneAndUpdate(
          { userId },
          {
            userId,
            zealId,
            lat,
            long,
            time: Date.now(),
            updatedAt: Date.now(),
          }
        );
        console.log(updateLocation);
        res.status(200).json(updateLocation);
      } else {
        const newUserLocation = new UserLocation({
          userId,
          zealId,
          lat,
          long,
          time: Date.now(),
          updatedAt: Date.now(),
        });
        await newUserLocation.save();
        console.log(newUserLocation);
        res.status(200).json(newUserLocation);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  },

  async getNearest(req, res, next) {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ msg: "Please fill out all fields" });
    }
    try {
      const user = await UserLocation.findOne({ userId });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const teamId = user.teamId;
      const team = await Team.findOne({ _id: teamId });
      if (!team) {
        return res.status(404).json({ msg: "Team not found" });
      }
      const members = await User.find({ teamId: team._id });
      if (!members) {
        return res.status(404).json({ msg: "Team not found" });
      }
      // console.log(members);
      const userLoc = await UserLocation.findOne({ userId });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const userLocation = {
        lat: userLoc.lat,
        long: userLoc.long,
      };
      console.log(userLocation);
      let coordinates = [];

      for (let i = 0; i < members.length; i++) {
        if (members[i]._id !== userId) {
          const mId = members[i]._id;
          const mUser = await UserLocation.findOne({ userId: mId });
          const mLocation = {
            latitude: mUser.lat,
            longitude: mUser.long,
          };
          coordinates.push(mLocation);
        }
      }

      console.log(coordinates);

      const nearest = geolib.orderByDistance(
        {
          latitude: userLocation.lat,
          longitude: userLocation.long,
        },
        coordinates
      );
      console.log(nearest);
      return res.status(200).json(nearest);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  },
};

module.exports = userLocationController;
