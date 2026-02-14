// server/src/utils/calculateTier.js

/**
 * @desc    Calculate rank tier based on likes count
 * @param   likesCount (Number)
 * @returns tier (String)
 */

export const calculateTier = (likesCount) => {
  if (typeof likesCount !== "number") {
    throw new Error("likesCount must be a number");
  }

  if (likesCount >= 5000) return "Diamond";
  if (likesCount >= 1000) return "Platinum";
  if (likesCount >= 500) return "Gold";
  if (likesCount >= 100) return "Silver";
  return "Bronze";
};
