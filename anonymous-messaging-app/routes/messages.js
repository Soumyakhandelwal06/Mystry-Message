const express = require("express");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const Message = require("../models/Message");
const auth = require("../middleware/auth");
const { messageValidation } = require("../middleware/validation");

const router = express.Router();

// Rate limiting for message sending
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 messages per hour
  message: { message: "Too many messages sent, please try again later." },
});

// @route   POST /api/messages/send/:uniqueId
// @desc    Send anonymous message
// @access  Public
router.post(
  "/send/:uniqueId",
  messageLimiter,
  messageValidation,
  async (req, res) => {
    try {
      const { uniqueId } = req.params;
      const { content } = req.body;

      // Find recipient by unique ID
      const recipient = await User.findOne({ uniqueId });

      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }

      if (!recipient.isVerified) {
        return res
          .status(400)
          .json({ message: "Recipient account not verified" });
      }

      // Get sender's IP address
      const senderIP = req.ip || req.connection.remoteAddress;

      // Create message
      const message = new Message({
        recipientId: recipient._id,
        recipientUniqueId: uniqueId,
        content: content.trim(),
        senderIP,
      });

      await message.save();
      console.log("✅ Message saved to DB:", message); // <== Add this line
      res.status(201).json({
        success: true, // ✅ add this
        message: "Message sent successfully",
        timestamp: message.createdAt,
      });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Server error while sending message" });
    }
  }
);

// @route   GET /api/messages
// @desc    Get all messages for authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ recipientId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-senderIP -recipientId");

    const totalMessages = await Message.countDocuments({
      recipientId: req.user._id,
    });
    const unreadCount = await Message.countDocuments({
      recipientId: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasNext: skip + messages.length < totalMessages,
        hasPrev: page > 1,
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error while fetching messages" });
  }
});

// @route   PUT /api/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put("/:messageId/read", auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      recipientId: req.user._id,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Mark message read error:", error);
    res
      .status(500)
      .json({ message: "Server error while marking message as read" });
  }
});

// @route   DELETE /api/messages/:messageId
// @desc    Delete message
// @access  Private
router.delete("/:messageId", auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      recipientId: req.user._id,
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Server error while deleting message" });
  }
});

// @route   GET /api/messages/stats
// @desc    Get message statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments({
      recipientId: req.user._id,
    });
    const unreadMessages = await Message.countDocuments({
      recipientId: req.user._id,
      isRead: false,
    });
    const todayMessages = await Message.countDocuments({
      recipientId: req.user._id,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });

    res.json({
      totalMessages,
      unreadMessages,
      todayMessages,
      readMessages: totalMessages - unreadMessages,
    });
  } catch (error) {
    console.error("Get message stats error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching message statistics" });
  }
});

module.exports = router;
