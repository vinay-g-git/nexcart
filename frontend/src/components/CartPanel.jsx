import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPanel({ open, onClose }) {
  const { cart, updateItem } = useCart();
  const navigate = useNavigate();
  const shipping = cart.total > 300 ? 0 : 12;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:300, opacity: open?1:0, pointerEvents: open?"all":"none", transition:"opacity 0.25s", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"fixed", right: open?0:-460, top:0, bottom:0, width:430, maxWidth:"100vw", background:"var(--bg2)", borderLeft:"1px solid var(--border)", zIndex:301, display:"flex", flexDirection:"column", transition:"right 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ padding:"22px 22px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:17, fontWeight:800 }}>Cart <span style={{ color:"var(--text3)", fontWeight:400, fontSize:14 }}>({cart.items.length})</span></div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, background:"var(--bg3)", border:"1px solid var(--border)", cursor:"pointer", color:"var(--text2)", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {cart.items.length === 0 ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"var(--text3)", gap:10, padding:40 }}>
            <div style={{ fontSize:48, opacity:0.3 }}>🛒</div>
            <div style={{ fontWeight:600, fontSize:14 }}>Your cart is empty</div>
          </div>
        ) : (
          <div style={{ flex:1, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:9 }}>
            {cart.items.map(item => (
              <div key={item.product || item.productId} style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:11, padding:13, display:"flex", gap:11, alignItems:"center" }}>
                <div style={{ width:44, height:44, borderRadius:8, background:"var(--bg2)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:3 }}>{item.name}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:"var(--accent)" }}>${(item.price*item.qty).toLocaleString()}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:7 }}>
                    <button onClick={() => updateItem(item.product || item.productId, item.qty-1)} style={{ width:22, height:22, borderRadius:5, background:"var(--bg2)", border:"1px solid var(--border)", color:"var(--text)", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <span style={{ fontSize:13, fontWeight:700, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateItem(item.product || item.productId, item.qty+1)} style={{ width:22, height:22, borderRadius:5, background:"var(--bg2)", border:"1px solid var(--border)", color:"var(--text)", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                    <span onClick={() => updateItem(item.product || item.productId, 0)} style={{ fontSize:11, color:"var(--text3)", cursor:"pointer", marginLeft:"auto" }}>Remove</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.items.length > 0 && (
          <div style={{ padding:18, borderTop:"1px solid var(--border)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:"var(--text2)" }}>Subtotal</span><span>${cart.total.toLocaleString()}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:"var(--text2)" }}>Shipping</span><span>{shipping===0?"Free 🎉":"$"+shipping}</span></div>
            <hr style={{ border:"none", borderTop:"1px solid var(--border)", margin:"10px 0" }} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:19, fontWeight:800, marginBottom:14 }}><span>Total</span><span>${(cart.total+shipping).toLocaleString()}</span></div>
            <button onClick={() => { onClose(); navigate("/checkout"); }}
              style={{ width:"100%", padding:15, background:"var(--accent)", color:"#000", fontWeight:800, border:"none", borderRadius:12, fontSize:14, cursor:"pointer" }}>
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
