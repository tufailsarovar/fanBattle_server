// server/src/models/Subscriber.js

import mongoose from "mongoose";


const subscriberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscriber", subscriberSchema);
