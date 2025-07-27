// // src/components/Auth/Signup.js
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { api } from "../../services/api";
// function Signup() {
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const result = await api.signup({ email, phone, password });

//       if (result.success !== false) {
//         // 🟡 Save email for OTP screen
//         localStorage.setItem("otpEmail", email);

//         alert("Signup successful! Please verify your OTP.");
//         navigate("/verify-otp");
//       } else {
//         setError(result.message || "Signup failed.");
//       }
//     } catch (err) {
//       setError(err.message || "An unexpected error occurred during signup.");
//     }
//   };

//   return (
//     <>
//       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Create your account
//       </h2>
//       {error && (
//         <p className="mt-2 text-center text-sm text-red-600">{error}</p>
//       )}
//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div className="rounded-md shadow-sm -space-y-px">
//           <div>
//             <label htmlFor="signup-email" className="sr-only">
//               Email address
//             </label>
//             <input
//               id="signup-email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="signup-phone" className="sr-only">
//               Phone number
//             </label>
//             <input
//               id="signup-phone"
//               name="phone"
//               type="tel"
//               autoComplete="tel"
//               required
//               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="Phone number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="signup-password" className="sr-only">
//               Password
//             </label>
//             <input
//               id="signup-password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               required
//               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//         </div>

//         <div>
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Sign Up
//           </button>
//         </div>
//       </form>
//       <p className="mt-2 text-center text-sm text-gray-600">
//         Already have an account?{" "}
//         <Link
//           to="/login"
//           className="font-medium text-indigo-600 hover:text-indigo-500"
//         >
//           Log In
//         </Link>
//       </p>
//     </>
//   );
// }

// export default Signup;
// ✅ Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";

function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.signup({ email, phone, password });
      localStorage.setItem("otpEmail", email);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create your account
        </h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
