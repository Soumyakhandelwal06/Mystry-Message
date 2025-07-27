const rateLimit = require("express-rate-limit");

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP rate limiter
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // limit each IP to 1 OTP request per minute
  message: {
    message: "Please wait before requesting another OTP.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Message sending rate limiter
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 messages per hour
  message: {
    message: "Too many messages sent, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  otpLimiter,
  messageLimiter,
};
