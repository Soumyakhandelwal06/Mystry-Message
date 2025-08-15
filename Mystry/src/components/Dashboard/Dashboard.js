// // src/components/Dashboard/Dashboard.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { api } from "../../services/api";
// const res = await api.getMessages(userId, token);

// import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

// function Dashboard() {
//   const { user, logout } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [copied, copy] = useCopyToClipboard();

//   const userId = user ? user.userId : null;
//   const userLink = userId
//     ? `${window.location.origin}/send/${userId}`
//     : "Loading link...";

//   useEffect(() => {
//     if (!userId) {
//       setError("User not authenticated. Please log in.");
//       return;
//     }

//     const fetchMessages = async () => {
//       setError("");
//       try {
//         const fetchedMessages = await api.getMessages(userId, token);

//         setMessages(fetchedMessages);
//       } catch (err) {
//         setError(err.message || "Failed to fetch messages.");
//         if (
//           err.message === "Unauthorized" ||
//           err.message === "Session expired"
//         ) {
//           logout();
//           navigate("/login"); // Redirect to login on unauthorized
//         }
//       }
//     };

//     fetchMessages();
//   }, [userId, logout, navigate]); // Add navigate to dependency array

//   const handleCopyLink = () => {
//     copy(userLink);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login"); // Navigate to login after logout
//   };

//   if (!userId) {
//     return (
//       <div className="text-center text-gray-600">Loading dashboard...</div>
//     );
//   }

//   return (
//     <div className="relative">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
//       <button
//         onClick={handleLogout}
//         className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//       >
//         Logout
//       </button>

//       <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">
//           Your Unique Message Link:
//         </h3>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
//           <a
//             href={userLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-indigo-600 hover:text-indigo-800 truncate block w-full sm:w-auto"
//           >
//             {userLink}
//           </a>
//           <button
//             onClick={handleCopyLink}
//             className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
//           >
//             {copied ? "Copied!" : "Copy Link"}
//           </button>
//         </div>
//       </div>

//       <h3 className="text-xl font-semibold text-gray-900 mb-4">
//         Received Messages:
//       </h3>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       {messages.length === 0 ? (
//         <p className="text-gray-600">No messages received yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {messages.map((message) => (
//             <li
//               key={message._id}
//               className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
//             >
//               <strong className="text-gray-800">From: Anonymous</strong>
//               <p className="mt-2 text-gray-700">{message.content}</p>
//               <small className="block mt-2 text-gray-500 text-xs">
//                 Received on: {new Date(message.createdAt).toLocaleString()}
//               </small>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Dashboard;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { api } from "../../services/api";
// import { Toast } from "../components/ui/Toast"; // adjust path if needed
// import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
// function Dashboard() {
//   const { user, logout } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [toast, setToast] = useState({ show: false, type: "", message: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [acceptingMessages, setAcceptingMessages] = useState(true);
//   const navigate = useNavigate();
//   console.log("navigate is", typeof navigate); // ✅ Should log "function"
//   const [copied, copy] = useCopyToClipboard();
//   const token = localStorage.getItem("jwtToken"); // ✅ get token properly
//   // const userId = user ? user.userId : null;
//   const userId = user?.id || null;
//   const uniqueId = user?.uniqueId || null; // ✅ ADD THIS LINE
//   const userLink = uniqueId
//     ? `${window.location.origin}/send/${uniqueId}`
//     : "Loading link...";

//   console.log("User:", user); // Should have .id
//   console.log("Token:", token); // Should NOT be null

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.getProfile(token);
//         setAcceptingMessages(res.user.isAcceptingMessages);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       }
//     };

//     if (token) fetchProfile();
//   }, [token]);

//   useEffect(() => {
//     if (!userId || !token) {
//       setError("User not authenticated. Please log in.");
//       return;
//     }

//     const fetchMessages = async () => {
//       setError("");
//       try {
//         const res = await api.getMessages(token);
//         console.log("📥 Message fetch response:", res);

//         // ✅ Correct usage based on your api.js structure
//         if (res.success && Array.isArray(res.data)) {
//           setMessages(res.data);
//         } else {
//           throw new Error(res.message || "Unexpected response format");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to fetch messages.");
//         if (
//           err.message === "Unauthorized" ||
//           err.message === "Session expired"
//         ) {
//           logout();
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [userId, token, logout, navigate]);
//   const showToast = (type, message) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => {
//       setToast({ show: false, type: "", message: "" });
//     }, 3000);
//   };

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const result = await api.getMessages();
//         if (result.success) {
//           setMessages(result.messages);

