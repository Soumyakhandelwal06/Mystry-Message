// // // src/components/auth/Login.js
// // import React, { useState } from "react";
// // import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// // import { useAuth } from "../../hooks/useAuth";
// // import { api } from "../../services/api";
// // import Button from "../ui/Button"; // ❌ might not work depending on current depth
// // // ✅ if you're 2 levels deep

// // // ✅ correct

// // // adjust path based on your file location

// // import { Input } from "../ui/Input";
// // import { LoadingSpinner } from "../ui/LoadingSpinner";
// // import { Layout } from "../layout/Layout";
// // import { UI_MESSAGES } from "../../utils/constants";

// // export const Login = ({ navigate }) => {
// //   const { login } = useAuth();
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// import React, { useState } from "react";
// import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // ✅ added
// import { useAuth } from "../../hooks/useAuth";
// import { api } from "../../services/api";
// import Button from "../ui/Button";
// import { Input } from "../ui/Input";
// import { LoadingSpinner } from "../ui/LoadingSpinner";
// import { Layout } from "../layout/Layout";
// import { UI_MESSAGES } from "../../utils/constants";

// export const Login = () => {
//   // ✅ no longer takes { navigate }
//   const { login } = useAuth();
//   const navigate = useNavigate(); // ✅ correctly initialized

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const result = await api.login(formData);

//       if (result.success) {
//         login(result.user, result.token);
//         navigate("/dashboard");
//       } else {
//         setError(result.message || UI_MESSAGES.INVALID_CREDENTIALS);
//       }
//     } catch (err) {
//       setError(UI_MESSAGES.NETWORK_ERROR);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Sign In
//         </h2>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             icon={Mail}
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <div className="relative">
//             <Input
//               icon={Lock}
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <EyeOff className="w-5 h-5" />
//               ) : (
//                 <Eye className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? <LoadingSpinner /> : "Sign In"}
//           </Button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             Don't have an account?{" "}
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-blue-600 hover:text-blue-800 font-medium"
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       </div>
//     </Layout>
//   );
// };
// export default Login;
// ✅ Login.js
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.login(formData);
      console.log("Login API result:", result);
      if (result.success) {
        login(result.token, navigate);
        navigate("/dashboard");
        console.log("Login successful, navigating to dashboard...");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign In
        </h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
