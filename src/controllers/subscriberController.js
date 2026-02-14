// server/src/controllers/subscriberController.js

import Subscriber from "../models/Subscriber.js";
import Follower from "../models/Follower.js";

/**
 * @desc    Subscribe a follower (adds blue tick)
 * @route   POST /api/subscribers
 */
export const subscribeUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // Check if follower exists
    const follower = await Follower.findOne({ username });
    if (!follower) {
      return res.status(404).json({
        success: false,
        message: "Follower not found",
      });
    }

    // Prevent duplicate subscription
    const existingSubscriber = await Subscriber.findOne({ username });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed",
      });
    }

    // Create subscriber
    const subscriber = await Subscriber.create({
      username,
    });

    // Update follower blue tick
    follower.isSubscriber = true;
    await follower.save();

    // Emit real-time subscriber count update
    if (req.io) {
      const totalSubscribers = await Subscriber.countDocuments();
      req.io.emit("subscriberUpdated", {
        totalSubscribers,
        username,
      });
    }

    res.status(201).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get total subscribers count
 * @route   GET /api/subscribers/count
 */
export const getSubscriberCount = async (req, res, next) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all subscribers (Admin)
 * @route   GET /api/subscribers
 */
export const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove subscriber (Admin)
 * @route   DELETE /api/subscribers/:id
 */
export const removeSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    // Remove blue tick from follower
    const follower = await Follower.findOne({ username: subscriber.username });
    if (follower) {
      follower.isSubscriber = false;
      await follower.save();
    }

    await subscriber.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscriber removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
