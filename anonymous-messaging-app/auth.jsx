import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/anonymous_messages",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailOTP: {
    type: String,
    default: null,
  },
  phoneOTP: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// Email Configuration
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio Configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper Functions
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateJWTToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
    { expiresIn: "7d" }
  );
};

const verifyJWTToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
    );
  } catch (error) {
    return null;
  }
};

const sendEmailOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Account Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Account Verification</h2>
          <p>Your OTP for account verification is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

const sendSMSOTP = async (phone, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your OTP for account verification is: ${otp}. This OTP will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return true;
  } catch (error) {
    console.error("SMS send error:", error);
    return false;
  }
};

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  const decoded = verifyJWTToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }

  req.userId = decoded.userId;
  next();
};

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Signup Route
app.post("/auth/signup", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Input validation
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: "Email, phone, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // Generate OTPs
    const emailOTP = generateOTP();
    const phoneOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with pending verification
    const user = new User({
      email,
      phone,
      password: hashedPassword,
      emailOTP,
      phoneOTP,
      otpExpiry,
      isVerified: false,
    });

    await user.save();

    // Send OTPs
    const emailSent = await sendEmailOTP(email, emailOTP);
    const smsSent = await sendSMSOTP(phone, phoneOTP);

    if (!emailSent && !smsSent) {
      // Delete user if both OTP sends failed
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({
        success: false,
        error: "Failed to send OTP. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please verify your email and phone with the OTP sent.",
      data: {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        emailSent,
        smsSent,
        otpExpiry,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// OTP Verification Route
app.post("/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: "Account is already verified",
      });
    }

    // Check OTP expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        error: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP (check both email and phone OTP)
    if (user.emailOTP !== otp && user.phoneOTP !== otp) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // Mark user as verified and clear OTP data
    user.isVerified = true;
    user.emailOTP = null;
    user.phoneOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
      data: {
        userId: user._id,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Resend OTP Route
app.post("/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: "Account is already verified",
      });
    }

    // Generate new OTPs
    const emailOTP = generateOTP();
    const phoneOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with new OTPs
    user.emailOTP = emailOTP;
    user.phoneOTP = phoneOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send new OTPs
    const emailSent = await sendEmailOTP(email, emailOTP);
    const smsSent = await sendSMSOTP(user.phone, phoneOTP);

    res.json({
      success: true,
      message: "New OTP sent successfully",
      data: {
        emailSent,
        smsSent,
        otpExpiry,
      },
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Login Route with JWT
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if account is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: "Please verify your account first",
        requiresVerification: true,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateJWTToken(user._id);

    // Return success response with token
    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
        tokenType: "Bearer",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Get User Profile (Protected Route)
app.get("/auth/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -emailOTP -phoneOTP"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Logout Route (Token Blacklisting would be implemented here in production)
app.post("/auth/logout", authenticateToken, async (req, res) => {
  try {
    // In a production app, you'd typically:
    // 1. Add token to blacklist in database/Redis
    // 2. Or use shorter token expiry with refresh tokens

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
});

// Verify Token Route
app.post("/auth/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Token is required",
    });
  }

  const decoded = verifyJWTToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }

  res.json({
    success: true,
    message: "Token is valid",
    data: {
      userId: decoded.userId,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
