import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating:5, comment:"" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getProduct(id), api.getReviews(id)])
      .then(([p, r]) => { setProduct(p.data); setReviews(r.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast("Please sign in first", true); return; }
    try {
      for (let i = 0; i < qty; i++) await addItem(product._id);
      toast(product.name + " added to cart");
    } catch(e) { toast(e.response?.data?.error || "Failed", true); }
  };

  const submitReview = async () => {
    if (!user) { toast("Sign in to review", true); return; }
    if (!reviewForm.comment.trim()) { toast("Please write a comment", true); return; }
    setSubmitting(true);
    try {
      const res = await api.addReview({ productId: id, ...reviewForm });
      setReviews(prev => [res.data, ...prev]);
      const updated = await api.getProduct(id);
      setProduct(updated.data);
      setReviewForm({ rating:5, comment:"" });
      toast("Review submitted!");
    } catch(e) { toast(e.response?.data?.error || "Failed", true); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:80, color:"var(--text2)" }}>Loading…</div>;
  if (!product) return <div style={{ textAlign:"center", padding:80, color:"var(--text3)" }}>Product not found.</div>;

  const savePct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div style={{ maxWidth:1300, margin:"0 auto", padding:"48px 24px 80px", display:"grid", gridTemplateColumns:"1fr 460px", gap:52, alignItems:"start" }}>
      <div>
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:20, aspectRatio:1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:120 }}>{product.emoji}</div>
        <div style={{ marginTop:32 }}>
          <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, marginBottom:18 }}>Customer Reviews</h3>
          {reviews.map(r => (
            <div key={r._id} style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:12, padding:16, marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"var(--bg4)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{r.user?.name?.[0] || "U"}</div>
                <div><div style={{ fontSize:13, fontWeight:700 }}>{r.user?.name || "User"}</div><div style={{ color:"var(--accent)", fontSize:12 }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div></div>
                <div style={{ marginLeft:"auto", fontSize:11, color:"var(--text3)", fontFamily:"'DM Mono',monospace" }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ fontSize:13, lineHeight:1.6, color:"var(--text2)" }}>{r.comment}</div>
            </div>
          ))}
          {reviews.length === 0 && <div style={{ color:"var(--text3)", fontSize:13 }}>No reviews yet.</div>}
          <div style={{ marginTop:20, background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
            <div style={{ fontWeight:700, marginBottom:14, fontSize:14 }}>Write a Review</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text2)", textTransform:"uppercase", letterSpacing:0.8, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>Rating</div>
              <div style={{ display:"flex", gap:6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReviewForm(f=>({...f,rating:n}))} style={{ fontSize:22, background:"none", border:"none", cursor:"pointer", color: n<=reviewForm.rating?"var(--accent)":"var(--text3)" }}>★</button>
                ))}
              </div>
            </div>
            <textarea style={{ display:"block", width:"100%", marginTop:4, marginBottom:12, padding:"11px 13px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:9, color:"var(--text)", fontSize:13, outline:"none", resize:"vertical", fontFamily:"'Syne',sans-serif" }}
              rows={3} placeholder="Share your experience…" value={reviewForm.comment} onChange={e=>setReviewForm(f=>({...f,comment:e.target.value}))} />
            <button disabled={submitting} onClick={submitReview} style={{ padding:"9px 18px", background:"var(--accent)", color:"#000", fontWeight:700, border:"none", borderRadius:9, fontSize:13, cursor:"pointer" }}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>← Back</button>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:600, letterSpacing:"-1px", lineHeight:1.1, marginBottom:14 }}>{product.name}</h1>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:22 }}>
          <span style={{ color:"var(--accent)" }}>{"★".repeat(Math.floor(product.rating))}</span>
          <span style={{ fontSize:13, color:"var(--text2)" }}>{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
          <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"'DM Mono',monospace" }}>{product.sold?.toLocaleString()} sold</span>
        </div>
        <p style={{ fontSize:15, lineHeight:1.7, color:"var(--text2)", marginBottom:28 }}>{product.description}</p>
        <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:28 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:44, fontWeight:800 }}>${product.price}</span>
          <span style={{ fontSize:18, color:"var(--text3)", textDecoration:"line-through" }}>${product.originalPrice}</span>
          <span style={{ fontSize:13, padding:"4px 10px", background:"rgba(232,255,71,0.12)", color:"var(--accent)", borderRadius:6, fontWeight:700 }}>Save {savePct}%</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, padding:"4px 8px" }}>
            <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:28, height:28, borderRadius:7, background:"none", border:"none", color:"var(--text)", cursor:"pointer", fontSize:18 }}>−</button>
            <span style={{ fontSize:15, fontWeight:700, minWidth:22, textAlign:"center" }}>{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ width:28, height:28, borderRadius:7, background:"none", border:"none", color:"var(--text)", cursor:"pointer", fontSize:18 }}>+</button>
          </div>
          <span style={{ fontSize:12, color: product.stock<8?"var(--accent2)":"var(--text3)", fontFamily:"'DM Mono',monospace" }}>
            {product.stock<8 ? "Only "+product.stock+" left!" : product.stock+" in stock"}
          </span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
          <button onClick={handleAdd} style={{ padding:"13px 26px", background:"var(--accent)", color:"#000", fontWeight:800, border:"none", borderRadius:11, fontSize:14, cursor:"pointer" }}>Add to Cart</button>
          <button onClick={() => { handleAdd(); navigate("/checkout"); }} style={{ padding:"13px 26px", background:"none", color:"var(--text)", fontWeight:600, border:"1px solid var(--border2)", borderRadius:11, fontSize:14, cursor:"pointer" }}>Buy Now</button>
        </div>
        <div style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 16px" }}>
          {["Free shipping on orders over $300","30-day returns, no questions asked","2-year manufacturer warranty"].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--text2)", marginBottom:7 }}><span style={{ color:"var(--green)" }}>✓</span>{f}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
