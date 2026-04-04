"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { NewsPost } from "@/types";
import { Loader2, Newspaper } from "lucide-react";

const badgeColors: Record<string, string> = {
  "Update":    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Event":     "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  "Dev Diary": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Careers":   "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsPost)));
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-14">
        <span className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3 block">Latest Updates</span>
        <h1 className="section-title text-5xl mb-4">News & <span className="text-gradient">Updates</span></h1>
        <p className="section-subtitle">Latest from the forge — dev diaries, events, and studio news.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-slate-600">
          <Loader2 size={28} className="animate-spin mr-3" /> Loading news...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl">
          <Newspaper size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-600">No news yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const date = post.createdAt
              ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })
              : "";
            return (
              <article key={post.id}
                className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-6 hover:border-brand-accent/25 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wider ${badgeColors[post.category] || "bg-white/5 text-slate-400 border-white/10"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-600">{date}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">{post.description}</p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
