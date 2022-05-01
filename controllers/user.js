const config = require("../config");
const mongoose = require("mongoose");
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = models.User;
const Score = models.Score;
const JWT_SECRET = config.JWT_SECRET;

const userController = {
  async register(req, res, next) {
    const { password, name, zealId, email, avatarId } = req.body;
    if (!password || !name || !zealId || !email || !avatarId) {
      console.log("missing fields");
      return res.status(400).json({ msg: "Please fill out all fields" });
    }
    if (!password.length >= 8) {
      console.log("password too short");
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });
    }

    try {
      // User not exist already
      const user = await User.findOne({ zealId });
      if (user) {
        console.log("User already exist");
        res.status(400).json({ msg: "Username already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const teamIds = [123, 456, 789, 135];

      let rand = Math.floor(Math.random() * 100)%4;
      console.log(rand);
      console.log(teamIds[rand]);
      const teamId = teamIds[rand];

      // Create new user
      const newUser = new User({
        password: hashedPassword,
        name,
        zealId,
        email,
        avatarId,
        teamId: String(teamId),
      });

      // Save user to database
      await newUser.save();
      /*
      const score = new Score({
        userId: newUser._id,
        zealId: newUser.zealId,
        name: newUser.name,
      });

      await score.save();
*/
      // Create token
      const token = jwt.sign(
        {
          user: {
            id: newUser._id,
            name: newUser.name,
            zealId: newUser.zealId,
            email: newUser.email,
            avatarId: newUser.avatarId,
          },
        },
        JWT_SECRET
      );

      // Send response
      console.log("User created");
      console.log(newUser);
      console.log(token);
      res.status(201).json({
        msg: "User created successfully",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          zealId: newUser.zealId,
          email: newUser.email,
          avatarId: newUser.avatarId,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  async login(req, res, next) {
    const { zealId, password } = req.body;
    try {
      if (!zealId || !password) {
        console.log("missing fields");
        return res.status(400).json({ msg: "Please fill out all fields" });
      }

      const user = await User.findOne({ zealId });
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ msg: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password incorrect");
        return res.status(400).json({ msg: "Incorrect password" });
      }

      const token = jwt.sign(
        {
          user: {
            id: user._id,
            name: user.name,
            zealId: user.zealId,
            email: user.email,
          },
        },
        JWT_SECRET
      );

      console.log("User logged in");
      console.log(user);
      console.log(token);
      res.status(200).json({
        msg: "User logged in successfully",
        token,
        user: user,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  async logout(req, res, next) {
    try {
      res.status(200).json({ msg: "User logged out successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  async getUser(req, res, next) {
    const { zealId } = req.body;
    try {
      const user = await User.findOne({ zealId });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  async updateUser(req, res, next) {
    const { zealId, name, email, avatarId } = req.body;
    try {
      const user = await User.findOne({ zealId });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const updatedUser = await User.findOneAndUpdate(
        { zealId },
        {
          name,
          email,
          avatarId,
        },
        { new: true }
      );
      res
        .status(200)
        .json({ msg: "User updated successfully", user: updatedUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
