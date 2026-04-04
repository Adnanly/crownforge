"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import type { NewsPost } from "@/types";
import { Plus, Trash2, Loader2, Newspaper, X } from "lucide-react";
import toast from "react-hot-toast";

const categories = ["Update", "Event", "Dev Diary", "Careers"];
const badgeColors: Record<string, string> = {
  "Update":    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Event":     "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  "Dev Diary": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Careers":   "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const empty = { title: "", category: "Update", description: "" };

export default function AdminNewsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "news"), orderBy("createdAt", "desc")));
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsPost)));
    } catch (err: unknown) {
      console.error("Failed to load news:", err);
      toast.error("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error("Fill all fields."); return; }
    if (!user) { toast.error("Not authenticated."); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "news"), {
        ...form,
        authorUid: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("News post published!");
      setForm(empty);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      console.error("Failed to save:", err);
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      toast.success("Post deleted.");
      load();
    } catch (err: unknown) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">News Management</h1>
          <p className="text-slate-600 text-sm">{posts.length} published post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className={showForm ? "btn-secondary text-sm px-5 py-2.5" : "btn-primary text-sm px-5 py-2.5"}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Post</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="admin-card mb-8 space-y-4">
          <h2 className="text-sm font-bold text-white mb-4">New News Post</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">Title *</label>
              <input className="input-field text-sm" placeholder="Post title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Category</label>
              <select className="input-field text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Description *</label>
            <textarea className="input-field text-sm min-h-[100px] resize-y" placeholder="Write the full content here..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2.5">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Publishing...</> : "Publish Post"}
          </button>
        </form>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-600 py-10"><Loader2 size={18} className="animate-spin" /> Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Newspaper size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-600">No posts yet. Create your first news update.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const date = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "";
            return (
              <div key={post.id} className="admin-card flex items-start gap-4 hover:border-white/15 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${badgeColors[post.category] || "bg-white/5 text-slate-400 border-white/10"}`}>{post.category}</span>
                    <span className="text-xs text-slate-700">{date}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{post.title}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2">{post.description}</p>
                </div>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
