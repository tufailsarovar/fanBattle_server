// server/src/services/tierService.js

/**
 * @desc    Determine rank tier based on likes count
 * @param   likesCount (Number)
 * @returns tier (String)
 */

export const getRankTier = (likesCount) => {
  if (likesCount >= 5000) return "Diamond";
  if (likesCount >= 1000) return "Platinum";
  if (likesCount >= 500) return "Gold";
  if (likesCount >= 100) return "Silver";
  return "Bronze";
};

/**
 * @desc    Update follower tier if needed
 * @param   follower (Mongoose Document)
 */

export const updateFollowerTier = async (follower) => {
  const newTier = getRankTier(follower.likesCount);

  if (follower.rankTier !== newTier) {
    follower.rankTier = newTier;
    await follower.save();
  }

  return follower.rankTier;
};
