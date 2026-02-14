// server/src/models/Follower.js

import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rankTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      default: "Bronze",
    },
    isSubscriber: {
      type: Boolean,
      default: false,
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for leaderboard sorting
followerSchema.index({ likesCount: -1 });

// Virtual field for dynamic rank position (optional usage)
followerSchema.virtual("rankPosition", {
  ref: "Follower",
  localField: "likesCount",
  foreignField: "likesCount",
  justOne: false,
});

export default mongoose.model("Follower", followerSchema);
