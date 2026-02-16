import Follower from "../models/Follower.js";
import Like from "../models/Like.js";

const calculateTier = (likes) => {
  if (likes >= 1000) return "platinum";
  if (likes >= 500) return "gold";
  if (likes >= 200) return "silver";
  if (likes >= 50) return "bronze";
  return "new";
};

/**
 * Get Top 10 (All-Time)
 */
export const getTop10AllTime = async (req, res, next) => {
  try {
    const followers = await Follower.find()
      .sort({ likesCount: -1 })   // ✅ SORT BY LIKES DESC
      .limit(10);

    const ranked = followers.map((f, index) => ({
      ...f.toObject(),
      rank: index + 1,
      rankTier: calculateTier(f.likesCount),
    }));

    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};


/**
 * Get Daily Top 10
 */
export const getDailyTop10 = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const likes = await Like.aggregate([
      { $match: { createdAt: { $gte: today } } },
      {
        $group: {
          _id: "$targetFollowerId",
          totalLikes: { $sum: 1 },
        },
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 10 },
    ]);

    const ranked = [];

    for (let i = 0; i < likes.length; i++) {
      const follower = await Follower.findById(likes[i]._id);
      if (!follower) continue;

      ranked.push({
        ...follower.toObject(),
        likesCount: likes[i].totalLikes,
        rank: i + 1,
        rankTier: calculateTier(likes[i].totalLikes),
      });
    }

    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Weekly Top 10
 */
export const getWeeklyTop10 = async (req, res, next) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const likes = await Like.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: "$targetFollowerId",
          totalLikes: { $sum: 1 },
        },
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 10 },
    ]);

    const ranked = [];

    for (let i = 0; i < likes.length; i++) {
      const follower = await Follower.findById(likes[i]._id);
      if (!follower) continue;

      ranked.push({
        ...follower.toObject(),
        likesCount: likes[i].totalLikes,
        rank: i + 1,
        rankTier: calculateTier(likes[i].totalLikes),
      });
    }

    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Monthly Top 10
 */
export const getMonthlyTop10 = async (req, res, next) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const likes = await Like.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: "$targetFollowerId",
          totalLikes: { $sum: 1 },
        },
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 10 },
    ]);

    const ranked = [];

    for (let i = 0; i < likes.length; i++) {
      const follower = await Follower.findById(likes[i]._id);
      if (!follower) continue;

      ranked.push({
        ...follower.toObject(),
        likesCount: likes[i].totalLikes,
        rank: i + 1,
        rankTier: calculateTier(likes[i].totalLikes),
      });
    }

    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Top 100 Subscribers
 */
export const getTop100Subscribers = async (req, res, next) => {
  try {
    const followers = await Follower.find({ isSubscriber: true })
      .sort({ likesCount: -1 })
      .limit(100);

    const ranked = followers.map((f, index) => ({
      ...f.toObject(),
      rank: index + 1,
      rankTier: calculateTier(f.likesCount),
    }));

    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Full Leaderboard (All Fans)
 */
export const getFullLeaderboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // 1️⃣ Fetch latest followers (for arrangement)
    const [latestFollowers, total] = await Promise.all([
      Follower.find()
        .sort({ createdAt: -1 }) // latest on top
        .skip(skip)
        .limit(limit),
      Follower.countDocuments(),
    ]);

    // 2️⃣ Fetch all followers sorted by likes (for ranking logic)
    const allSortedByLikes = await Follower.find().sort({
      likesCount: -1,
    });

    // 3️⃣ Create ranking map based on likes
    const rankMap = {};
    allSortedByLikes.forEach((f, index) => {
      rankMap[f._id.toString()] = index + 1;
    });

    // 4️⃣ Attach correct rank & tier
    const ranked = latestFollowers.map((f) => ({
      ...f.toObject(),
      rank: rankMap[f._id.toString()],
      rankTier: calculateTier(f.likesCount),
    }));

    res.status(200).json({
      success: true,
      data: ranked,
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
 * Get Subscribers Leaderboard
 */
export const getSubscribersLeaderboard = async (req, res, next) => {
  try {
    const followers = await Follower.find({ isSubscriber: true }).sort({
      likesCount: -1,
    });

    const ranked = followers.map((f, index) => ({
      ...f.toObject(),
      rank: index + 1,
      rankTier: calculateTier(f.likesCount), // ✅ REQUIRED
    }));

    res.status(200).json({
      success: true,
      data: ranked,
    });
  } catch (error) {
    next(error);
  }
};
