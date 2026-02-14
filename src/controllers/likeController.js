import Follower from "../models/Follower.js";
import Like from "../models/Like.js";
import Subscriber from "../models/Subscriber.js";

export const likeFollower = async (req, res) => {
  try {
    const likerUsername = req.body?.likerUsername
      ?.trim()
      ?.replace(/^@/, "")
      ?.toLowerCase();

    const targetFollowerId = req.body?.targetFollowerId;

    if (!likerUsername || !targetFollowerId) {
      return res.status(400).json({ message: "Username required" });
    }

    // ✅ check subscriber first
    const subscriber = await Subscriber.findOne({
      username: likerUsername,
    });

    if (!subscriber) {
      return res.status(403).json({ message: "Only subscribers can like" });
    }

    // ✅ find follower card by ID
    const follower = await Follower.findById(targetFollowerId);

    if (!follower) {
      return res.status(404).json({ message: "Follower not found" });
    }

    const ip = req.ip;

    const existing = await Like.findOne({
      targetFollowerId: follower._id,
      likerUsername: likerUsername,
    });

    if (existing) {
      return res.status(400).json({ message: "Already liked" });
    }

    await Like.create({
      targetFollowerId: follower._id,
      likerUsername: likerUsername,
      ipAddress: ip,
    });

    follower.likesCount += 1;
    await follower.save();

    res.json({
      success: true,
      followerId: follower._id,
      likesCount: follower.likesCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
