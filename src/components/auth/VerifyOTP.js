import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui/Button";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { STORAGE_KEYS, UI_MESSAGES } from "../../utils/constants";

export const VerifyOTP = ({ navigate }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const email = window.sessionStorage?.getItem(STORAGE_KEYS.SIGNUP_EMAIL);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await api.verifyOTP(email, otp);
      if (result.success) {
        login(result.user, result.token);
        window.sessionStorage?.removeItem(STORAGE_KEYS.SIGNUP_EMAIL);
        navigate("/dashboard");
      } else {
        setError(result.message || "OTP verification failed");
      }
    } catch (error) {
      setError(UI_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <Mail className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mt-2">Enter the OTP sent to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="text-center text-2xl font-bold tracking-widest w-full py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              maxLength="6"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading}>
            Verify OTP
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};
