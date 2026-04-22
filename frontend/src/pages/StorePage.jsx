import { useState, useEffect } from "react";
import * as api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  useEffect(() => { api.getFeatured().then(r => setFeatured(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts({ category: category !== "all" ? category : undefined, sort, search })
      .then(r => { setProducts(r.data.products); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, sort, search]);

  return (
    <div style={{ maxWidth:1300, margin:"0 auto", padding:"0 24px" }}>
      {/* Hero */}
      <div style={{ padding:"72px 0 56px", display:"grid", gridTemplateColumns:"1fr 430px", gap:64, alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:3, color:"var(--accent)", textTransform:"uppercase", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ display:"inline-block", width:24, height:1, background:"var(--accent)" }} />
            MERN · REST API · MongoDB · Session Auth
          </div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:64, lineHeight:1, fontWeight:600, letterSpacing:"-2px", marginBottom:22 }}>
            Commerce built for the <em style={{ fontStyle:"italic", color:"var(--accent)" }}>modern</em> web
          </h1>
          <p style={{ fontSize:15, lineHeight:1.75, color:"var(--text2)", marginBottom:36, maxWidth:440 }}>
            A distributed MERN ecommerce platform. Real Express API, MongoDB data layer, session-based auth, live cart and order management.
          </p>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior:"smooth" })} style={{ padding:"13px 26px", background:"var(--accent)", color:"#000", fontWeight:700, border:"none", borderRadius:11, fontSize:14, cursor:"pointer" }}>Shop Now ↓</button>
          </div>
        </div>
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:20, padding:22 }}>
          <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--text3)", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>API Endpoints</div>
          {[["GET","  /api/products"],["POST"," /api/auth/login"],["POST"," /api/cart"],["POST"," /api/orders"],["GET","  /api/reviews/:id"]].map(([method,path]) => (
            <div key={path} style={{ display:"flex", gap:10, padding:"8px 12px", background:"var(--bg3)", borderRadius:8, marginBottom:8, border:"1px solid var(--border)", fontFamily:"'DM Mono',monospace", fontSize:12 }}>
              <span style={{ color:"var(--accent)", minWidth:36 }}>{method}</span>
              <span style={{ color:"var(--text2)" }}>{path}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{ paddingBottom:60 }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:600, letterSpacing:"-1px", marginBottom:24 }}>Featured <span style={{ color:"var(--accent)", fontStyle:"italic" }}>Picks</span></h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* All products */}
      <div style={{ paddingBottom:80 }} id="products">
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:600, letterSpacing:"-1px" }}>All <span style={{ color:"var(--accent)", fontStyle:"italic" }}>Products</span></h2>
          <span style={{ fontSize:12, color:"var(--text3)" }}>{products.length} results</span>
        </div>
        <div style={{ position:"relative", marginBottom:22 }}>
          <span style={{ position:"absolute", left:15, top:"50%", transform:"translateY(-50%)", color:"var(--text3)" }}>🔍</span>
          <input style={{ width:"100%", padding:"12px 18px 12px 44px", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:11, color:"var(--text)", fontSize:14, outline:"none" }}
            placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
          {["all","electronics","fashion","home"].map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding:"8px 16px", borderRadius:999, fontSize:12, fontWeight:600, border:"1px solid " + (category===c?"var(--accent)":"var(--border)"), background: category===c?"var(--accent)":"var(--bg2)", color: category===c?"#000":"var(--text2)", cursor:"pointer" }}>
              {c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ marginLeft:"auto", padding:"8px 14px", borderRadius:999, fontSize:12, fontWeight:600, border:"1px solid var(--border)", background:"var(--bg2)", color:"var(--text2)", cursor:"pointer", outline:"none" }}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
        {loading ? <div style={{ textAlign:"center", padding:60, color:"var(--text2)" }}>Loading products…</div>
         : products.length === 0 ? <div style={{ textAlign:"center", padding:60, color:"var(--text3)" }}><div style={{ fontSize:48, marginBottom:14 }}>🔍</div>No products found.</div>
         : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:16 }}>{products.map(p => <ProductCard key={p._id} product={p} />)}</div>}
      </div>
    </div>
  );
}
