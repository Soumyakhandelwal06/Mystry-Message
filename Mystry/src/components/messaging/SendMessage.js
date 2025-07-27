// Complete src/components/messaging/SendMessage.js
import React, { useState, useEffect } from "react";
import { Send, MessageSquare, User, ArrowLeft } from "lucide-react";
import { api } from "../../services/api";
import Button from "../ui/Button"; // ❌ might not work depending on current depth
// ✅ if you're 2 levels deep

// adjust path based on your file location
import { useParams, useNavigate } from "react-router-dom";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Layout } from "../layout/Layout";
import { UI_MESSAGES } from "../../utils/constants";

export const SendMessage = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await api.getUserProfile(uniqueId);
        if (result.success) {
          setUserProfile(result.user);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to load user profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [uniqueId]); // ✅ Clean and no warning

  // const fetchUserProfile = async () => {
  //   try {
  //     const result = await api.getUserProfile(uniqueId);
  //     if (result.success) {
  //       setUserProfile(result.user);
  //     } else {
  //       setError("User not found");
  //     }
  //   } catch (err) {
  //     setError("Failed to load user profile");
  //   } finally {
  //     setLoadingProfile(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await api.sendMessage(uniqueId, message.trim());

      if (result.success) {
        setSuccess(true);
        setMessage("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || "Failed to send message");
      }
    } catch (err) {
      setError(UI_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setMessage(value);
    }
  };

  if (loadingProfile) {
    return (
      <Layout navigate={navigate}>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error && !userProfile) {
    return (
      <Layout navigate={navigate}>
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">
            <User className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-bold">User Not Found</h2>
            <p className="text-gray-600 mt-2">
              The user you're trying to message doesn't exist.
            </p>
          </div>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navigate={navigate}>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        {/* <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="mr-4 w-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Send Anonymous Message
            </h2>
            <p className="text-gray-600 mt-1">
              To: <span className="font-semibold">{userProfile?.username}</span>
            </p>
          </div>
        </div> */}
        <div className="relative mb-6">
          {/* 🔙 Back Arrow Button at Top-Left */}
          <div className="absolute top-0 left-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* 📩 Centered Content */}
          <div className="flex flex-col items-center">
            <MessageSquare className="w-12 h-12 text-blue-600 mb-2" />
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Send Anonymous Message
            </h2>
            <p className="text-gray-600 mt-1 text-center">
              To: <span className="font-semibold">{userProfile?.username}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {UI_MESSAGES.SEND_SUCCESS}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your anonymous message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="6"
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {message.length}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your message will be sent anonymously.</p>
          <p>The recipient won't know who sent it.</p>
        </div>
      </div>
    </Layout>
  );
};
export default SendMessage;
