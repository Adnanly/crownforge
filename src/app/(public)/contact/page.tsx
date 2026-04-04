"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Send, Mail, Clock, Headphones, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import ScrollReveal from "@/components/ScrollReveal";

const cats = ["General Inquiry","Technical Support","Business / Partnerships","Press & Media","Bug Report","Other"];
const info = [
  { icon: Mail,       label: "Email",    value: "crownforgebusiness@gmail.com", href: "mailto:crownforgebusiness@gmail.com", color: "#facc15" },
  { icon: Clock,      label: "Response", value: "Within 48 hours",              href: null,                                   color: "#22d3ee" },
  { icon: Headphones, label: "Support",  value: "Mon–Fri, 10am–6pm IST",        href: null,                                   color: "#f472b6" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name:"",email:"",subject:"",category:"",message:"" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.email||!form.subject||!form.message) { toast.error("Please fill in all required fields."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db,"messages"), { ...form, read:false, status:"new", createdAt:serverTimestamp() });
      setSent(true); toast.success("Message sent!");
    } catch { toast.error("Failed to send. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.2 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%,rgba(250,204,21,0.05),transparent)" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <p className="tag mb-5">Get in Touch</p>
          <h1 className="section-title mb-4" style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}>
            Contact <span className="text-gradient">Support</span>
          </h1>
          <p className="section-subtitle">Have a question, bug report, or partnership idea? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="card rounded-2xl p-14 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <CheckCircle size={28} style={{ color: "#4ade80" }} />
                </div>
                <h2 className="font-display font-bold text-white text-2xl mb-3">Message Sent!</h2>
                <p className="mb-8" style={{ color: "#475569" }}>Thanks for reaching out. We&apos;ll get back to you within 48 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:"",email:"",subject:"",category:"",message:"" }); }} className="btn-secondary text-sm px-6 py-2.5">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card rounded-2xl p-8 space-y-5">
                <h2 className="font-display font-bold text-white text-lg mb-2">Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Name *</label>
                    <input className="input-field" placeholder="Your full name" value={form.name} onChange={e=>set("name",e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Email *</label>
                    <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Subject *</label>
                    <input className="input-field" placeholder="What is this about?" value={form.subject} onChange={e=>set("subject",e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Category</label>
                    <select className="input-field" value={form.category} onChange={e=>set("category",e.target.value)}>
                      <option value="">Select category</option>
                      {cats.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Message *</label>
                  <textarea className="input-field" style={{ minHeight: "140px" }} placeholder="Describe your inquiry in detail..." value={form.message} onChange={e=>set("message",e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? "Sending..." : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {info.map(({ icon: Icon, label, value, href, color }) => (
              <ScrollReveal key={label}>
                <div className="card rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "#334155" }}>{label}</p>
                    {href ? <a href={href} className="text-sm text-white hover:underline">{value}</a>
                           : <p className="text-sm" style={{ color: "#94a3b8" }}>{value}</p>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={200}>
              <div className="rounded-xl p-5" style={{ background: "rgba(250,204,21,0.04)", border: "1px solid rgba(250,204,21,0.12)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#facc15" }}>Looking to join us?</p>
                <p className="text-xs mb-3" style={{ color: "#475569" }}>Check out our open positions.</p>
                <a href="/careers" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#facc15" }}>
                  View Careers <ArrowRight size={12} />
                </a>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </section>
    </div>
  );
}
