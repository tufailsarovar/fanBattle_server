// server/src/services/rankService.js

import Follower from "../models/Follower.js";

/**
 * @desc    Calculate rank position of a follower
 * @param   followerId
 * @returns rank number
 */
export const calculateRankPosition = async (followerId) => {
  const follower = await Follower.findById(followerId);

  if (!follower) {
    throw new Error("Follower not found");
  }

  const higherCount = await Follower.countDocuments({
    likesCount: { $gt: follower.likesCount },
  });

  return higherCount + 1;
};

/**
 * @desc    Recalculate and update all follower ranks (optional utility)
 */
export const recalculateAllRanks = async () => {
  const followers = await Follower.find().sort({ likesCount: -1 });

  let rank = 1;

  for (const follower of followers) {
    follower.rankPosition = rank;
    await follower.save();
    rank++;
  }

  return { success: true, message: "All ranks recalculated" };
};
