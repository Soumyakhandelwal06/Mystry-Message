// import React from "react";

// // Button Component
// export const Button = ({
//   children,
//   variant = "primary",
//   loading = false,
//   ...props
// }) => {
//   const baseClasses =
//     "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
//     secondary:
//       "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100",
//     outline:
//       "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100",
//   };

//   return (
//     <button
//       {...props}
//       className={`${baseClasses} ${variants[variant]} ${props.className || ""}`}
//       disabled={loading || props.disabled}
//     >
//       {loading ? (
//         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
//       ) : (
//         children
//       )}
//     </button>
//   );
// };
