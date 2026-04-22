import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0 }); return; }
    try {
      const res = await api.getCart();
      setCart(res.data);
    } catch { setCart({ items: [], total: 0 }); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = useCallback(async (productId, qty = 1) => {
    setLoading(true);
    try { const res = await api.addToCart(productId, qty); setCart(res.data); return true; }
    catch (e) { throw e; }
    finally { setLoading(false); }
  }, []);

  const updateItem = useCallback(async (productId, qty) => {
    const res = await api.updateCart(productId, qty);
    setCart(res.data);
  }, []);

  const clear = useCallback(async () => {
    const res = await api.clearCart();
    setCart(res.data);
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
