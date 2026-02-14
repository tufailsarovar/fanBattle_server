// server/src/controllers/followerController.js

import Follower from "../models/Follower.js";
import Like from "../models/Like.js";
import { calculateTier } from "../utils/calculateTier.js";

/**
 * @desc    Get all followers (paginated)
 * @route   GET /api/followers
 */
export const getFollowers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      Follower.find()
        .sort({ likesCount: -1 })
        .skip(skip)
        .limit(limit),
      Follower.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: followers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single follower by username
 * @route   GET /api/followers/:username
 */
export const getFollowerByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const follower = await Follower.findOne({ username });

    if (!follower) {
      return res.status(404).json({
        success: false,
        message: "Follower not found",
      });
    }

    const rank =
      (await Follower.countDocuments({
        likesCount: { $gt: follower.likesCount },
      })) + 1;

    res.status(200).json({
      success: true,
      data: {
        ...follower.toObject(),
        rankPosition: rank,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search followers by name or username
 * @route   GET /api/followers/search?q=
 */
export const searchFollowers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const followers = await Follower.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ likesCount: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's new followers
 * @route   GET /api/followers/today
 */
export const getTodayFollowers = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const followers = await Follower.find({
      createdAt: { $gte: today },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new follower (Admin)
 * @route   POST /api/followers
 */
export const createFollower = async (req, res, next) => {
  try {
    const { name, username } = req.body;

    const exists = await Follower.findOne({ username });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Follower already exists",
      });
    }

    const follower = await Follower.create({
      name,
      username,
      likesCount: 0,
      rankTier: "Bronze",
    });

    res.status(201).json({
      success: true,
      data: follower,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update follower (Admin)
 * @route   PUT /api/followers/:id
 */
export const updateFollower = async (req, res, next) => {
  try {
    const { id } = req.params;

    const follower = await Follower.findById(id);
    if (!follower) {
      return res.status(404).json({
        success: false,
        message: "Follower not found",
      });
    }

    follower.name = req.body.name || follower.name;
    follower.username = req.body.username || follower.username;

    await follower.save();

    res.status(200).json({
      success: true,
      data: follower,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete follower (Admin)
 * @route   DELETE /api/followers/:id
 */
export const deleteFollower = async (id) => {
  const token = localStorage.getItem("adminToken");

  return axios.delete(`${API}/followers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

