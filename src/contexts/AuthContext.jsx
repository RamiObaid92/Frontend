// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const AUTH_URL  = `${API_BASE}/api/auth`;

  const [user,    setUser]    = useState(null);
  const [roles,   setRoles]   = useState([]);
  const [loading, setLoading] = useState(false);

  // Sign In
  const signIn = async ({ email, password, rememberMe }) => {
    setLoading(true);
    const res = await fetch(`${AUTH_URL}/signin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe })
    });

    if (!res.ok) {
      setLoading(false);
      throw new Error("Invalid credentials");
    }

    const { user: u } = await res.json();
    setUser(u);
    setRoles(u.roles || []);
    setLoading(false);
    return u;
  };

  // Sign Up
  const signUp = async (formData) => {
    setLoading(true);
    const res = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setLoading(false);
    if (!res.ok) {
      if (res.status === 409) throw new Error("User already exists");
      throw new Error("Sign up failed");
    }
    return await res.json();
  };

  const signOut = async () => {
    await fetch(`${AUTH_URL}/signout`, {
      method: "POST",
      credentials: "include"
    });
    setUser(null);
    setRoles([]);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await fetch(`${AUTH_URL}/me`, { credentials: 'include' });
      if (res.ok) {
        const { user: u } = await res.json();
        setUser(u);
        setRoles(u.roles || []);
      }
      setLoading(false);
    };
  
    fetchUser();
  }, []);
  

  return (
    <AuthContext.Provider value={{
      user,
      roles,
      loading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}