//           // ✅ Show toast if no messages found
//           if (result.messages.length === 0) {
//             showToast("error", "No messages found");
//           }
//         } else {
//           showToast("error", "Failed to load messages");
//         }
//       } catch (error) {
//         showToast("error", "Network error");
//       }
//     };

//     fetchMessages();
//   }, []);
//   const handleCopyLink = () => {
//     copy(userLink);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   if (!userId) {
//     return (
//       <div className="text-center text-gray-600">Loading dashboard...</div>
//     );
//   }
//   const handleDelete = async (messageId) => {
//     if (!window.confirm("Are you sure you want to delete this message?"))
//       return;

//     try {
//       const res = await api.deleteMessage(messageId, token);
//       if (res.message === "Message deleted successfully") {
//         setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//       } else {
//         alert(res.message || "Failed to delete message");
//       }
//     } catch (err) {
//       alert("Something went wrong while deleting");
//     }
//   };
//   const toggleAcceptingMessages = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/users/accepting-messages`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // <-- Very important
//           },
//           body: JSON.stringify({ accepting: !acceptingMessages }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setAcceptingMessages(data.isAcceptingMessages); // <-- This updates your UI
//       } else {
//         console.error(data.message);
//       }
//     } catch (error) {
//       console.error("Toggle Accepting Messages Error:", error);
//     }
//   };

//   return (
//     <div className="relative p-6 sm:p-10 max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-900">👋 Welcome back!</h2>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-200 shadow-sm"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="bg-blue-50 p-5 rounded-xl shadow-md mb-10">
//         <h3 className="text-lg font-semibold text-blue-900 mb-3">
//           💌 Your Anonymous Message Link
//         </h3>
//         <div className="flex flex-col sm:flex-row gap-3 items-center">
//           <a
//             href={userLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline break-all text-sm"
//           >
//             {userLink}
//           </a>
//           <button
//             onClick={handleCopyLink}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-150 shadow-sm"
//           >
//             {copied ? "✅ Copied!" : "Copy Link"}
//           </button>
//         </div>
//         <div className="flex items-center mt-4 gap-2">
//           <label className="text-sm text-gray-700 font-medium">
//             Accepting Messages:
//           </label>
//           <button
//             onClick={toggleAcceptingMessages}
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               acceptingMessages
//                 ? "bg-green-500 text-white hover:bg-green-600"
//                 : "bg-gray-400 text-white hover:bg-gray-500"
//             } transition duration-150`}
//           >
//             {acceptingMessages ? "ON" : "OFF"}
//           </button>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//           📥 Received Messages
//         </h3>
//         {error && <p className="text-red-600 mb-4">{error}</p>}
//         {loading ? (
//           <div className="space-y-4">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="animate-pulse bg-gray-200 h-24 rounded-lg"
//               ></div>
//             ))}
//           </div>
//         ) : messages.length === 0 ? (
//           <p className="text-gray-500 text-sm">No messages received yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {messages.map((message) => (
//               <li
//                 key={message._id}
//                 className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition duration-200 relative"
//               >
//                 <div className="text-gray-700">{message.content}</div>
//                 <small className="block mt-2 text-gray-400 text-xs">
//                   Received on: {new Date(message.createdAt).toLocaleString()}
//                 </small>

//                 {/* 🗑 Delete Button */}
//                 <button
//                   onClick={() => handleDelete(message._id)}
//                   className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
//                   title="Delete this message"
//                 >
//                   🗑
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// // src/components/Dashboard/Dashboard.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { api } from "../../services/api";
// import { Toast } from "../ui/Toast";
// import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

// function Dashboard() {
//   const { user, logout } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [toast, setToast] = useState({ show: false, type: "", message: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [acceptingMessages, setAcceptingMessages] = useState(true);
//   const [deleteModal, setDeleteModal] = useState({
//     show: false,
//     messageId: null,
//   });

//   const navigate = useNavigate();
//   const [copied, copy] = useCopyToClipboard();
//   const token = localStorage.getItem("jwtToken");

//   const userId = user?.id || null;
//   const uniqueId = user?.uniqueId || null;
//   const userLink = uniqueId
//     ? `${window.location.origin}/send/${uniqueId}`
//     : "Loading link...";

//   const showToast = (type, message) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
//   };

//   useEffect(() => {
//     if (!user) navigate("/login");
//   }, [user, navigate]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.getProfile(token);
//         setAcceptingMessages(res.user.isAcceptingMessages);
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       }
//     };
//     if (token) fetchProfile();
//   }, [token]);

//   const fetchMessages = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.getMessages(user.id, token);
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Failed to fetch messages:", err);
//     }
//   };

