import { useState, useEffect } from "react";
import * as api from "../services/api";
import { useToast } from "../context/ToastContext";

const STATUS_STYLE = { Processing:{color:"var(--yellow)"},Shipped:{color:"var(--accent3)"},Delivered:{color:"var(--green)"},Cancelled:{color:"var(--red)"} };

export default function AdminPage() {
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [np, setNp] = useState({ name:"",price:"",originalPrice:"",category:"electronics",stock:"10",badge:"",emoji:"📦",description:"",featured:false });

  useEffect(() => {
    Promise.all([api.getAllOrders(), api.getProducts({ limit:100 })])
      .then(([o,p]) => { setOrders(o.data); setProducts(p.data.products); })
      .finally(() => setLoading(false));
  }, []);

  const addProduct = async () => {
    if (!np.name||!np.price) { toast("Name and price required", true); return; }
    const res = await api.createProduct({ ...np, price:+np.price, originalPrice:+(np.originalPrice||np.price), stock:+(np.stock||10), badge:np.badge||null });
    setProducts(p => [...p, res.data]);
    toast(np.name+" added!");
    setNp({ name:"",price:"",originalPrice:"",category:"electronics",stock:"10",badge:"",emoji:"📦",description:"",featured:false });
  };

  const delProduct = async (id) => {
    if (!window.confirm("Delete?")) return;
    await api.deleteProduct(id);
    setProducts(p => p.filter(x => x._id!==id));
    toast("Deleted");
  };

  const revenue = orders.reduce((s,o) => s+o.total, 0);

  return (
    <div style={{ maxWidth:1300, margin:"0 auto", padding:"40px 24px 80px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:600, letterSpacing:"-1px" }}>Admin <span style={{ color:"var(--accent)", fontStyle:"italic" }}>Dashboard</span></h1>
        <span style={{ padding:"4px 10px", borderRadius:6, background:"rgba(232,255,71,0.1)", color:"var(--accent)", fontSize:11, fontWeight:800, fontFamily:"'DM Mono',monospace" }}>ADMIN</span>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:28 }}>
        {["overview","products","orders"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 16px", borderRadius:9, fontSize:12, fontWeight:600, border:"1px solid "+(tab===t?"var(--accent)":"var(--border)"), background:tab===t?"var(--accent)":"var(--bg2)", color:tab===t?"#000":"var(--text2)", cursor:"pointer" }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
            {[["Revenue","$"+revenue.toLocaleString()],[" Orders",orders.length],["Products",products.length],["Avg Order", orders.length?"$"+(revenue/orders.length).toFixed(0):"—"]].map(([l,v]) => (
              <div key={l} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:18 }}>
                <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--text3)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{l}</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:800 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Product","Category","Price","Stock","Sold","Rating"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--text3)", letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
              <tbody>{products.map(p => (
                <tr key={p._id} style={{ transition:"background 0.15s" }}>
                  <td style={{ padding:"12px 14px", fontSize:13 }}><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:18 }}>{p.emoji}</span><span style={{ fontWeight:600 }}>{p.name}</span></div></td>
                  <td style={{ padding:"12px 14px" }}><span style={{ background:"rgba(123,97,255,0.1)", color:"var(--accent3)", padding:"3px 8px", borderRadius:5, fontSize:10, fontWeight:700 }}>{p.category}</span></td>
                  <td style={{ padding:"12px 14px", fontWeight:700, fontSize:13 }}>${p.price}</td>
                  <td style={{ padding:"12px 14px", fontSize:13, color:p.stock<8?"var(--red)":"var(--text)" }}>{p.stock}</td>
                  <td style={{ padding:"12px 14px", fontSize:13, color:"var(--text2)", fontFamily:"'DM Mono',monospace" }}>{p.sold||0}</td>
                  <td style={{ padding:"12px 14px", fontSize:13, color:"var(--accent)" }}>★ {p.rating}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {tab==="products" && (
        <>
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:24, marginBottom:20 }}>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:18 }}>+ Add New Product</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[["name","Name","text","Product name"],["emoji","Emoji","text","📦"],["price","Price","number","99"],["originalPrice","Original Price","number","129"],["stock","Stock","number","50"],["description","Description","text","Short description"]].map(([k,l,t,ph]) => (
                <div key={k}><label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>{l}</label>
                <input type={t} placeholder={ph} style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={np[k]} onChange={e=>setNp(p=>({...p,[k]:e.target.value}))} /></div>
              ))}
              <div><label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>Category</label>
              <select style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={np.category} onChange={e=>setNp(p=>({...p,category:e.target.value}))}>
                <option value="electronics">Electronics</option><option value="fashion">Fashion</option><option value="home">Home</option>
              </select></div>
              <div><label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>Badge</label>
              <select style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={np.badge} onChange={e=>setNp(p=>({...p,badge:e.target.value}))}>
                <option value="">None</option><option>HOT</option><option>NEW</option><option>SALE</option><option>BESTSELLER</option><option>LIMITED</option>
              </select></div>
            </div>
            <button onClick={addProduct} style={{ marginTop:16, padding:"9px 22px", background:"var(--accent)", color:"#000", fontWeight:700, border:"none", borderRadius:9, fontSize:13, cursor:"pointer" }}>+ Add Product</button>
          </div>
          <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Product","Price","Stock","Badge",""].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--text3)", letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
              <tbody>{products.map(p => (
                <tr key={p._id}><td style={{ padding:"12px 14px", fontSize:13 }}><span style={{ fontSize:18, marginRight:8 }}>{p.emoji}</span>{p.name}</td><td style={{ padding:"12px 14px" }}>${p.price}</td><td style={{ padding:"12px 14px" }}>{p.stock}</td><td style={{ padding:"12px 14px", fontSize:11 }}>{p.badge||"—"}</td>
                <td style={{ padding:"12px 14px" }}><button onClick={() => delProduct(p._id)} style={{ padding:"5px 12px", background:"rgba(255,69,96,0.12)", color:"var(--red)", border:"1px solid rgba(255,69,96,0.2)", borderRadius:7, fontSize:12, cursor:"pointer" }}>Delete</button></td></tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {tab==="orders" && (
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden" }}>
          {loading ? <div style={{ padding:40, textAlign:"center", color:"var(--text2)" }}>Loading…</div> : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Order ID","Date","Items","Total","Status","Update"].map(h => <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--text3)", letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
            <tbody>{orders.map(o => (
              <tr key={o._id}>
                <td style={{ padding:"12px 14px", fontFamily:"'DM Mono',monospace", fontSize:12, color:"var(--accent)" }}>{o._id}</td>
                <td style={{ padding:"12px 14px", fontSize:12, color:"var(--text2)" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:"12px 14px", fontSize:13 }}>{o.items.length}</td>
                <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700 }}>${o.total.toLocaleString()}</td>
                <td style={{ padding:"12px 14px" }}><span style={{ padding:"4px 11px", borderRadius:999, fontSize:10, fontWeight:800, fontFamily:"'DM Mono',monospace", ...STATUS_STYLE[o.status], background: {Processing:"rgba(255,184,0,0.12)",Shipped:"rgba(123,97,255,0.12)",Delivered:"rgba(0,229,153,0.12)",Cancelled:"rgba(255,69,96,0.12)"}[o.status] }}>{o.status}</span></td>
                <td style={{ padding:"12px 14px" }}>
                  <select style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:6, color:"var(--text)", padding:"4px 8px", fontSize:12, cursor:"pointer" }} value={o.status}
                    onChange={async e => {
                      await api.updateOrderStatus(o._id, e.target.value);
                      setOrders(prev => prev.map(x => x._id===o._id?{...x,status:e.target.value}:x));
                      toast("Order updated → "+e.target.value);
                    }}>
                    <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>)}
        </div>
      )}
    </div>
  );
}
