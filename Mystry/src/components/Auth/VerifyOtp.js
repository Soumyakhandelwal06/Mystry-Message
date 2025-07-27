// // src/components/Auth/VerifyOtp.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";

// const res = await api.verifyOTP(userId, otp);

// function VerifyOtp() {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await api.verifyOTP(userId, otp);

//       alert("OTP verified successfully! You can now log in.");
//       navigate("/login");
//     } catch (err) {
//       setError(
//         err.message || "An unexpected error occurred during OTP verification."
//       );
//     }
//   };

//   return (
//     <>
//       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Verify One-Time Password
//       </h2>
//       {error && (
//         <p className="mt-2 text-center text-sm text-red-600">{error}</p>
//       )}
//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="otp-input" className="sr-only">
//             Enter OTP
//           </label>
//           <input
//             id="otp-input"
//             name="otp"
//             type="text"
//             maxLength="6"
//             required
//             className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//         </div>
//         <div>
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Verify OTP
//           </button>
//         </div>
//       </form>
//       <p className="mt-4 text-center text-sm text-gray-600">
//         Check your registered phone or email for the OTP.
//       </p>
//     </>
//   );
// }

// export default VerifyOtp;
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { api } from "../../services/api";

// function VerifyOtp() {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { userId } = location.state || {};

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await api.verifyOTP(userId, otp);
//       if (res.success) {
//         alert("OTP verified successfully! You can now log in.");
//         navigate("/login");
//       } else {
//         setError(res.message || "OTP verification failed.");
//       }
//     } catch (err) {
//       setError(
//         err.message || "An unexpected error occurred during OTP verification."
//       );
//     }
//   };

//   return (
//     <>
//       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Verify One-Time Password
//       </h2>
//       {error && (
//         <p className="mt-2 text-center text-sm text-red-600">{error}</p>
//       )}
//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="otp-input" className="sr-only">
//             Enter OTP
//           </label>
//           <input
//             id="otp-input"
//             name="otp"
//             type="text"
//             maxLength="6"
//             required
//             className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//         </div>
//         <div>
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Verify OTP
//           </button>
//         </div>
//       </form>
//       <p className="mt-4 text-center text-sm text-gray-600">
//         Check your registered phone or email for the OTP.
//       </p>
//     </>
//   );
// }

// export default VerifyOtp;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";

// function VerifyOtp() {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const email = localStorage.getItem("otpEmail"); // ✅ get saved email

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const email = localStorage.getItem("otpEmail");
//       const res = await api.verifyOTP(email, otp);

//       if (res.success) {
//         alert("OTP verified successfully! You can now log in.");
//         navigate("/login");
//       } else if (res.message === "Account already verified") {
//         alert("Account already verified. Redirecting to login...");
//         navigate("/login");
//       } else {
//         setError(res.message || "OTP verification failed.");
//       }
//     } catch (err) {
//       setError(
//         err.message || "An unexpected error occurred during OTP verification."
//       );
//     }
//   };

//   return (
//     <>
//       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Verify One-Time Password
//       </h2>
//       {error && (
//         <p className="mt-2 text-center text-sm text-red-600">{error}</p>
//       )}
//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="otp-input" className="sr-only">
//             Enter OTP
//           </label>
//           <input
//             id="otp-input"
//             name="otp"
//             type="text"
//             maxLength="6"
//             required
//             className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//         </div>
//         <div>
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Verify OTP
//           </button>
//         </div>
//       </form>
//       <p className="mt-4 text-center text-sm text-gray-600">
//         Check your registered phone or email for the OTP.
//       </p>
//     </>
//   );
// }
// export default VerifyOtp;
// ✅ VerifyOtp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await api.verifyOTP(email, otp);
      if (result.success) {
        alert("OTP verified! You can now log in.");
        localStorage.removeItem("otpEmail");
        navigate("/login");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || "OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Verify One-Time Password
        </h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-center tracking-widest"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Verify OTP
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Check your registered phone or email for the OTP.
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
