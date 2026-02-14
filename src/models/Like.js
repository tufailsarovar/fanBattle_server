// server/src/models/Like.js

import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likerUsername: {
      type: String,
      required: [true, "Liker username is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    targetFollowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Follower",
      required: [true, "Target follower ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint → one like per username per follower card
likeSchema.index(
  { likerUsername: 1, targetFollowerId: 1 },
  { unique: true }
);

export default mongoose.model("Like", likeSchema);
