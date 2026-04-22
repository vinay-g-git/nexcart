import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as api from "../services/api";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("account");
  const [form, setForm] = useState({ name: user?.name||"", email: user?.email||"" });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => { api.getMyOrders().then(r => setOrders(r.data)).catch(()=>{}); }, []);

  const save = async () => {
    setSaving(true);
    try { await updateUser(form); toast("Profile updated!"); }
    catch(e) { toast(e.response?.data?.error||e.message, true); }
    finally { setSaving(false); }
  };

  const totalSpent = orders.reduce((s,o) => s+o.total, 0);

  return (
    <div style={{ maxWidth:1300, margin:"0 auto", padding:"40px 24px 80px", display:"grid", gridTemplateColumns:"260px 1fr", gap:20, alignItems:"start" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:22 }}>
          <div style={{ width:68, height:68, borderRadius:14, background:"linear-gradient(135deg,var(--accent3),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"white", marginBottom:14 }}>{user?.avatar||user?.name?.[0]}</div>
          <div style={{ fontSize:17, fontWeight:800, marginBottom:4 }}>{user?.name}</div>
          <div style={{ fontSize:12, color:"var(--text3)" }}>{user?.email}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14 }}>
            {[{num:orders.length,label:"Orders"},{num:"$"+totalSpent.toLocaleString(),label:"Spent"}].map(s => (
              <div key={s.label} style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, padding:14, textAlign:"center" }}>
                <div style={{ fontSize:21, fontWeight:800 }}>{s.num}</div>
                <div style={{ fontSize:10, color:"var(--text3)", marginTop:2, fontFamily:"'DM Mono',monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:3 }}>
            {[{id:"account",icon:"👤",label:"Account"},{id:"security",icon:"🔐",label:"Security"}].map(m => (
              <div key={m.id} onClick={() => setTab(m.id)} style={{ padding:"10px 11px", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", color: tab===m.id?"var(--accent)":"var(--text2)", background: tab===m.id?"rgba(232,255,71,0.09)":"none", display:"flex", alignItems:"center", gap:9 }}>
                <span>{m.icon}</span>{m.label}
              </div>
            ))}
            <div onClick={() => navigate("/orders")} style={{ padding:"10px 11px", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", color:"var(--text2)", display:"flex", alignItems:"center", gap:9 }}>
              <span>📦</span>My Orders
            </div>
            <hr style={{ border:"none", borderTop:"1px solid var(--border)", margin:"6px 0" }} />
            <div onClick={async()=>{await logout();toast("Signed out");navigate("/");}} style={{ padding:"10px 11px", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", color:"var(--red)", display:"flex", alignItems:"center", gap:9 }}>
              <span>🚪</span>Sign Out
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:24 }}>
        {tab==="account" && <>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:20 }}>Account Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[["name","Name","text"],["email","Email","email"]].map(([k,l,t]) => (
              <div key={k}><label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>{l}</label>
              <input type={t} style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} /></div>
            ))}
          </div>
          <button disabled={saving} onClick={save} style={{ padding:"9px 22px", background:"var(--accent)", color:"#000", fontWeight:700, border:"none", borderRadius:9, fontSize:13, cursor:"pointer" }}>
            {saving?"Saving…":"Save Changes"}
          </button>
        </>}
        {tab==="security" && <>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:20 }}>Security</div>
          {[["Current Password"],["New Password"],["Confirm Password"]].map(([l]) => (
            <div key={l} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>{l}</label>
              <input type="password" style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }} />
            </div>
          ))}
          <button onClick={() => toast("Password updated!")} style={{ padding:"9px 22px", background:"var(--accent)", color:"#000", fontWeight:700, border:"none", borderRadius:9, fontSize:13, cursor:"pointer" }}>Update Password</button>
        </>}
      </div>
    </div>
  );
}
