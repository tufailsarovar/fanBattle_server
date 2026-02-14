// server/src/routes/followerRoutes.js

import express from "express";
import {
  getFollowers,
  getFollowerByUsername,
  searchFollowers,
  getTodayFollowers,
  createFollower,
  updateFollower,
  deleteFollower,
} from "../controllers/followerController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

/**
 * @desc    Get all followers (paginated)
 * @route   GET /api/followers
 */
router.get("/", getFollowers);

/**
 * @desc    Search followers
 * @route   GET /api/followers/search?q=
 */
router.get("/search", searchFollowers);

/**
 * @desc    Get today's new followers
 * @route   GET /api/followers/today
 */
router.get("/today", getTodayFollowers);

/**
 * @desc    Get single follower by username
 * @route   GET /api/followers/:username
 */
router.get("/:username", getFollowerByUsername);

/**
 * @desc    Create new follower (Admin)
 * @route   POST /api/followers
 */
router.post("/", adminAuth, createFollower);

/**
 * @desc    Update follower (Admin)
 * @route   PUT /api/followers/:id
 */
router.put("/:id", adminAuth, updateFollower);

/**
 * @desc    Delete follower (Admin)
 * @route   DELETE /api/followers/:id
 */
router.delete("/:id", adminAuth, deleteFollower);

export default router;
