// // routes/auth.js
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const rateLimit = require("express-rate-limit");
// const User = require("../models/User");
// const emailService = require("../utils/emailService");
// const smsService = require("../utils/smsService");

// const {
//   signupValidation,
//   loginValidation,
//   otpValidation,
// } = require("../middleware/validation");

// const router = express.Router();

// // Rate limiting for auth endpoints
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs
//   message: {
//     message: "Too many authentication attempts, please try again later.",
//   },
// });

// const otpLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 1, // limit each IP to 1 OTP request per minute
//   message: { message: "Please wait before requesting another OTP." },
// });

// // @route   POST /api/auth/signup
// // @desc    Register a new user and send OTP
// // @access  Public
// router.post("/signup", authLimiter, signupValidation, async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;
//     // console.log("Validation failed errors:", errors.array());

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User with this email or phone already exists",
//       });
//     }

//     // Create new user (not verified yet)
//     const user = new User({
//       email,
//       phone,
//       password,
//     });

//     // Generate OTP
//     const otp = user.generateOTP();
//     user.lastOtpRequest = new Date();

//     await user.save();

//     // Send OTP via email
//     const emailResult = await emailService.sendOTP(email, otp);

//     if (!emailResult.success) {
//       // Try SMS as fallback
//       const smsResult = await smsService.sendOTP(phone, otp);

//       if (!smsResult.success) {
//         await User.findByIdAndDelete(user._id);
//         return res.status(500).json({
//           message: "Failed to send OTP. Please try again.",
//         });
//       }
//     }

//     res.status(201).json({
//       message:
//         "User created successfully. Please verify your account with the OTP sent to your email/phone.",
//       userId: user._id,
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Server error during signup" });
//   }
// });

// // @route   POST /api/auth/verify-otp
// // @desc    Verify OTP and activate account
// // @access  Public
// router.post("/verify-otp", authLimiter, otpValidation, async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "Account already verified" });
//     }

//     // Check OTP attempts
//     if (user.otpAttempts >= 3) {
//       return res.status(400).json({
//         message: "Maximum OTP attempts exceeded. Please request a new OTP.",
//       });
//     }

//     // Verify OTP
//     if (!user.verifyOTP(otp)) {
//       user.otpAttempts += 1;
//       await user.save();

//       return res.status(400).json({
//         message: "Invalid or expired OTP",
//         attemptsLeft: 3 - user.otpAttempts,
//       });
//     }

//     // Activate account
//     user.isVerified = true;
//     user.clearOTP();
//     await user.save();

//     // Send welcome email with unique link
//     await emailService.sendWelcome(user.email, user.uniqueLink);

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     });

//     res.json({
//       message: "Account verified successfully",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         phone: user.phone,
//         uniqueLink: user.uniqueLink,
//         uniqueId: user.uniqueId,
//       },
//     });
//   } catch (error) {
//     console.error("OTP verification error:", error);
//     res.status(500).json({ message: "Server error during OTP verification" });
//   }
// });

// // @route   POST /api/auth/resend-otp
// // @desc    Resend OTP
// // @access  Public
// router.post("/resend-otp", otpLimiter, async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ message: "Account already verified" });
//     }

//     // Check if enough time has passed since last OTP request
//     const timeSinceLastRequest = new Date() - user.lastOtpRequest;
//     if (timeSinceLastRequest < 60000) {
//       // 1 minute
//       return res.status(400).json({
//         message: "Please wait before requesting another OTP",
//       });
//     }

//     // Generate new OTP
//     const otp = user.generateOTP();
//     user.lastOtpRequest = new Date();
//     user.otpAttempts = 0;

//     await user.save();

//     // Send OTP
//     const emailResult = await emailService.sendOTP(email, otp);

//     if (!emailResult.success) {
//       const smsResult = await smsService.sendOTP(user.phone, otp);

//       if (!smsResult.success) {
//         return res.status(500).json({
//           message: "Failed to send OTP. Please try again.",
//         });
//       }
//     }

//     res.json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Resend OTP error:", error);
//     res.status(500).json({ message: "Server error during OTP resend" });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Login user
// // @access  Public
// router.post("/login", authLimiter, loginValidation, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({
//         message: "Please verify your account first",
//         needsVerification: true,
//       });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     });

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         phone: user.phone,
//         uniqueLink: user.uniqueLink,
//         uniqueId: user.uniqueId,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

// module.exports = router;
// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const emailService = require("../utils/emailService");
const smsService = require("../utils/smsService");

const {
  signupValidation,
  loginValidation,
  otpValidation,
} = require("../middleware/validation");

const router = express.Router();

const MAX_OTP_ATTEMPTS = 3;

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: { message: "Please wait before requesting another OTP." },
});

// @route   POST /api/auth/signup
// @desc    Register a new user and send OTP
// @access  Public
router.post("/signup", authLimiter, signupValidation, async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or phone already exists",
      });
    }

    const crypto = require("crypto");

    const uniqueId = crypto.randomBytes(8).toString("hex"); // or any unique generator
    const uniqueLink = `send/${uniqueId}`;

    const user = new User({
      email,
      phone,
      password,
      uniqueId,
      uniqueLink,
    });

    const otp = user.generateOTP();
    user.lastOtpRequest = new Date();

    await user.save();

    const emailResult = await emailService.sendOTP(email, otp);

    if (!emailResult.success) {
      const smsResult = await smsService.sendOTP(phone, otp);

      if (!smsResult.success) {
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          message: "Failed to send OTP. Please try again.",
        });
      }
    }

    res.status(201).json({
      message:
        "User created successfully. Please verify your account with the OTP sent to your email/phone.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error during signup"
          : error.message,
    });
  }
});

// @route   POST /api/auth/verify-otp
router.post("/verify-otp", authLimiter, otpValidation, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(400).json({
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      });
    }

    if (!user.verifyOTP(otp)) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid or expired OTP",
        attemptsLeft: MAX_OTP_ATTEMPTS - user.otpAttempts,
      });
    }

    user.isVerified = true;
    user.clearOTP();
    await user.save();

    // Check uniqueLink before sending
    if (user.uniqueLink) {
      await emailService.sendWelcome(user.email, user.uniqueLink);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: "Account verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        uniqueLink: user.uniqueLink,
        uniqueId: user.uniqueId,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error during OTP verification"
          : error.message,
    });
  }
});

// @route   POST /api/auth/resend-otp
router.post("/resend-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const timeSinceLastRequest = user.lastOtpRequest
      ? new Date() - user.lastOtpRequest
      : Infinity;

    if (timeSinceLastRequest < 60000) {
      return res
        .status(400)
        .json({ message: "Please wait before requesting another OTP" });
    }

    const otp = user.generateOTP();
    user.lastOtpRequest = new Date();
    user.otpAttempts = 0;
    await user.save();

    const emailResult = await emailService.sendOTP(email, otp);

    if (!emailResult.success) {
      const smsResult = await smsService.sendOTP(user.phone, otp);
      if (!smsResult.success) {
        return res.status(500).json({
          message: "Failed to send OTP. Please try again.",
        });
      }
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error during OTP resend"
          : error.message,
    });
  }
});

// @route   POST /api/auth/login
router.post("/login", authLimiter, loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your account first",
        needsVerification: true,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        phone: user.phone,
        uniqueId: user.uniqueId,
        uniqueLink: user.uniqueLink,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        uniqueLink: user.uniqueLink,
        uniqueId: user.uniqueId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Server error during login"
          : error.message,
    });
  }
});

module.exports = router;
