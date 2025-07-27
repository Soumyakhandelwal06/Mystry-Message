// src/utils/authHelpers.js
// (Optional - less needed if using AuthContext)

const TOKEN_KEY = "jwtToken";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// You could also add a function to decode the token here
// import { jwtDecode } from 'jwt-decode';
// export const decodeToken = () => {
//   const token = getToken();
//   if (token) {
//     try {
//       return jwtDecode(token);
//     } catch (e) {
//       console.error("Invalid token:", e);
//       removeToken(); // Remove invalid token
//       return null;
//     }
//   }
//   return null;
// };
