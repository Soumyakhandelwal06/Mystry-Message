// utils/smsService.js
const twilio = require("twilio");

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendOTP(phone, otp) {
    try {
      const message = await this.client.messages.create({
        body: `Your OTP for Anonymous Messaging App is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error("SMS sending error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SMSService();
