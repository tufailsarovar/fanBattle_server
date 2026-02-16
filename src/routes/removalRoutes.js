import express from "express";
import {
  createRemovalRequest,
  getRemovalRequests,
  deleteRemovalRequest,
} from "../controllers/removalController.js";

const router = express.Router();

router.post("/", createRemovalRequest);
router.get("/", getRemovalRequests);
router.delete("/:id", deleteRemovalRequest);

export default router;   // ✅ THIS LINE MUST EXIST
