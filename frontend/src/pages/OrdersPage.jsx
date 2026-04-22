import { useState, useEffect } from "react";
import * as api from "../services/api";

const STATUS_STYLE = {
  Processing: { background:"rgba(255,184,0,0.12)", color:"var(--yellow)" },
  Shipped:    { background:"rgba(123,97,255,0.12)", color:"var(--accent3)" },
  Delivered:  { background:"rgba(0,229,153,0.12)",  color:"var(--green)" },
  Cancelled:  { background:"rgba(255,69,96,0.12)",  color:"var(--red)" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.getMyOrders().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth:1300, margin:"0 auto", padding:"40px 24px 80px" }}>
      <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:600, letterSpacing:"-1px", marginBottom:28 }}>Your <span style={{ color:"var(--accent)", fontStyle:"italic" }}>Orders</span></h1>
      {loading ? <div style={{ textAlign:"center", padding:60, color:"var(--text2)" }}>Loading orders…</div>
       : orders.length === 0 ? <div style={{ textAlign:"center", padding:80, color:"var(--text3)" }}><div style={{ fontSize:48, marginBottom:14, opacity:0.5 }}>📦</div><div style={{ fontWeight:700, fontSize:16 }}>No orders yet</div></div>
       : orders.map(o => (
        <div key={o._id} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, padding:"18px 20px", cursor:"pointer" }} onClick={() => setExpanded(expanded===o._id?null:o._id)}>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"var(--accent)" }}>{o._id}</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginTop:3 }}>{new Date(o.createdAt).toLocaleDateString()} · Est. {new Date(o.estimatedDelivery).toLocaleDateString()}</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ padding:"4px 11px", borderRadius:999, fontSize:10, fontWeight:800, fontFamily:"'DM Mono',monospace", ...STATUS_STYLE[o.status] }}>{o.status}</span>
              <div style={{ fontSize:17, fontWeight:800 }}>${o.total.toLocaleString()}</div>
              <span style={{ color:"var(--text3)", fontSize:12 }}>{expanded===o._id?"▲":"▼"}</span>
            </div>
          </div>
          {expanded === o._id && (
            <div style={{ padding:"0 20px 18px", borderTop:"1px solid var(--border)" }}>
              <div style={{ fontSize:12, color:"var(--text3)", margin:"14px 0 10px", fontFamily:"'DM Mono',monospace" }}>Via {o.paymentMethod} · {o.address?.street}, {o.address?.city}</div>
              {o.items.map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, marginBottom:8 }}>
                  <div style={{ width:32, height:32, background:"var(--bg3)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{item.emoji}</div>
                  <span style={{ flex:1 }}>{item.name}</span>
                  <span style={{ color:"var(--text3)" }}>×{item.qty}</span>
                  <span style={{ fontWeight:700 }}>${(item.price*item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
