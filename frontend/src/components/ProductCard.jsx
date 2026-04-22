import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const BADGE_STYLES = {
  HOT:        "rgba(255,107,53,0.14);color:#ff6b35;border:1px solid rgba(255,107,53,0.28)",
  LIMITED:    "rgba(255,69,96,0.14);color:#ff4560;border:1px solid rgba(255,69,96,0.28)",
  SALE:       "rgba(232,255,71,0.10);color:#e8ff47;border:1px solid rgba(232,255,71,0.28)",
  NEW:        "rgba(123,97,255,0.14);color:#7b61ff;border:1px solid rgba(123,97,255,0.28)",
  BESTSELLER: "rgba(0,229,153,0.10);color:#00e599;border:1px solid rgba(0,229,153,0.28)",
};

export default function ProductCard({ product: p }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!user) { toast("Please sign in to add to cart", true); return; }
    try { await addItem(p._id); toast(p.name + " added to cart"); }
    catch(err) { toast(err.response?.data?.error || "Failed to add", true); }
  };

  const bs = p.badge ? BADGE_STYLES[p.badge] : null;

  return (
    <div onClick={() => navigate("/product/" + p._id)}
      style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:20, cursor:"pointer", transition:"all 0.2s", position:"relative", overflow:"hidden" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 44px rgba(0,0,0,0.45)"}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
      {p.badge && <div style={{ position:"absolute", top:13, right:13, padding:"3px 8px", borderRadius:5, fontSize:9, fontWeight:800, letterSpacing:1, fontFamily:"'DM Mono',monospace", background:bs.split(";")[0] }}>{p.badge}</div>}
      <span style={{ fontSize:44, marginBottom:14, display:"block" }}>{p.emoji}</span>
      <div style={{ fontSize:14, fontWeight:700, marginBottom:5, lineHeight:1.35 }}>{p.name}</div>
      <div style={{ fontSize:12, color:"var(--text3)", lineHeight:1.55, marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.description}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div><span style={{ fontSize:17, fontWeight:800 }}>${p.price}</span><span style={{ fontSize:11, color:"var(--text3)", textDecoration:"line-through", marginLeft:5 }}>${p.originalPrice}</span></div>
        <div style={{ fontSize:11, color:"var(--text3)" }}><span style={{ color:"var(--accent)" }}>★</span>{p.rating}</div>
      </div>
      <div style={{ fontSize:10, color: p.stock<8?"var(--accent2)":"var(--text3)", marginTop:5, fontFamily:"'DM Mono',monospace" }}>
        {p.stock<8 ? "⚡ Only "+p.stock+" left" : p.stock+" in stock"}
      </div>
      <button onClick={handleAdd} style={{ width:"100%", padding:10, marginTop:13, borderRadius:9, border:"1px solid var(--border2)", background:"var(--bg3)", color:"var(--text)", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s", letterSpacing:0.3 }}
        onMouseEnter={e=>{e.target.style.background="var(--accent)";e.target.style.color="#000";e.target.style.borderColor="var(--accent)"}}
        onMouseLeave={e=>{e.target.style.background="var(--bg3)";e.target.style.color="var(--text)";e.target.style.borderColor="var(--border2)"}}>
        Add to Cart
      </button>
    </div>
  );
}
