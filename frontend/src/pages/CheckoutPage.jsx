import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import * as api from "../services/api";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: user?.name?.split(" ")[0]||"", lastName: user?.name?.split(" ")[1]||"", email: user?.email||"", street:"", city:"", zip:"", country:"United States" });
  const [payMethod, setPayMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const shipping = cart.total > 300 ? 0 : 12;
  const total = cart.total + shipping;
  const f = (k,v) => setForm(p => ({...p,[k]:v}));

  const placeOrder = async () => {
    if (!form.street||!form.city||!form.zip) { toast("Please fill in shipping address", true); return; }
    setLoading(true);
    try {
      const order = await api.placeOrder({
        address: { street: form.street, city: form.city, zip: form.zip, country: form.country },
        paymentMethod: payMethod,
      });
      await refresh();
      toast("Order " + order.data._id + " placed!");
      navigate("/orders");
    } catch(e) { toast(e.response?.data?.error || "Order failed", true); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:1300, margin:"0 auto", padding:"40px 24px 80px", display:"grid", gridTemplateColumns:"1fr 380px", gap:28, alignItems:"start" }}>
      <div>
        {/* Shipping */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:24, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:800, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:"var(--accent)", color:"#000", fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>1</div>
            Shipping Address
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div><label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>First Name</label><input style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={form.firstName} onChange={e=>f("firstName",e.target.value)} /></div>
            <div><label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>Last Name</label><input style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={form.lastName} onChange={e=>f("lastName",e.target.value)} /></div>
          </div>
          {[["email","Email","email","you@email.com"],["street","Street Address","text","123 Main St"],["city","City","text","San Francisco"],["zip","ZIP","text","94102"]].map(([key,label,type,ph]) => (
            <div key={key} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>{label}</label>
              <input type={type} placeholder={ph} style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={form[key]} onChange={e=>f(key,e.target.value)} />
            </div>
          ))}
        </div>
        {/* Payment */}
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:800, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:"var(--accent)", color:"#000", fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>2</div>
            Payment Method
          </div>
          {[["card","💳","Credit / Debit Card","Visa, Mastercard, Amex"],["paypal","🅿️","PayPal","Pay via PayPal"],["cod","📦","Cash on Delivery","Pay on receipt"]].map(([id,icon,name,desc]) => (
            <div key={id} onClick={() => setPayMethod(id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", border:"1px solid " + (payMethod===id?"var(--accent)":"var(--border)"), borderRadius:10, cursor:"pointer", background: payMethod===id?"rgba(232,255,71,0.05)":"none", marginBottom:9 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div><div style={{ fontSize:13, fontWeight:600 }}>{name}</div><div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{desc}</div></div>
              <div style={{ marginLeft:"auto", width:16, height:16, borderRadius:"50%", border:"2px solid " + (payMethod===id?"var(--accent)":"var(--border2)"), background: payMethod===id?"var(--accent)":"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {payMethod===id && <div style={{ width:6, height:6, borderRadius:"50%", background:"#000" }} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:22, position:"sticky", top:80 }}>
        <div style={{ fontSize:14, fontWeight:800, marginBottom:18 }}>Order Summary</div>
        {cart.items.map(i => (
          <div key={i.product} style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
            <div style={{ width:36, height:36, background:"var(--bg3)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{i.emoji}</div>
            <div style={{ fontSize:12, fontWeight:600, flex:1 }}>{i.name} ×{i.qty}</div>
            <div style={{ fontSize:13, fontWeight:700 }}>${(i.price*i.qty).toLocaleString()}</div>
          </div>
        ))}
        <div style={{ marginTop:14 }}>
          {[["Subtotal", "$"+cart.total.toLocaleString()],["Shipping", shipping===0?"Free 🎉":"$"+shipping],["Tax","$0"]].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:7 }}><span style={{ color:"var(--text2)" }}>{l}</span><span>{v}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:17, fontWeight:800, marginTop:10, paddingTop:10, borderTop:"1px solid var(--border)" }}><span>Total</span><span>${total.toLocaleString()}</span></div>
        </div>
        <button disabled={loading || cart.items.length===0} onClick={placeOrder}
          style={{ width:"100%", padding:15, background:"var(--accent)", color:"#000", fontWeight:800, border:"none", borderRadius:12, fontSize:14, cursor:"pointer", marginTop:18, opacity: loading||cart.items.length===0?0.6:1 }}>
          {loading ? "Placing Order…" : "Place Order · $"+total.toLocaleString()}
        </button>
        <div style={{ fontSize:11, color:"var(--text3)", textAlign:"center", marginTop:10 }}>🔒 Secure checkout · 30-day returns</div>
      </div>
    </div>
  );
}
