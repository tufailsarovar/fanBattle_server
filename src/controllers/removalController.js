import RemovalRequest from "../models/RemovalRequest.js";

/**
 * Submit removal request
 */
export const createRemovalRequest = async (req, res) => {
  try {
    const { name, username, email, reason } = req.body;

    const request = await RemovalRequest.create({
      name,
      username: username.toLowerCase(),
      email,
      reason,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all removal requests (Admin)
 */
export const getRemovalRequests = async (req, res) => {
  try {
    const requests = await RemovalRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete removal request (Admin)
 */
export const deleteRemovalRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await RemovalRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Removal request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
