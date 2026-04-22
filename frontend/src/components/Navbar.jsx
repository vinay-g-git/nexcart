import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import CartPanel from "./CartPanel";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const totalQty = cart.items.reduce((s, i) => s + i.qty, 0);

  const handleLogout = async () => {
    await logout();
    toast("Signed out successfully");
    navigate("/");
  };

  return (
    <>
      <nav style={{ position:"sticky", top:0, zIndex:200, background:"rgba(9,9,12,0.88)", backdropFilter:"blur(24px)", borderBottom:"1px solid var(--border)", height:62 }}>
        <div style={{ maxWidth:1300, margin:"0 auto", padding:"0 24px", height:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", color:"inherit" }}>
            <div style={{ width:28, height:28, background:"var(--accent)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontSize:13, fontWeight:900 }}>N</div>
            <span style={{ fontSize:19, fontWeight:800, letterSpacing:"-0.5px" }}>NEX<span style={{ color:"var(--accent)" }}>CART</span></span>
          </Link>

          <div style={{ display:"flex", gap:4 }}>
            {[
              { to:"/",       label:"Store" },
              { to:"/orders", label:"Orders" },
              ...(user?.role === "admin" ? [{ to:"/admin", label:"Dashboard" }] : []),
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ padding:"7px 13px", borderRadius:9, fontSize:13, fontWeight:600, color:"var(--text2)", textDecoration:"none", transition:"all 0.15s" }}
                onMouseEnter={e => { e.target.style.background="var(--bg3)"; e.target.style.color="var(--text)"; }}
                onMouseLeave={e => { e.target.style.background=""; e.target.style.color="var(--text2)"; }}>
                {l.label}
              </Link>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative", width:38, height:38, borderRadius:10, background:"var(--bg3)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17 }}
              onClick={() => setCartOpen(true)}>
              🛒
              {totalQty > 0 && (
                <span style={{ position:"absolute", top:-3, right:-3, width:17, height:17, borderRadius:"50%", background:"var(--accent)", color:"#000", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--bg)" }}>
                  {totalQty}
                </span>
              )}
            </div>
            {user ? (
              <Link to="/profile">
                <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,var(--accent3),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"white", cursor:"pointer" }}>
                  {user.avatar || user.name[0]}
                </div>
              </Link>
            ) : (
              <button onClick={() => setAuthOpen(true)} style={{ padding:"8px 18px", background:"var(--accent)", color:"#000", fontWeight:700, border:"none", borderRadius:9, fontSize:13, cursor:"pointer" }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
