"use client";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

const sections = [
  { title: "Information We Collect", body: "We collect information you provide directly to us, such as when you contact us, apply for a job, or submit feedback. This includes name, email address, and any other information you choose to share. We also automatically collect certain information when you use our website, including IP address, browser type, and pages visited." },
  { title: "How We Use Your Information", body: "We use the information we collect to: respond to your inquiries and provide support; process job applications and communicate with candidates; send newsletters and updates if you opt in; improve our website and services; comply with legal obligations." },
  { title: "Information Sharing", body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website — such as Firebase (Google) for authentication and data storage — subject to strict confidentiality agreements." },
  { title: "Data Security", body: "We implement industry-standard security measures to protect your personal information. All data is encrypted in transit and at rest. We use Firebase security rules to restrict unauthorized access. However, no method of transmission over the internet is 100% secure." },
  { title: "Cookies", body: "Our website uses minimal cookies necessary for functionality. We do not use third-party advertising cookies. You can disable cookies in your browser settings, though some features may not function correctly." },
  { title: "Your Rights", body: "You have the right to access, correct, or delete your personal information. To exercise these rights, contact us at crownforgebusiness@gmail.com. We will respond to all requests within 30 days." },
  { title: "Children's Privacy", body: "Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, contact us immediately." },
  { title: "Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Continued use of our services after changes constitutes acceptance." },
  { title: "Contact Us", body: "If you have questions about this Privacy Policy, please contact us at: crownforgebusiness@gmail.com | CrownForge Games, India" },
];

export default function PrivacyPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.2 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(250,204,21,0.05),transparent)" }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm transition-colors" style={{ color: "#475569" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#475569";}}>
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)" }}>
              <Shield size={22} style={{ color: "#facc15" }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#facc15" }}>Legal</p>
              <h1 className="section-title" style={{ fontSize: "2rem" }}>Privacy Policy</h1>
            </div>
          </div>
          <p style={{ color: "#475569", fontSize: "0.875rem" }}>Last updated: January 2026 · Effective immediately</p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.15)" }}>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              CrownForge Games (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This policy explains how we collect, use, and protect your information when you use our website and services.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 max-w-3xl mx-auto px-6">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={s.title} className="group">
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black" style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)", color: "#facc15" }}>
                  {String(i+1).padStart(2,"0")}
                </span>
                <div>
                  <h2 className="font-display font-bold text-white text-xl mb-3">{s.title}</h2>
                  <p className="leading-relaxed text-sm" style={{ color: "#64748b" }}>{s.body}</p>
                </div>
              </div>
              {i < sections.length - 1 && <div className="mt-10 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />}
            </div>
          ))}
        </div>
        <div className="mt-16 p-6 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>Have questions about your data?</p>
          <Link href="/contact" className="btn-primary text-sm px-6 py-2.5">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
