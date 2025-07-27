const crypto = require("crypto");

const generateUniqueId = () => {
  return crypto.randomBytes(8).toString("hex");
};

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, "");
};

const getClientIP = (req) => {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};

module.exports = {
  generateUniqueId,
  generateOTP,
  validateEmail,
  validatePhone,
  sanitizeInput,
  getClientIP,
};
