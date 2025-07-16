import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session on initial load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("authToken");
          setAuthUser(null);
          navigate("/signin");
          toast.error("Session expired, please sign in");
          return;
        }
        const res = await api.get("/users/me");
        setAuthUser(res.data);
      } catch (err) {
        localStorage.removeItem("authToken");
        setAuthUser(null);
        navigate("/signin");
        toast.error("Invalid session, please sign in");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, [navigate]);


  // Login function
  const login = (user, token) => {
    localStorage.setItem("authToken", token);
    setAuthUser(user);
    navigate("/dashboard");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthUser(null);
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  // Update user profile
  const updateProfile = (user) => {
    setAuthUser(user);
  };

  return (
    <AuthContext.Provider
      value={{ authUser, login, logout, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};