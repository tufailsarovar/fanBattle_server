// server/src/utils/constants.js

/**
 * Rank Tier Thresholds
 */
export const RANK_TIERS = {
  BRONZE: { name: "Bronze", min: 0, max: 99 },
  SILVER: { name: "Silver", min: 100, max: 499 },
  GOLD: { name: "Gold", min: 500, max: 999 },
  PLATINUM: { name: "Platinum", min: 1000, max: 4999 },
  DIAMOND: { name: "Diamond", min: 5000, max: Infinity },
};

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

/**
 * Leaderboard Limits
 */
export const LEADERBOARD_LIMITS = {
  TOP_10: 10,
  DAILY: 10,
  WEEKLY: 10,
  MONTHLY: 10,
};

/**
 * Socket Events
 */
export const SOCKET_EVENTS = {
  LIKE_UPDATED: "likeUpdated",
  SUBSCRIBER_UPDATED: "subscriberUpdated",
};

/**
 * Rate Limit Settings
 */
export const RATE_LIMITS = {
  API_WINDOW_MS: 15 * 60 * 1000,
  API_MAX: 300,

  LIKE_WINDOW_MS: 10 * 60 * 1000,
  LIKE_MAX: 20,

  SUBSCRIBE_WINDOW_MS: 10 * 60 * 1000,
  SUBSCRIBE_MAX: 10,
};
