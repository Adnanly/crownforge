"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit as fsLimit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { NewsPost } from "@/types";
import { Loader2, Newspaper } from "lucide-react";

const catStyle: Record<string, { color: string; bg: string; border: string }> = {
  Update:     { color: "#4ade80", bg: "rgba(74,222,128,0.08)",   border: "rgba(74,222,128,0.2)" },
  Event:      { color: "#f472b6", bg: "rgba(244,114,182,0.08)",  border: "rgba(244,114,182,0.2)" },
  "Dev Diary":{ color: "#22d3ee", bg: "rgba(34,211,238,0.08)",   border: "rgba(34,211,238,0.2)" },
  Careers:    { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.2)" },
};
const defaultCat = { color: "#94a3b8", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" };

function formatDate(ts: any) {
  if (!ts) return "";
  try { const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleDateString(undefined,{month:"short",day:"2-digit",year:"numeric"}); }
  catch { return ""; }
}

export default function NewsFeed({ limit = 6 }: { limit?: number }) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db,"news"), orderBy("createdAt","desc"), fsLimit(limit));
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id:d.id, ...d.data() } as NewsPost)));
      } catch (e) { console.error(e); setError(true); }
      finally { setLoading(false); }
    })();
  }, [limit]);

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", padding:"4rem", color:"#334155" }}>
      <Loader2 size={28} className="animate-spin" />
    </div>
  );
  if (error) return (
    <div style={{ textAlign:"center", padding:"3rem", color:"#475569", fontSize:"0.875rem" }}>
      Failed to load news. Check your Firebase connection.
    </div>
  );
  if (!posts.length) return (
    <div style={{ textAlign:"center", padding:"4rem" }}>
      <Newspaper size={36} style={{ color:"#1e293b", margin:"0 auto 1rem" }} />
      <p style={{ color:"#334155", fontSize:"0.875rem" }}>No news yet. Check back soon!</p>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
      {posts.map(post => {
        const s = catStyle[post.category] || defaultCat;
        return (
          <article key={post.id} className="card rounded-2xl p-6 flex flex-col" style={{ transition:"all .35s" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem" }}>
              <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"0.2rem 0.6rem", borderRadius:"999px", textTransform:"uppercase", letterSpacing:"0.06em", background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                {post.category || "News"}
              </span>
              <span style={{ fontSize:"0.75rem", color:"#334155" }}>{formatDate(post.createdAt)}</span>
            </div>
            <h3 style={{ color:"#fff", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:"1.05rem", marginBottom:"0.625rem", lineHeight:1.35, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as "vertical", overflow:"hidden" }}>
              {post.title}
            </h3>
            <p style={{ color:"#475569", fontSize:"0.875rem", lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" as "vertical", overflow:"hidden", flex:1 }}>
              {post.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
