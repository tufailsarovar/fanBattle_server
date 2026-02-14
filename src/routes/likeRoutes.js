// server/src/routes/likeRoutes.js

import express from "express";
import { likeFollower } from "../controllers/likeController.js";
import { likeRateLimiter } from "../middlewares/rateLimiter.js";
import { verifyUsername } from "../middlewares/verifyUsername.js";

const router = express.Router();

/**
 * @desc    Like a follower card
 * @route   POST /api/likes
 * @body    { likerUsername, targetFollowerId }
 */
router.post(
  "/",
  likeRateLimiter,
  verifyUsername,     // verifies likerUsername exists in followers
  likeFollower
);

export default router;
