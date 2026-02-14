// server/src/routes/subscriberRoutes.js

import express from "express";
import {
  subscribeUser,
  getSubscriberCount,
  getAllSubscribers,
  removeSubscriber,
} from "../controllers/subscriberController.js";
import { subscribeRateLimiter } from "../middlewares/rateLimiter.js";
import { verifyUsername } from "../middlewares/verifyUsername.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

/**
 * @desc    Subscribe user (adds blue tick)
 * @route   POST /api/subscribers
 * @body    { username }
 */
router.post(
  "/",
  subscribeRateLimiter,
  verifyUsername,
  subscribeUser
);

/**
 * @desc    Get total subscriber count
 * @route   GET /api/subscribers/count
 */
router.get("/count", getSubscriberCount);

/**
 * @desc    Get all subscribers (Admin)
 * @route   GET /api/subscribers
 */
router.get("/", adminAuth, getAllSubscribers);

/**
 * @desc    Remove subscriber (Admin)
 * @route   DELETE /api/subscribers/:id
 */
router.delete("/:id", adminAuth, removeSubscriber);

export default router;
