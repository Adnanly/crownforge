"use client";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

const sections = [
  { title: "Acceptance of Terms", body: "By accessing and using the CrownForge Games website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services." },
  { title: "Use of the Website", body: "You may use our website for lawful purposes only. You agree not to: use the site in any way that violates applicable laws; transmit spam or unsolicited communications; attempt to gain unauthorized access to any systems; interfere with the proper functioning of the website; copy or distribute content without permission." },
  { title: "Intellectual Property", body: "All content on this website — including game assets, logos, text, graphics, and code — is the property of CrownForge Games and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit written permission." },
  { title: "User Submissions", body: "When you submit content to us (job applications, contact forms, feedback), you grant CrownForge Games a non-exclusive license to use that content for the purpose it was submitted. You represent that your submissions do not infringe on any third-party rights." },
  { title: "Disclaimer of Warranties", body: "Our website is provided 'as is' without any warranties, express or implied. We do not warrant that the site will be error-free, uninterrupted, or free of viruses. Your use of the site is at your own risk." },
  { title: "Limitation of Liability", body: "To the maximum extent permitted by law, CrownForge Games shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services." },
  { title: "Third-Party Links", body: "Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over those sites and accept no responsibility for their content or practices." },
  { title: "Changes to Terms", body: "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes constitutes your acceptance of the new Terms." },
  { title: "Governing Law", body: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of India." },
  { title: "Contact", body: "For questions about these Terms of Service, contact us at: crownforgebusiness@gmail.com" },
];

export default function TermsPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.2 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(34,211,238,0.04),transparent)" }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm transition-colors" style={{ color: "#475569" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#fff";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#475569";}}>
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
              <FileText size={22} style={{ color: "#22d3ee" }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#22d3ee" }}>Legal</p>
              <h1 className="section-title" style={{ fontSize: "2rem" }}>Terms of Service</h1>
            </div>
          </div>
          <p style={{ color: "#475569", fontSize: "0.875rem" }}>Last updated: January 2026 · Effective immediately</p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.12)" }}>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              Please read these Terms of Service carefully before using the CrownForge Games website. These terms govern your use of our platform and services.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-24 max-w-3xl mx-auto px-6">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={s.title}>
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", color: "#22d3ee" }}>
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
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>Questions about our terms?</p>
          <Link href="/contact" className="btn-primary text-sm px-6 py-2.5">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
