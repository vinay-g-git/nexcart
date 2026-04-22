import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      toast(mode === "login" ? "Welcome back!" : "Account created!");
      onClose();
    } catch(e) { setErr(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:20, padding:36, width:420, maxWidth:"calc(100vw - 32px)" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:600, marginBottom:6 }}>{mode==="login"?"Welcome back":"Create account"}</div>
        <div style={{ fontSize:13, color:"var(--text2)", marginBottom:28 }}>{mode==="login"?"Sign in to your NexCart account":"Join NexCart today"}</div>
        {mode==="register" && (
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>Full Name</label>
            <input style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }}
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Jordan Dev" />
          </div>
        )}
        {["email","password"].map(field => (
          <div key={field} style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace" }}>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
            <input type={field} style={{ display:"block", width:"100%", marginTop:7, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:14, outline:"none" }}
              value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              placeholder={field==="email"?"you@example.com":"••••••••"} />
          </div>
        ))}
        {err && <div style={{ fontSize:12, color:"var(--red)", marginBottom:12 }}>⚠ {err}</div>}
        <button disabled={loading} onClick={submit}
          style={{ width:"100%", padding:14, background:"var(--accent)", color:"#000", fontWeight:800, border:"none", borderRadius:11, fontSize:14, cursor:"pointer", marginTop:4 }}>
          {loading ? "Please wait…" : mode==="login" ? "Sign In" : "Create Account"}
        </button>
        <div style={{ fontSize:13, color:"var(--text2)", textAlign:"center", marginTop:18 }}>
          {mode==="login" ? <>New here? <span style={{ color:"var(--accent)", cursor:"pointer", fontWeight:700 }} onClick={()=>{setMode("register");setErr("");}}>Create account</span></>
           : <>Have an account? <span style={{ color:"var(--accent)", cursor:"pointer", fontWeight:700 }} onClick={()=>{setMode("login");setErr("");}}>Sign in</span></>}
        </div>
      </div>
    </div>
  );
}
