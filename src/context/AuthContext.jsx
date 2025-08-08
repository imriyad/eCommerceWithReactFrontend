// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from sessionStorage on initial mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // Login function: save user to state and sessionStorage
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function: clear user state and sessionStorage
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // ✅ Extract role from the user object
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = () => useContext(AuthContext);
