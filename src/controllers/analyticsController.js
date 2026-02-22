// server/src/controllers/analyticsController.js

import Follower from "../models/Follower.js";
import Like from "../models/Like.js";
import Subscriber from "../models/Subscriber.js";
import mongoose from "mongoose";

/**
 * @desc    Get overall platform stats
 * @route   GET /api/analytics/overview
 */
export const getOverviewStats = async (req, res, next) => {
  try {
    const [totalFollowers, totalSubscribers, totalLikes] = await Promise.all([
      Follower.countDocuments(),
      Subscriber.countDocuments(),
      Like.countDocuments(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newFollowersToday = await Follower.countDocuments({
      createdAt: { $gte: today },
    });

    const newSubscribersToday = await Subscriber.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      data: {
        totalFollowers,
        totalSubscribers,
        totalLikes,
        newFollowersToday,
        newSubscribersToday,
      },
    });
  } catch (error) {
    next(error);
  }
};
// =============================
// TOTAL LIKES (FOR LIVE BANNER)
// =============================
export const getTotalLikes = async (req, res) => {
  try {
    const totalLikes = await Like.countDocuments();
    res.json({ totalLikes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * @desc    Get likes growth (last 30 days)
 * @route   GET /api/analytics/likes-growth
 */
export const getLikesGrowth = async (req, res, next) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const likes = await Like.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalLikes: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: likes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get follower growth (last 30 days)
 * @route   GET /api/analytics/followers-growth
 */
export const getFollowersGrowth = async (req, res, next) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const followers = await Follower.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalFollowers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get subscriber growth (last 30 days)
 * @route   GET /api/analytics/subscribers-growth
 */
export const getSubscribersGrowth = async (req, res, next) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const subscribers = await Subscriber.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalSubscribers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get most liked followers (Top 10)
 * @route   GET /api/analytics/top-followers
 */
export const getTopFollowersAnalytics = async (req, res, next) => {
  try {
    const topFollowers = await Follower.find()
      .sort({ likesCount: -1 })
      .limit(10)
      .select("name username likesCount rankTier");

    res.status(200).json({
      success: true,
      data: topFollowers,
    });
  } catch (error) {
    next(error);
  }
};
