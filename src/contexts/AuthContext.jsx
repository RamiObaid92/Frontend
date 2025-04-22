import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => {
        setUser(user);
        setRoles(user.roles || []);
      })
      .catch(() => {
        setUser(null);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (creds) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authApi.signIn(creds);
      setUser(user);
      setRoles(user.roles || []);
      return user;
    } catch (err) {
      setError(err.message);
      setUser(null);
      setRoles([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      setRoles([]);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        loading,
        error,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
