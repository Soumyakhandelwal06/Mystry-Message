// // src/App.js
// import React from "react";
// import Login from "./components/Auth/Login"; // No curly braces for default export
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useAuth } from "./hooks/useAuth";
// // No need to import './App.css' if you've moved all directives to index.css

// // Import your components
// import Signup from "./components/Auth/Signup";
// import VerifyOtp from "./components/Auth/VerifyOtp";

// import Dashboard from "./components/Dashboard/Dashboard";
// import SendMessage from "./components/Public/SendMessage";
// import NotFound from "./components/Public/Notfind";

// function App() {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-xl font-semibold text-gray-700">
//           Loading authentication status...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
//           <Routes>
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/verify-otp" element={<VerifyOtp />} />
//             <Route path="/login" element={<Login />} />

//             {/* Protected Dashboard Route */}
//             <Route
//               path="/dashboard"
//               element={
//                 isAuthenticated ? (
//                   <Dashboard />
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />

//             {/* Public Send Message Route */}
//             <Route path="/send/:userId" element={<SendMessage />} />

//             {/* Redirect from root based on auth status */}
//             <Route
//               path="/"
//               element={
//                 isAuthenticated ? (
//                   <Navigate to="/dashboard" replace />
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />

//             {/* Handle 404 - Keep this at the end */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { useAuth } from "./hooks/useAuth";

// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import VerifyOtp from "./components/Auth/VerifyOtp";
// import Dashboard from "./components/Dashboard/Dashboard";
// import SendMessage from "./components/Public/SendMessage";
// import NotFound from "./components/Public/Notfind";

// function App() {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-xl font-semibold text-gray-700">
//           Loading authentication status...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/dashboard"
//           element={
//             isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
//           }
//         />
//         <Route path="/send/:userId" element={<SendMessage />} />
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
