// server/src/utils/calculateRank.js

import Follower from "../models/Follower.js";

/**
 * @desc    Calculate rank based on likesCount
 * @param   likesCount (Number)
 * @returns rank (Number)
 */
export const calculateRank = async (likesCount) => {
  if (typeof likesCount !== "number") {
    throw new Error("likesCount must be a number");
  }

  const higherCount = await Follower.countDocuments({
    likesCount: { $gt: likesCount },
  });

  return higherCount + 1;
};

/**
 * @desc    Calculate rank by followerId
 * @param   followerId (ObjectId)
 * @returns rank (Number)
 */
export const calculateRankById = async (followerId) => {
  const follower = await Follower.findById(followerId);

  if (!follower) {
    throw new Error("Follower not found");
  }

  return await calculateRank(follower.likesCount);
};
