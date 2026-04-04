"use client";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import type { Career } from "@/types";
import { Plus, Trash2, Loader2, Briefcase, ToggleLeft, ToggleRight, X } from "lucide-react";
import toast from "react-hot-toast";

const types = ["Full-time", "Part-time", "Contract", "Remote"];
const departments = ["Engineering", "Art & Design", "Marketing", "Production", "QA", "Other"];
const empty = { title: "", department: "Engineering", type: "Full-time", location: "Remote", description: "", requirements: "" };

export default function AdminCareersPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Career[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "careers"), orderBy("createdAt", "desc")));
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Career)));
    } catch (err: unknown) {
      console.error("Failed to load careers:", err);
      toast.error("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error("Fill required fields."); return; }
    if (!user) { toast.error("Not authenticated."); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "careers"), {
        ...form,
        requirements: form.requirements.split("\n").filter(Boolean),
        isOpen: true,
        createdAt: serverTimestamp(),
      });
      toast.success("Job listing added!");
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

  const toggleOpen = async (job: Career) => {
    try {
      await updateDoc(doc(db, "careers", job.id), { isOpen: !job.isOpen });
      toast.success(`Listing ${job.isOpen ? "closed" : "opened"}.`);
      load();
    } catch (err: unknown) {
      console.error("Failed to toggle:", err);
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "careers", id));
      toast.success("Listing deleted.");
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
          <h1 className="text-2xl font-black text-white mb-1">Careers Management</h1>
          <p className="text-slate-600 text-sm">{jobs.filter(j => j.isOpen).length} open, {jobs.length} total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary text-sm px-5 py-2.5" : "btn-primary text-sm px-5 py-2.5"}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Listing</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="admin-card mb-8 space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">New Job Listing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Job Title *</label>
              <input className="input-field text-sm" placeholder="e.g. Senior Game Developer" value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Department</label>
              <select className="input-field text-sm" value={form.department} onChange={e => set("department", e.target.value)}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Type</label>
              <select className="input-field text-sm" value={form.type} onChange={e => set("type", e.target.value)}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Location</label>
              <input className="input-field text-sm" placeholder="Remote / Mumbai / etc." value={form.location} onChange={e => set("location", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Description *</label>
            <textarea className="input-field text-sm min-h-[80px] resize-y" placeholder="Describe the role..." value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Requirements (one per line)</label>
            <textarea className="input-field text-sm min-h-[80px] resize-y" placeholder={"3+ years Unity experience\nStrong C# skills"} value={form.requirements} onChange={e => set("requirements", e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2.5">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Add Listing"}
          </button>
        </form>
      )}

      {loading ? <div className="flex gap-2 items-center text-slate-600 py-10"><Loader2 size={18} className="animate-spin" /> Loading...</div>
      : jobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Briefcase size={36} className="text-slate-700 mx-auto mb-3" /><p className="text-slate-600">No job listings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="admin-card flex items-center gap-4 hover:border-white/15 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-white font-semibold text-sm">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${job.isOpen ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-slate-500 border-slate-600/20 bg-slate-800/50"}`}>
                    {job.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <p className="text-slate-600 text-xs">{job.department} · {job.type} · {job.location}</p>
              </div>
              <button onClick={() => toggleOpen(job)} className="text-slate-500 hover:text-brand-accent transition-colors p-1.5">
                {job.isOpen ? <ToggleRight size={22} className="text-brand-accent" /> : <ToggleLeft size={22} />}
              </button>
              <button onClick={() => handleDelete(job.id)} className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
