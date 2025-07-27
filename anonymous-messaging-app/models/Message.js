// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientUniqueId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    senderIP: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
messageSchema.index({ recipientId: 1, createdAt: -1 });
messageSchema.index({ recipientUniqueId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
