import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ================= CORS FIX ================= */
app.use(
  cors({
    origin: [
      "https://fan-battle.vercel.app",
    ],
    credentials: true,
  })
);

/* =========================================== */

app.use(express.json());

/* Test Route */
app.get("/", (req, res) => {
  res.send("FanBattle API Running");
});

/* Your Routes */
import adminRoutes from "./routes/adminRoutes.js";
import followerRoutes from "./routes/followerRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import removalRoutes from "./routes/removalRoutes.js";



app.use("/api/analytics", analyticsRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/removal", removalRoutes);

export default app;
