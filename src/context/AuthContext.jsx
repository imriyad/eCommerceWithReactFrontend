import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
export const AuthContext = createContext();

// AuthProvider to wrap around app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Add this custom hook
export const useAuth = () => useContext(AuthContext);
