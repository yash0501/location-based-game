const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/index");

const userController = controller.userController;
const teamsController = controller.teamsController;
const userLocationController = controller.userLocationController;
const leaderboardController = controller.leaderboardController;
const updateScoreController = controller.updateScoreController;

router.post("/register", userController.register); // done
router.post("/login", userController.login); // done
router.post("/user", userController.getUser); // done
router.post("/logout", userController.logout); // done
router.post("/updateUser", userController.updateUser); // done

router.post("/setUserLocation", userLocationController.setUserLocation); // done
router.post("/getNearest", userLocationController.getNearest); // done

router.get("/getLeaderboard", leaderboardController.getLeaderboard); // done

router.post("/updateScore", updateScoreController.updateScore); // done

router.post("/createTeam", teamsController.createTeam); // done

module.exports = router;
