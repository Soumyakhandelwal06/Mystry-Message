// const express = require("express");
// const auth = require("../middleware/auth");
// const User = require("../models/User"); // 👈 Add this

// const router = express.Router();

// // @route   GET /api/users/profile
// // @desc    Get user profile
// // @access  Private
// router.get("/profile", auth, async (req, res) => {
//   try {
//     const user = req.user;

//     res.json({
//       user: {
//         id: user._id,
//         email: user.email,
//         phone: user.phone,
//         uniqueLink: user.uniqueLink,
//         uniqueId: user.uniqueId,
//         isVerified: user.isVerified,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Get profile error:", error);
//     res.status(500).json({ message: "Server error while fetching profile" });
//   }
// });

// // @route   GET /api/users/validate-link/:uniqueId
// // @desc    Validate if unique ID exists
// // @access  Public
// router.get("/validate-link/:uniqueId", async (req, res) => {
//   try {
//     const { uniqueId } = req.params;

//     const user = await User.findOne({ uniqueId, isVerified: true }).select(
//       "uniqueId email"
//     );

//     if (!user) {
//       return res.status(404).json({
//         message: "Invalid link or user not found",
//         isValid: false,
//       });
//     }

//     res.json({
//       message: "Valid link",
//       isValid: true,
//       recipientExists: true,
//     });
//   } catch (error) {
//     console.error("Validate link error:", error);
//     res.status(500).json({
//       message: "Server error while validating link",
//       isValid: false,
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User"); // ✅ You missed this import earlier

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        uniqueLink: user.uniqueLink,
        uniqueId: user.uniqueId,
        isVerified: user.isVerified,
        isAcceptingMessages: user.isAcceptingMessages,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

// @route   GET /api/users/validate-link/:uniqueId
// @desc    Validate if unique ID exists
// @access  Public
router.get("/validate-link/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const user = await User.findOne({ uniqueId, isVerified: true }).select(
      "uniqueId email"
    );

    if (!user) {
      return res.status(404).json({
        message: "Invalid link or user not found",
        isValid: false,
      });
    }

    res.json({
      message: "Valid link",
      isValid: true,
      recipientExists: true,
    });
  } catch (error) {
    console.error("Validate link error:", error);
    res.status(500).json({
      message: "Server error while validating link",
      isValid: false,
    });
  }
});

router.get("/:uniqueId", async (req, res) => {
  try {
    const user = await User.findOne({
      uniqueId: req.params.uniqueId,
      isVerified: true,
    }).select("username uniqueId");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Get user profile error:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
});
// @route   PUT /api/users/accepting-messages
// @desc    Toggle accepting messages
// @access  Private
router.put("/accepting-messages", auth, async (req, res) => {
  try {
    const { accepting } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isAcceptingMessages: accepting },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAcceptingMessages = accepting;
    await user.save({ validateBeforeSave: false });
    console.log(
      "✅ Updated user.isAcceptingMessages:",
      user.isAcceptingMessages
    );
    res.json({
      success: true,
      message: `Messages ${accepting ? "enabled" : "disabled"}`,
      isAcceptingMessages: user.isAcceptingMessages,
    });
  } catch (error) {
    console.error("Error toggling accepting messages:", error);
    res.status(500).json({ message: "Server error while updating setting" });
  }
});

module.exports = router;
