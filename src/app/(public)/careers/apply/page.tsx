"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Send, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function ApplyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const jobId = params.get("id") || null;
  const jobTitle = params.get("title") || "General Application";

  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    portfolioUrl: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicantName || !form.applicantEmail || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        jobId,
        jobTitle,
        applicantName: form.applicantName,
        applicantEmail: form.applicantEmail,
        portfolioUrl: form.portfolioUrl,
        message: form.message,
        status: "pending",
        appliedAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success("Application submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card rounded-2xl p-14 text-center max-w-lg mx-auto">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}
        >
          <CheckCircle size={28} style={{ color: "#4ade80" }} />
        </div>
        <h2 className="font-display font-bold text-white text-2xl mb-3">Application Sent!</h2>
        <p className="mb-8" style={{ color: "#475569" }}>
          Thanks for applying for <span className="text-white font-semibold">{jobTitle}</span>.
          We&apos;ll review your application and be in touch soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/careers" className="btn-secondary text-sm px-6 py-2.5">
            Back to Careers
          </Link>
          <Link href="/" className="btn-primary text-sm px-6 py-2.5">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-2xl p-8 space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-white text-xl mb-1">
          Apply for:{" "}
          <span className="text-gradient">{jobTitle}</span>
        </h2>
        <p className="text-slate-500 text-sm">Fill in your details below and we&apos;ll get back to you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
            Full Name *
          </label>
          <input
            className="input-field"
            placeholder="Your name"
            value={form.applicantName}
            onChange={(e) => set("applicantName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
            Email Address *
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={form.applicantEmail}
            onChange={(e) => set("applicantEmail", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
          Portfolio / LinkedIn URL
        </label>
        <input
          className="input-field"
          placeholder="https://yourportfolio.com"
          value={form.portfolioUrl}
          onChange={(e) => set("portfolioUrl", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
          Cover Message *
        </label>
        <textarea
          className="input-field"
          style={{ minHeight: "140px" }}
          placeholder="Tell us why you'd be a great fit, your experience, and what excites you about CrownForge..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Submitting...</>
        ) : (
          <><Send size={16} /> Submit Application</>
        )}
      </button>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
      <Link
        href="/careers"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-10 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Careers
      </Link>

      <div className="mb-10 text-center">
        <p className="tag mb-4">Join the Team</p>
        <h1 className="section-title mb-3">
          Submit Your <span className="text-gradient">Application</span>
        </h1>
        <p className="section-subtitle mx-auto text-center">
          We review every application personally. Expect a response within 5–7 business days.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-slate-600" />
        </div>
      }>
        <ApplyForm />
      </Suspense>
    </div>
  );
}
