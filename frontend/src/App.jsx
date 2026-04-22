import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, adminRequired = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"50vh", color:"var(--text2)" }}>Loading…</div>;
  if (!user) return <Navigate to="/" replace />;
  if (adminRequired && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <Navbar />
      <main style={{ flex:1 }}>
        <Routes>
          <Route path="/"             element={<StorePage />} />
          <Route path="/product/:id"  element={<ProductPage />} />
          <Route path="/checkout"     element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders"       element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin"        element={<ProtectedRoute adminRequired><AdminPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer style={{ borderTop:"1px solid var(--border)", padding:"20px", textAlign:"center", color:"var(--text3)", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:1.5 }}>
        NEXCART · MERN ECOMMERCE · EXPRESS · MONGODB · REACT
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
