import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login({ email, password });
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api.register({ name, email, password });
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data) => {
    const res = await api.updateProfile(data);
    setUser(res.data);
    return res.data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
