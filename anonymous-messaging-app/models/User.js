// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
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
    uniqueLink: {
      type: String,
      unique: true,
      required: true,
    },
    uniqueId: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    lastOtpRequest: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique ID and link before saving
userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  // Generate unique ID
  this.uniqueId = crypto.randomBytes(8).toString("hex");

  // Generate unique link
  this.uniqueLink = `${process.env.FRONTEND_URL}/send/${this.uniqueId}`;

  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP method
userSchema.methods.generateOTP = function () {
  const otp = crypto.randomInt(100000, 999999).toString();
  this.otp = otp;
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Verify OTP method
userSchema.methods.verifyOTP = function (candidateOTP) {
  if (!this.otp || !this.otpExpires) return false;
  if (this.otpExpires < new Date()) return false;
  return this.otp === candidateOTP;
};

// Clear OTP method
userSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpires = null;
  this.otpAttempts = 0;
};

module.exports = mongoose.model("User", userSchema);
