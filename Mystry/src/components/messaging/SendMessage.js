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
  const [aiSuggestions, setAiSuggestions] = useState([]);

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
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/ai/suggestions`
        );
        const data = await res.json();
        if (data.success) {
          setAiSuggestions(data.suggestions.slice(0, 3));
        }
      } catch (err) {
        console.error("AI suggestion fetch error:", err);
      }
    };

    fetchSuggestions();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim() === "") {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/ai/suggestions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input }), // Pass current input
          }
        );

        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400); // debounce input

    return () => clearTimeout(debounceTimer);
  }, [input]);
  // const regenerateSuggestions = async () => {
  //   if (input.trim() === "") return;

  //   setLoadingSuggestions(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}/ai/suggestions`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ input }),
  //       }
  //     );

  //     const data = await res.json();
  //     setSuggestions(data.suggestions || []);
  //   } catch (error) {
  //     console.error("Failed to regenerate suggestions", error);
  //   } finally {
  //     setLoadingSuggestions(false);
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

  // return (
  // <Layout navigate={navigate}>
  //   <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
  //     <div className="relative mb-6">
  //       {/* 🔙 Back Arrow Button at Top-Left */}
  //       <div className="absolute top-0 left-0">
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           onClick={() => navigate("/login")}
  //           className="p-2"
  //         >
  //           <ArrowLeft className="w-5 h-5" />
  //         </Button>
  //       </div>

  //       {/* 📩 Centered Content */}
  //       <div className="flex flex-col items-center">
  //         <MessageSquare className="w-12 h-12 text-blue-600 mb-2" />
  //         <h2 className="text-xl font-bold text-gray-800 text-center">
  //           Send Anonymous Message
  //         </h2>
  //         <p className="text-gray-600 mt-1 text-center">
  //           To: <span className="font-semibold">{userProfile?.username}</span>
  //         </p>
  //       </div>
  //     </div>

  //     {error && (
  //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
  //         {error}
  //       </div>
  //     )}

  //     {success && (
  //       <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
  //         {UI_MESSAGES.SEND_SUCCESS}
  //       </div>
  //     )}

  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Your Message
  //         </label>
  //         <textarea
  //           value={message}
  //           onChange={handleMessageChange}
  //           placeholder="Type your anonymous message here..."
  //           className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
  //           rows="6"
  //           required
  //         />
  //         <div className="text-right text-sm text-gray-500 mt-1">
  //           {message.length}/1000 characters
  //         </div>
  //       </div>

  //       <Button
  //         type="submit"
  //         className="w-full"
  //         disabled={loading || !message.trim()}
  //       >
  //         {loading ? (
  //           <div className="flex items-center">
  //             <LoadingSpinner size="sm" className="mr-2" />
  //             Sending...
  //           </div>
  //         ) : (
  //           <div className="flex items-center justify-center">
  //             <Send className="w-4 h-4 mr-2" />
  //             Send Message
  //           </div>
  //         )}
  //       </Button>
  //     </form>

  //     <div className="mt-6 text-center text-sm text-gray-500">
  //       <p>Your message will be sent anonymously.</p>
  //       <p>The recipient won't know who sent it.</p>
  //     </div>
  //   </div>
  // </Layout>
  return (
    <Layout navigate={navigate}>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 ease-in-out border border-gray-100">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="p-2 hover:bg-gray-100 transition rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <MessageSquare className="w-12 h-12 text-indigo-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            Send Anonymous Message
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            To:{" "}
            <span className="font-semibold text-gray-700">
              {userProfile?.username ||
                userProfile?.name ||
                userProfile?.email?.split("@")[0] ||
                "Anonymous User"}
            </span>
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-sm">
            {UI_MESSAGES.SEND_SUCCESS}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Message
            </label>
            {/* <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your anonymous message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition duration-200"
              rows="6"
              maxLength={1000}
              required
            /> */}
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your anonymous message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              maxLength={1000}
              required
            />
            {/* <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows={5}
              placeholder="Type your anonymous message..."
            ></textarea>
            {loadingSuggestions && (
              <p className="text-gray-500">Loading suggestions...</p>
            )} */}

            {/* {suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold mb-1 text-gray-600">
                  Suggestions:
                </p>
                <ul className="bg-gray-100 border p-2 rounded-lg text-sm space-y-1">
                  {suggestions.map((sug, index) => (
                    <li
                      key={index}
                      className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                      onClick={() => setInput(sug)}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => regenerateSuggestions()}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  🔄 Regenerate Suggestions
                </button>
              </div>
            )} */}

            <div className="text-right text-xs text-gray-400 mt-1">
              {message.length}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <div className="flex items-center justify-center">
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
          {aiSuggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                💡 Suggested questions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiSuggestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(q)}
                    className="bg-gray-100 hover:bg-indigo-100 text-gray-700 text-sm px-3 py-2 rounded-md text-left transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Your identity is never revealed.</p>
          <p>Messages are 100% anonymous and private.</p>
        </div>
      </div>
    </Layout>
  );
};
export default SendMessage;
