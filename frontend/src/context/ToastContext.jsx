import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

let id = 0;
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, error = false) => {
    const tid = ++id;
    setToasts(t => [...t, { id: tid, msg, error, on: false }]);
    setTimeout(() => setToasts(t => t.map(x => x.id === tid ? { ...x, on: true } : x)), 10);
    setTimeout(() => setToasts(t => t.map(x => x.id === tid ? { ...x, on: false } : x)), 3000);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== tid)), 3400);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:999, display:"flex", flexDirection:"column-reverse", gap:8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background:"var(--bg3)", border: t.error ? "1px solid rgba(255,69,96,0.3)" : "1px solid var(--border2)",
            borderRadius:11, padding:"13px 17px", display:"flex", alignItems:"center", gap:9,
            fontSize:13, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.4)", minWidth:260,
            transform: t.on ? "translateX(0)" : "translateX(120%)", opacity: t.on ? 1 : 0,
            transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <span style={{ fontSize:17 }}>{t.error ? "⚠" : "✓"}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
