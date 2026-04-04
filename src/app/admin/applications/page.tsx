"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application } from "@/types";
import { Loader2, Users, ExternalLink, X } from "lucide-react";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  interviewing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  hired: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "applications"), orderBy("appliedAt", "desc")));
    setApps(snap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    await updateDoc(doc(db, "applications", id), { status });
    toast.success("Status updated.");
    load();
    setSelected(s => s ? { ...s, status: status as Application["status"] } : null);
    setSaving(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Applications</h1>
          <p className="text-slate-600 text-sm">{apps.filter(a => a.status === "pending").length} pending review</p>
        </div>
        <button onClick={load} className="btn-secondary text-sm px-4 py-2">Refresh</button>
      </div>

      {loading ? <div className="flex gap-2 items-center text-slate-600 py-10"><Loader2 size={18} className="animate-spin" /> Loading...</div>
      : apps.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Users size={36} className="text-slate-700 mx-auto mb-3" /><p className="text-slate-600">No applications yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2 space-y-2">
            {apps.map(a => {
              const date = a.appliedAt ? new Date(a.appliedAt.seconds * 1000).toLocaleDateString() : "";
              return (
                <button key={a.id} onClick={() => setSelected(a)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === a.id ? "border-brand-accent/40 bg-brand-accent/5" : "border-white/[0.06] hover:border-white/15 bg-brand-card"}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white font-semibold text-sm">{a.applicantName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 capitalize ${statusColors[a.status]}`}>{a.status}</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-1">{a.jobTitle}</p>
                  <p className="text-slate-700 text-xs">{date}</p>
                </button>
              );
            })}
          </div>
          <div className="xl:col-span-3">
            {selected ? (
              <div className="admin-card">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold text-lg mb-1">{selected.applicantName}</h2>
                    <p className="text-slate-500 text-sm">Applied for: <span className="text-slate-300">{selected.jobTitle}</span></p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-white"><X size={18} /></button>
                </div>
                <div className="space-y-2 mb-5 pb-5 border-b border-white/[0.06] text-sm">
                  <p className="text-slate-500">Email: <a href={`mailto:${selected.applicantEmail}`} className="text-brand-accent hover:underline">{selected.applicantEmail}</a></p>
                  {selected.portfolioUrl && <p className="text-slate-500 flex items-center gap-1.5">Portfolio: <a href={selected.portfolioUrl} target="_blank" className="text-brand-accent hover:underline flex items-center gap-1">{selected.portfolioUrl} <ExternalLink size={12} /></a></p>}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{selected.message}</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(statusColors) as Application["status"][]).map(s => (
                    <button key={s} disabled={saving || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${selected.status === s ? "border-brand-accent/40 text-brand-accent bg-brand-accent/10" : "border-white/10 text-slate-500 hover:border-white/30 hover:text-white"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="admin-card h-64 flex items-center justify-center text-slate-700">
                <div className="text-center"><Users size={32} className="mx-auto mb-2" /><p className="text-sm">Select an application</p></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
