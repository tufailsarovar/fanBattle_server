// server/src/middlewares/verifyUsername.js

import Follower from "../models/Follower.js";

/**
 * @desc    Middleware to verify if Instagram username exists in followers collection
 *          Can be used for like / subscribe protection
 */
export const verifyUsername = async (req, res, next) => {
  try {
    const username =
      req.body.username || req.body.likerUsername || req.params.username;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const follower = await Follower.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });

    if (!follower) {
      return res.status(403).json({
        success: false,
        message: "Only valid followers are allowed",
      });
    }

    req.follower = follower; // attach follower to request
    next();
  } catch (error) {
    next(error);
  }
};