//   useEffect(() => {
//     const fetchMessages = async () => {
//       setError("");
//       try {
//         const res = await api.getMessages(token);
//         if (res.success && Array.isArray(res.data)) {
//           setMessages(res.data);
//           if (res.data.length === 0) showToast("error", "No messages found");
//         } else {
//           throw new Error(res.message || "Unexpected response format");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to fetch messages.");
//         if (
//           err.message === "Unauthorized" ||
//           err.message === "Session expired"
//         ) {
//           logout();
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (userId && token) fetchMessages();
//   }, [userId, token, logout, navigate]);

//   const handleCopyLink = () => {
//     copy(userLink);
//     showToast("success", "Link copied to clipboard");
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleDelete = (messageId) => {
//     setDeleteModal({ show: true, messageId });
//   };
//   useEffect(() => {
//     fetchMessages();
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         fetchMessages();
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const confirmDelete = async () => {
//     const { messageId } = deleteModal;
//     try {
//       const res = await api.deleteMessage(messageId, token);
//       if (res.message === "Message deleted successfully") {
//         setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//         showToast("success", "Message deleted");
//       } else {
//         showToast("error", res.message || "Failed to delete message");
//       }
//     } catch (err) {
//       showToast("error", "Something went wrong while deleting");
//     } finally {
//       setDeleteModal({ show: false, messageId: null });
//     }
//   };

//   const toggleAcceptingMessages = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/users/accepting-messages`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ accepting: !acceptingMessages }),
//         }
//       );
//       const data = await response.json();
//       if (data.success) {
//         setAcceptingMessages(data.isAcceptingMessages);
//         showToast(
//           "success",
//           `Messages turned ${data.isAcceptingMessages ? "ON" : "OFF"}`
//         );
//       } else {
//         showToast("error", data.message || "Failed to toggle status");
//       }
//     } catch (error) {
//       showToast("error", "Toggle failed");
//       console.error("Toggle Accepting Messages Error:", error);
//     }
//   };

//   if (!userId) {
//     return (
//       <div className="text-center text-gray-600">Loading dashboard...</div>
//     );
//   }

//   return (
//     <div className="relative p-6 sm:p-10 max-w-4xl mx-auto">
//       {/* ✅ Toast */}
//       {toast.show && (
//         <Toast
//           type={toast.type}
//           message={toast.message}
//           onClose={() => setToast({ show: false })}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModal.show && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
//             <h2 className="text-xl font-bold text-black mb-3">
//               Are you absolutely sure?
//             </h2>
//             <p className="text-gray-700 mb-6 text-sm">
//               This action cannot be undone. This will permanently delete this
//               message from our servers.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setDeleteModal({ show: false, messageId: null })}
//                 className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-300 transition border-gray-500 shadow-xl"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 rounded-md bg-black text-white hover:bg-red-700 transition"
//               >
//                 Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-900">👋 Welcome back!</h2>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-200 shadow-sm"
//         >
//           Logout
//         </button>
//       </div>

//       {/* User Link */}
//       <div className="bg-blue-50 p-5 rounded-xl shadow-md mb-10">
//         <h3 className="text-lg font-semibold text-blue-900 mb-3">
//           💌 Your Anonymous Message Link
//         </h3>
//         <div className="flex flex-col sm:flex-row gap-3 items-center">
//           <a
//             href={userLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline break-all text-sm"
//           >
//             {userLink}
//           </a>
//           <button
//             onClick={handleCopyLink}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-150 shadow-sm"
//           >
//             {copied ? "✅ Copied!" : "Copy Link"}
//           </button>
//         </div>
//         <div className="flex items-center mt-4 gap-2">
//           <label className="text-sm text-gray-700 font-medium">
//             Accepting Messages:
//           </label>
//           <button
//             onClick={toggleAcceptingMessages}
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               acceptingMessages
//                 ? "bg-green-500 text-white hover:bg-green-600"
//                 : "bg-gray-400 text-white hover:bg-gray-500"
//             } transition duration-150`}
//           >
//             {acceptingMessages ? "ON" : "OFF"}
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div>
//         <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//           📥 Received Messages
//         </h3>
//         {error && <p className="text-red-600 mb-4">{error}</p>}
//         {loading ? (
//           <div className="space-y-4">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="animate-pulse bg-gray-200 h-24 rounded-lg"
//               ></div>
//             ))}
//           </div>
//         ) : messages.length === 0 ? (
//           <p className="text-gray-500 text-sm">No messages received yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {messages.map((message) => (
//               <li
//                 key={message._id}
//                 className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition duration-200 relative"
//               >
//                 <div className="text-gray-700">{message.content}</div>
//                 <small className="block mt-2 text-gray-400 text-xs">
//                   Received on: {new Date(message.createdAt).toLocaleString()}
//                 </small>
//                 <button
//                   onClick={() => handleDelete(message._id)}
//                   className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
//                   title="Delete this message"
//                 >
//                   🗑
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { Toast } from "../ui/Toast";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { FiRefreshCcw } from "react-icons/fi";

function Dashboard() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [acceptingMessages, setAcceptingMessages] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    messageId: null,
  });

  const navigate = useNavigate();
  const [copied, copy] = useCopyToClipboard();
  const token = localStorage.getItem("jwtToken");

  const userId = user?.id || null;
  const uniqueId = user?.uniqueId || null;
  const userLink = uniqueId
    ? `${window.location.origin}/send/${uniqueId}`
    : "Loading link...";

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getProfile(token);
        setAcceptingMessages(res.user.isAcceptingMessages);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // ✅ Single reusable fetchMessages
  const fetchMessages = useCallback(async () => {
    if (!userId || !token) return;
    setError("");
    setLoading(true);
    try {
      const res = await api.getMessages(token);
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
        if (res.data.length === 0) showToast("error", "No messages found");
      } else {
        throw new Error(res.message || "Unexpected response format");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch messages.");
      if (err.message === "Unauthorized" || err.message === "Session expired") {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [userId, token, logout, navigate]);

  // ✅ Initial fetch & auto refresh on tab switch
  useEffect(() => {
    fetchMessages();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMessages();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchMessages]);

  const handleCopyLink = () => {
    copy(userLink);
    showToast("success", "Link copied to clipboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = (messageId) => {
    setDeleteModal({ show: true, messageId });
  };

  const confirmDelete = async () => {
    const { messageId } = deleteModal;
    try {
      const res = await api.deleteMessage(messageId, token);
      if (res.message === "Message deleted successfully") {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        showToast("success", "Message deleted");
      } else {
        showToast("error", res.message || "Failed to delete message");
      }
    } catch (err) {
      showToast("error", "Something went wrong while deleting");
    } finally {
      setDeleteModal({ show: false, messageId: null });
    }
  };

  const toggleAcceptingMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/accepting-messages`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accepting: !acceptingMessages }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setAcceptingMessages(data.isAcceptingMessages);
        showToast(
          "success",
          `Messages turned ${data.isAcceptingMessages ? "ON" : "OFF"}`
        );
      } else {
        showToast("error", data.message || "Failed to toggle status");
      }
    } catch (error) {
      showToast("error", "Toggle failed");
      console.error("Toggle Accepting Messages Error:", error);
    }
  };

  if (!userId) {
    return (
      <div className="text-center text-gray-600">Loading dashboard...</div>
    );
  }

  return (
    <div className="relative p-6 sm:p-10 max-w-4xl mx-auto">
      {/* ✅ Toast */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false })}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-5/12 shadow-lg">
            <h2 className="text-xl font-bold text-black mb-3">
              Are you absolutely sure?
            </h2>
            <p className="text-gray-700 mb-6 text-sm">
              This action cannot be undone. This will permanently delete this
              message from our servers.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, messageId: null })}
                className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-300 transition border-gray-500 shadow-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-black text-white hover:bg-red-700 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">👋 Welcome back!</h2>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Link */}
      <div className="bg-blue-50 p-5 rounded-xl shadow-md mb-10">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💌 Your Anonymous Message Link
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <a
            href={userLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all text-sm"
          >
            {userLink}
          </a>
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-150 shadow-sm"
          >
            {copied ? "✅ Copied!" : "Copy Link"}
          </button>
        </div>
        <div className="flex items-center mt-4 gap-2">
          <label className="text-sm text-gray-700 font-medium">
            Accepting Messages:
          </label>
          <button
            onClick={toggleAcceptingMessages}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              acceptingMessages
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-400 text-white hover:bg-gray-500"
            } transition duration-150`}
          >
            {acceptingMessages ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          📥 Received Messages
        </h3>
        <button
          onClick={fetchMessages}
          title="Reload Messages"
          className="p-3 hover:bg-gray-200 backdrop:*:first-letter:hover:bg-gray-300 transition duration-200 mb-4 border rounded-lg border-gray-300 text-gray-600 hover:text-gray-800"
        >
          <FiRefreshCcw size={17} />
        </button>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-24 rounded-lg"
              ></div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages received yet.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message._id}
                className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition duration-200 relative"
              >
                <div className="text-gray-700">{message.content}</div>
                <small className="block mt-2 text-gray-400 text-xs">
                  Received on: {new Date(message.createdAt).toLocaleString()}
                </small>
                <button
                  onClick={() => handleDelete(message._id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-sm"
                  title="Delete this message"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
