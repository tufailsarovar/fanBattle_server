import express from "express";
import {
  getTop10AllTime,
  getDailyTop10,
  getWeeklyTop10,
  getMonthlyTop10,
  getTop100Subscribers,
  getFullLeaderboard,
  getSubscribersLeaderboard,
} from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/top10", getTop10AllTime);
router.get("/daily", getDailyTop10);
router.get("/weekly", getWeeklyTop10);
router.get("/monthly", getMonthlyTop10);
router.get("/top100", getTop100Subscribers);
router.get("/", getFullLeaderboard);
router.get("/subscribers", getSubscribersLeaderboard);


export default router;
