import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const register = (data) => api.post("/auth/register", data);
export const login    = (data) => api.post("/auth/login", data);
export const logout   = ()     => api.post("/auth/logout");
export const getMe    = ()     => api.get("/auth/me");

// ── Products ─────────────────────────────────────────────────────────────────
export const getProducts  = (params) => api.get("/products", { params });
export const getFeatured  = ()       => api.get("/products/featured");
export const getProduct   = (id)     => api.get("/products/" + id);
export const createProduct = (data)  => api.post("/products", data);
export const updateProduct = (id, d) => api.put("/products/" + id, d);
export const deleteProduct = (id)    => api.delete("/products/" + id);

// ── Cart ─────────────────────────────────────────────────────────────────────
export const getCart     = ()           => api.get("/cart");
export const addToCart   = (productId, qty) => api.post("/cart", { productId, qty });
export const updateCart  = (productId, qty) => api.put("/cart/" + productId, { qty });
export const clearCart   = ()           => api.delete("/cart");

// ── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder     = (data) => api.post("/orders", data);
export const getMyOrders    = ()     => api.get("/orders");
export const getAllOrders    = ()     => api.get("/orders/all");
export const updateOrderStatus = (id, status) => api.put("/orders/" + id + "/status", { status });

// ── Reviews ──────────────────────────────────────────────────────────────────
export const getReviews  = (productId) => api.get("/reviews/" + productId);
export const addReview   = (data)      => api.post("/reviews", data);
export const deleteReview = (id)       => api.delete("/reviews/" + id);

// ── Users ────────────────────────────────────────────────────────────────────
export const updateProfile = (data) => api.put("/users/profile", data);
export const deleteAccount = ()        => api.delete("/users/profile");
export const getUsers      = ()        => api.get("/users");
export const deleteUser    = (id)      => api.delete("/users/" + id);

export default api;
