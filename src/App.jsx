import { AuthProvider } from "./context/AuthContext"; // adjust path based on where you declared AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
