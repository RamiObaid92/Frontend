import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    roles: [],
    apiKeys: { AdminKey: null, UserKey: null }, 
    loading: true,
    error: null,
  });


  useEffect(() => {
    console.log("[AuthContext] Running initial auth check (me)...");
    authApi
      .me()
      .then((data) => {
        console.log("[AuthContext] 'me' success:", data);
        setState((prev) => ({
          ...prev,
          user: data.user,
          roles: data.user?.roles || [],
          loading: false,
          error: null,
        }));
      })
      .catch((err) => {
        console.log("[AuthContext] 'me' failed (likely not logged in):", err.message);
        setState((prev) => ({ ...prev, user: null, roles: [], loading: false }));
      });
  }, []);

  const signIn = useCallback(async (creds) => {
    console.log("[AuthContext] Attempting signIn...");
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await authApi.signIn(creds);
      console.log("[AuthContext] signIn success:", data);
      setState({
        user: data.user,
        roles: data.user?.roles || [],
        // *** FIX: Map backend's lowercase keys to frontend's uppercase keys ***
        apiKeys: {
          AdminKey: data.apiKeys?.adminKey || null, 
          UserKey: data.apiKeys?.userKey || null
        },
        loading: false,
        error: null,
      });
      return data.user;
    } catch (err) {
      console.error("[AuthContext] signIn error:", err);
      setState({ user: null, roles: [], apiKeys: { AdminKey: null, UserKey: null }, loading: false, error: err.message });
      throw err;
    }
  }, []);


  const signOut = useCallback(async () => {
    const currentApiKeys = state.apiKeys;
    console.log("[AuthContext] Attempting signOut with keys:", currentApiKeys);
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await authApi.signOut(currentApiKeys);
      console.log("[AuthContext] signOut API call successful.");
    } catch (err) {
      console.error("[AuthContext] signOut API call failed:", err);
    }
    console.log("[AuthContext] Clearing user state after signOut attempt.");
    setState({ user: null, roles: [], apiKeys: { AdminKey: null, UserKey: null }, loading: false, error: null });
  }, [state.apiKeys]);


  const signUp = useCallback(async (data) => {
     console.log("[AuthContext] Attempting signUp...");
     try {
        const result = await authApi.signUp(data);
        console.log("[AuthContext] signUp success:", result);
        return result;
     } catch (err) {
        console.error("[AuthContext] signUp error:", err);

        setState(prev => ({ ...prev, error: err.message })); 
        throw err; 
     }
  }, []);

  console.log("[AuthContext] Current state:", state);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.user,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
