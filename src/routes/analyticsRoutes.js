import express from "express";
import Follower from "../models/Follower.js";
import Subscriber from "../models/Subscriber.js";
import Like from "../models/Like.js";
import { getTotalLikes } from "../controllers/analyticsController.js";


const router = express.Router();

// =============================
// OVERVIEW STATS
// =============================
router.get("/overview", async (req, res) => {
  try {
    const totalFollowers = await Follower.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();
    const totalLikes = await Like.countDocuments();

    res.json({
      totalFollowers,
      totalSubscribers,
      totalLikes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/total-likes", getTotalLikes);

// =============================
// 🔥 TOTAL LIKES (FOR LIVE BANNER)
// =============================
router.get("/total-likes", async (req, res) => {
  try {
    const totalLikes = await Like.countDocuments();
    res.json({ totalLikes });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// FOLLOWERS GROWTH
// =============================
router.get("/followers-growth", async (req, res) => {
  try {
    const data = await Follower.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// LIKES GROWTH
// =============================
router.get("/likes-growth", async (req, res) => {
  try {
    const data = await Like.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// SUBSCRIBERS GROWTH
// =============================
router.get("/subscribers-growth", async (req, res) => {
  try {
    const data = await Subscriber.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;