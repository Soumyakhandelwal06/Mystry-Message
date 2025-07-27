// middleware/validation.js
const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  console.log("Incoming signup data:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const signupValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .matches(/^\+?[\d\s-()]+$/)
    .isLength({ min: 10, max: 15 })
    .withMessage("Please provide a valid phone number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  handleValidationErrors,
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const otpValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be a 6-digit number"),
  handleValidationErrors,
];

const messageValidation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message content must be between 1 and 1000 characters"),
  handleValidationErrors,
];

module.exports = {
  signupValidation,
  loginValidation,
  otpValidation,
  messageValidation,
};
