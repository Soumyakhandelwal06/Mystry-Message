import React, { useState, useEffect } from "react";
import { Copy, MessageCircle, User, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Header } from "../layout/Header";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Button } from "../ui/Button";
import { UI_MESSAGES } from "../../utils/constants";

export const Dashboard = ({ navigate }) => {
  const { user, token, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const uniqueLink = `${window.location.origin}/send/${user?.id}`;

  useEffect(() => {
    if (user && token) {
      fetchMessages();
    }
  }, [user, token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const result = await api.getMessages(user.id, token);
      if (result.success) {
        setMessages(result.messages || []);
      } else {
        setError(result.message || "Failed to fetch messages");
      }
    } catch (err) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, {user?.username}!
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Your Anonymous Message Link
          </h2>
          <p className="text-gray-600 mb-4">
            Share this link with others so they can send you anonymous messages:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={uniqueLink}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm"
            />
            <Button
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copySuccess ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Your Messages ({messages.length})
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No messages yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Share your link to start receiving anonymous messages!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                    <span className="text-xs text-gray-400">Anonymous</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
