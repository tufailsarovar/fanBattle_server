import express from "express";
import {
  createRemovalRequest,
  getRemovalRequests,
} from "../controllers/removalController.js";

const router = express.Router();

router.post("/", createRemovalRequest);
router.get("/", getRemovalRequests); // protect with admin middleware if needed

export default router;
