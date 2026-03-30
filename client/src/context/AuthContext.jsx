import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const anonId = localStorage.getItem("anonymousId");
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else if (anonId) {
      setUser({ id: anonId, isAnonymous: true });
    }
    setLoading(false);
  }, []);

  const loginAnonymous = async () => {
    const { data } = await api.post("/auth/anonymous");
    localStorage.setItem("anonymousId", data.userId);
    setUser({ id: data.userId, isAnonymous: true });
  };

  const register = async (email, password, role) => {
    const { data } = await api.post("/auth/register", { email, password, role });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.removeItem("anonymousId");
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.removeItem("anonymousId");
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("anonymousId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAnonymous, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
