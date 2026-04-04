"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function ApplyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const jobId = params.get("id") || "";
  const jobTitle = params.get("title") || "General Application";
  const [form, setForm] = useState({ name: "", email: "", portfolio: "", message: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Fill all required fields."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        jobId: jobId || null, jobTitle,
        applicantName: form.name, applicantEmail: form.email,
        portfolioUrl: form.portfolio, message: form.message,
        status: "pending", appliedAt: serverTimestamp(),
      });
      toast.success("Application submitted! We'll be in touch.");
      setTimeout(() => router.push("/careers"), 2500);
    } catch { toast.error("Submission failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Link href="/careers" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Careers
      </Link>
      <div className="mb-8">
        <span className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3 block">Apply Now</span>
        <h1 className="text-4xl font-black text-white mb-2">{jobTitle}</h1>
        <p className="text-slate-500">Fill in the form below and we'll review your application shortly.</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Full Name <span className="text-red-400">*</span></label>
            <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email <span className="text-red-400">*</span></label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Portfolio / GitHub URL</label>
          <input className="input-field" placeholder="https://your-portfolio.com" value={form.portfolio} onChange={e => set("portfolio", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Cover Letter <span className="text-red-400">*</span></label>
          <textarea className="input-field min-h-[160px] resize-y" placeholder="Tell us about yourself and why you want to join CrownForge..."
            value={form.message} onChange={e => set("message", e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> Submit Application</>}
        </button>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-slate-500 py-20"><Loader2 className="animate-spin mx-auto" size={28} /></div>}>
      <ApplyForm />
    </Suspense>
  );
}
