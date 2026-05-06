import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "portfolio_builder_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        if (!ignore) {
          setUser(data.user);
          setPortfolio(data.portfolio);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (!ignore) {
          setToken(null);
          setUser(null);
          setPortfolio(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setPortfolio(data.portfolio);
    return data;
  }

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setPortfolio(data.portfolio);
    return data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setPortfolio(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      portfolio,
      setPortfolio,
      loading,
      signup,
      login,
      logout
    }),
    [loading, portfolio, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
