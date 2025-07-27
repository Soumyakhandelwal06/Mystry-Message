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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
function Dashboard() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log("navigate is", typeof navigate); // ✅ Should log "function"
  const [copied, copy] = useCopyToClipboard();
  const token = localStorage.getItem("jwtToken"); // ✅ get token properly
  // const userId = user ? user.userId : null;
  const userId = user?.id || null;
  const uniqueId = user?.uniqueId || null; // ✅ ADD THIS LINE
  const userLink = uniqueId
    ? `${window.location.origin}/send/${uniqueId}`
    : "Loading link...";

  console.log("User:", user); // Should have .id
  console.log("Token:", token); // Should NOT be null

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!userId || !token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const fetchMessages = async () => {
      setError("");
      try {
        const res = await api.getMessages(token);
        if (res.success) {
          setMessages(res.data);
        } else {
          throw new Error(res.message || "Failed to load messages");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch messages.");
        if (
          err.message === "Unauthorized" ||
          err.message === "Session expired"
        ) {
          logout();
          navigate("/login");
        }
      }
    };

    fetchMessages();
  }, [userId, token, logout, navigate]);

  const handleCopyLink = () => {
    copy(userLink);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!userId) {
    return (
      <div className="text-center text-gray-600">Loading dashboard...</div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <button
        onClick={handleLogout}
        className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Your Unique Message Link:
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <a
            href={userLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 truncate block w-full sm:w-auto"
          >
            {userLink}
          </a>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Received Messages:
      </h3>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {messages.length === 0 ? (
        <p className="text-gray-600">No messages received yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <strong className="text-gray-800">From: Anonymous</strong>
              <p className="mt-2 text-gray-700">{message.content}</p>
              <small className="block mt-2 text-gray-500 text-xs">
                Received on: {new Date(message.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
