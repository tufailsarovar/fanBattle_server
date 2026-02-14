// server/src/routes/adminRoutes.js

import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

/**
 * @desc    Register Admin (initial setup or protected usage)
 * @route   POST /api/admin/register
 */
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Admin Login
 * @route   POST /api/admin/login
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get Admin Profile
 * @route   GET /api/admin/profile
 */
router.get("/profile", adminAuth, async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
});

export default router;
