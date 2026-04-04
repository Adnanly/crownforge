"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Star, Gamepad2, Newspaper, ChevronDown, Play, Users, Trophy, Globe } from "lucide-react";
import ParticleField from "@/components/ParticleField";
import ScrollReveal from "@/components/ScrollReveal";
import NewsFeed from "@/components/NewsFeed";

const games = [
  { title:"War-X",            slug:"war-x",            status:"Released", genre:"Tactical FPS",    color:"#ef4444", logo:"/images/logos/game_War-X_logo.png",            desc:"Ultimate tactical warfare. Dominate the battlefield." },
  { title:"The Black Vaile",  slug:"black-vaile",      status:"Released", genre:"Horror",          color:"#8b5cf6", logo:"/images/logos/game_The Black Vaile_logo.png",   desc:"Psychological horror that shatters perception." },
  { title:"Zombie Strikeforce",slug:"zombie-strikeforce",status:"Released",genre:"Action Shooter", color:"#22c55e", logo:"/images/logos/game_Zombie Strikeforce_logo.png",desc:"Elite squad vs the undead horde." },
];
const stats = [
  { value:"3+",   label:"Games Shipped",    icon:Gamepad2 },
  { value:"50K+", label:"Active Players",   icon:Users },
  { value:"4.8",  label:"Avg Rating",       icon:Trophy },
  { value:"2026", label:"Est.",             icon:Globe },
];
const pillars = [
  { icon:Zap,    title:"Innovation First", desc:"We deconstruct genres and rebuild them with mechanics the industry hasn't seen.", color:"#facc15" },
  { icon:Shield, title:"Player Respect",   desc:"No predatory monetization. No pay-to-win. We value your time.",                  color:"#22d3ee" },
  { icon:Star,   title:"Artistic Craft",   desc:"Every pixel, every sound — cohesive aesthetic excellence throughout.",           color:"#f472b6" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-noise">

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />
        <div className="aurora" />
        <div className="absolute inset-0 grid-bg pointer-events-none" style={{ opacity: 0.3 }} />
        <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none" style={{ background: "linear-gradient(to top,#030303,transparent)" }} />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest tag">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Indie Game Studio — Est. 2026
          </div>

          {/* Headline */}
          <h1 className="display-xl text-white mb-2">
            WHERE WORLDS
          </h1>
          <h1 className="display-xl text-shimmer mb-8">
            ARE BORN
          </h1>

          <p className="text-xl md:text-2xl mb-12 leading-relaxed mx-auto" style={{ color: "#64748b", maxWidth: "600px" }}>
            CrownForge crafts next-generation immersive gaming experiences built for the brave and fearless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/games" className="btn-primary text-base px-10 py-4 animate-glow">
              Explore Games <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn-secondary text-base px-10 py-4">
              Our Studio
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-2" style={{ color: "#1e293b" }}>
            <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", padding: "4rem 0" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div className="text-center group cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)" }}>
                  <s.icon size={18} style={{ color: "#facc15" }} />
                </div>
                <p className="text-4xl md:text-5xl font-display font-black text-white mb-1" style={{ letterSpacing: "-0.04em" }}>{s.value}</p>
                <p className="text-xs uppercase tracking-widest font-medium" style={{ color: "#475569" }}>{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════ GAMES ══════════ */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="tag mb-4"><Gamepad2 size={11} /> Our Portfolio</p>
              <h2 className="section-title">Games We&apos;ve <span className="text-gradient">Forged</span></h2>
            </div>
            <Link href="/games" className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#475569" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {games.map((g, i) => (
            <ScrollReveal key={g.slug} delay={i * 100}>
              <Link href={`/games/${g.slug}`} className="card-glow block group overflow-hidden rounded-2xl">
                {/* Image */}
                <div className="h-52 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `radial-gradient(ellipse at 50% 60%,${g.color}18,#030303)` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 50% 50%,${g.color}28,transparent)` }} />
                  <Image src={g.logo} alt={g.title} width={180} height={140}
                    className="object-contain relative z-10 transition-all duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 tag tag-green">Released</span>
                  <span className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: "rgba(0,0,0,0.6)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>{g.genre}</span>
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(250,204,21,0.9)", backdropFilter: "blur(8px)" }}>
                      <Play size={18} fill="#000" style={{ color: "#000", marginLeft: "2px" }} />
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-gradient transition-all">{g.title}</h3>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#475569" }}>{g.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all" style={{ color: "#facc15" }}>
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════ PHILOSOPHY ══════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg,transparent,rgba(250,204,21,0.015),transparent)" }}>
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.3 }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="tag mb-4 justify-center">Our Beliefs</p>
            <h2 className="section-title mb-3">Built on <span className="text-gradient">Principle</span></h2>
            <p className="section-subtitle mx-auto text-center">The values that drive every decision we make.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map(({ icon: Icon, title, desc, color }, i) => (
              <ScrollReveal key={title} delay={i * 100}>
                <div className="card-glass rounded-2xl p-8 text-center group h-full hover:translate-y-[-4px]">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ NEWS ══════════ */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="tag mb-4"><Newspaper size={11} /> From the Forge</p>
              <h2 className="section-title">Latest <span className="text-gradient">Updates</span></h2>
            </div>
            <Link href="/news" className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#475569" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
              All news <ArrowRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
        <NewsFeed limit={3} />
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="gradient-border rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none rounded-3xl" style={{ opacity: 0.15 }} />
            <div className="glow-line-x absolute top-0 inset-x-0" />
            <p className="tag mb-6 justify-center">We&apos;re Hiring</p>
            <h2 className="display-md text-white mb-4">
              Join the <span className="text-gradient">Forge</span>
            </h2>
            <p className="mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: "#475569" }}>
              Help us craft the next generation of immersive worlds. We&apos;re searching for passionate creators, engineers, and artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/careers" className="btn-primary text-base px-10 py-4">
                See Open Roles <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-secondary text-base px-10 py-4">
                Get in Touch
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
