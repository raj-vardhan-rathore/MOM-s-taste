import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      setShop(data.shop || null);
    } catch {
      setUser(null);
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { transports: ["websocket"] });
    s.emit("join", user._id);
    setSocket(s);
    return () => s.disconnect();
  }, [user?._id]);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("moms_taste_token", data.token);
    await fetchMe();
    return data;
  };

  const registerParent = async (payload) => {
    const { data } = await api.post("/auth/register/parent", payload);
    localStorage.setItem("moms_taste_token", data.token);
    await fetchMe();
    return data;
  };

  const registerShopOwner = async (payload) => {
    const { data } = await api.post("/auth/register/shop-owner", payload);
    localStorage.setItem("moms_taste_token", data.token);
    await fetchMe();
    return data;
  };

  const logout = () => {
    localStorage.removeItem("moms_taste_token");
    setUser(null);
    setShop(null);
  };

  const value = useMemo(
    () => ({ user, shop, loading, socket, login, registerParent, registerShopOwner, logout, refreshUser: fetchMe }),
    [user, shop, loading, socket]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
