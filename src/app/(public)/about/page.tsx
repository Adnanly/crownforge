"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Zap, Shield, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ParticleField from "@/components/ParticleField";

const team = [
  { name: "Anuj Kashyap",     role: "Director",         tag: "Leader",        img: "/images/team/Anuj Kashyap_Director-1.jpg",                color: "#facc15" },
  { name: "Ayush Bagwale",    role: "Co-Director",      tag: "Team Leader",   img: "/images/team/Ayush Bagwale-Co Director-2.png",             color: "#38bdf8" },
  { name: "Amendra P. Singh", role: "Senior Developer", tag: "Unreal Engine", img: "/images/team/Amendra P. Singh- Senior Devloper-3.jpg",     color: "#f472b6" },
  { name: "Gourav Parjapati", role: "Senior Animator",  tag: "3D Animator",   img: "/images/team/Gourav Parjapati-Senior Animator-4.png",      color: "#4ade80" },
  { name: "Udit Shroti",      role: "Senior Web Dev",   tag: "Full-Stack",    img: "/images/team/Udit Shroti_Senior Web Devloper-5.jpg",       color: "#a78bfa" },
];

const timeline = [
  { date: "Q1 2026", title: "CrownForge Founded",  desc: "A small team of industry veterans gathered with one goal — forge unforgettable worlds.", dot: "#facc15", future: false },
  { date: "Q3 2026", title: "First Game Released",  desc: "War-X launched to positive reception, marking our debut in mobile gaming.",              dot: "#38bdf8", future: false },
  { date: "Q3 2026", title: "Studio Expansion",     desc: "Moved to a new HQ and doubled the team to support parallel game development.",            dot: "#4ade80", future: false },
  { date: "Q4 2026", title: "Global Launch",         desc: "The anticipated worldwide release of our flagship title — the culmination of our work.", dot: "#f472b6", future: true  },
];

const vision = [
  "Establish a connected multiverse across all our IP.",
  "Pioneer new forms of procedural storytelling.",
  "Foster a community-driven development process.",
];

const pillars = [
  { icon: Zap,    title: "Innovation First", desc: "We deconstruct genres and rebuild them with mechanics the industry has not seen.", color: "#facc15" },
  { icon: Shield, title: "Player Respect",   desc: "No predatory monetization. No pay-to-win. We value your time and investment.",   color: "#38bdf8" },
  { icon: Star,   title: "Artistic Craft",   desc: "Every pixel, every sound, every frame — cohesive aesthetic excellence.",         color: "#f472b6" },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-20">
        <ParticleField />
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(250,204,21,0.06), transparent)" }} />
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, #050505, transparent)" }} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <span className="inline-block text-xs font-bold text-yellow-400 uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)" }}>
              Our Story
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-5">
              FORGING <span className="text-shimmer">WORLDS</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A collective of dreamers, coders, and artists dedicated to pushing the boundaries of interactive entertainment.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <ScrollReveal direction="left">
            <h2 className="section-title mb-6 flex items-center gap-4">
              <span className="w-1 h-10 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(to bottom, #facc15, #f59e0b)" }} />
              Our Mission
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-5">
              To create deep, systemic game worlds where player agency is paramount. We do not just build games — we build engines for stories that have not been told yet.
            </p>
            <p className="text-slate-500 leading-relaxed">
              We believe in the power of show, not tell — crafting narratives that emerge organically from gameplay mechanics and environmental storytelling.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={100}>
            <div className="card-glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Long-Term Vision</h3>
              <ul className="space-y-5">
                {vision.map((v) => (
                  <li key={v} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)" }}>
                      <CheckCircle2 size={13} style={{ color: "#facc15" }} />
                    </div>
                    <span className="text-slate-400 text-sm leading-relaxed">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <h2 className="section-title mb-3">Creative <span className="text-gradient">Philosophy</span></h2>
          <p className="section-subtitle mx-auto text-center">How we think, why we build the way we do.</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, title, desc, color }, i) => (
            <ScrollReveal key={title} delay={i * 100}>
              <div className="card-glow rounded-2xl p-8 group text-center h-full">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24" style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="section-title mb-3">Our <span className="text-gradient">Journey</span></h2>
            <p className="section-subtitle mx-auto text-center">How CrownForge came to be.</p>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(250,204,21,0.2), transparent)" }} />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <ScrollReveal key={`${t.date}-${i}`} direction="left">
                  <div className="relative flex items-start gap-8 pl-14">
                    <span className={`absolute left-[17px] top-2 w-3 h-3 rounded-full -translate-x-1/2 border-2 ${t.future ? "animate-pulse" : ""}`}
                      style={{ background: t.dot, borderColor: "#050505", boxShadow: `0 0 12px ${t.dot}60` }} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: t.dot }}>{t.date}</p>
                      <h3 className="text-white font-bold text-lg mb-1">{t.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{t.desc}</p>
                      {t.future && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.3)", color: "#f472b6" }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="section-title mb-3">Meet the <span className="text-gradient">Leads</span></h2>
          <p className="section-subtitle mx-auto text-center">The people forging the future of CrownForge.</p>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {team.map((m, i) => (
            <ScrollReveal key={m.name} delay={i * 80}>
              <div className="group text-center cursor-default">
                <div className="relative mx-auto mb-4 w-24 h-24">
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md"
                    style={{ background: m.color }} />
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 transition-all duration-300"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = m.color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                    <Image src={m.img} alt={m.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm leading-tight mb-1">{m.name}</h4>
                <p className="text-xs font-semibold mb-0.5" style={{ color: m.color }}>{m.role}</p>
                <p className="text-slate-600 text-xs">{m.tag}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
        <ScrollReveal>
          <h2 className="text-3xl font-black text-white mb-4">Want to Join the Team?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">We are always looking for passionate people who share our vision.</p>
          <Link href="/careers" className="btn-primary px-8 py-4 text-base">
            See Open Positions <ArrowRight size={18} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
