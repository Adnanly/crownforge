import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Gamepad2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = { title: "Games" };

const games = [
  { title:"War-X", slug:"war-x", status:"Released", genre:"Tactical FPS", platforms:["Mobile","PC"], color:"#ef4444", glow:"rgba(239,68,68,0.15)",
    logo:"/images/logos/game_War-X_logo.png",
    desc:"Experience the ultimate tactical warfare. Command your squad, master the battlefield, and dominate every engagement with precision strategy.",
    tags:["PvP","Multiplayer","Strategy","FPS"] },
  { title:"The Black Vaile", slug:"black-vaile", status:"Released", genre:"Psychological Horror", platforms:["Mobile"], color:"#8b5cf6", glow:"rgba(139,92,246,0.15)",
    logo:"/images/logos/game_The Black Vaile_logo.png",
    desc:"Uncover secrets hidden in the shadows. A psychological horror experience that challenges your perception of reality at every turn.",
    tags:["Horror","Story-Rich","Atmospheric","Single-player"] },
  { title:"Zombie Strikeforce", slug:"zombie-strikeforce", status:"Released", genre:"Action Shooter", platforms:["Mobile"], color:"#22c55e", glow:"rgba(34,197,94,0.15)",
    logo:"/images/logos/game_Zombie Strikeforce_logo.png",
    desc:"Join the elite strikeforce and reclaim the world from the undead horde. Fast-paced action with deep upgrade systems.",
    tags:["Action","Co-op","Survival","Shooter"] },
  { title:"Tank Arena", slug:"tank-arena", status:"In Development", genre:"Action / Strategy", platforms:["Mobile"], color:"#f59e0b", glow:"rgba(245,158,11,0.15)",
    logo:"/images/logos/CFS_Black_logo.png",
    desc:"Armored warfare at its finest. Command powerful tanks in explosive arena battles. Upgrade, customize, and destroy.",
    tags:["Strategy","PvP","Vehicles","Arena"] },
];

const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  Released:        { bg: "rgba(74,222,128,0.08)", color: "#4ade80", border: "rgba(74,222,128,0.2)" },
  "In Development":{ bg: "rgba(251,191,36,0.08)", color: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  "Coming Soon":   { bg: "rgba(96,165,250,0.08)", color: "#60a5fa", border: "rgba(96,165,250,0.2)" },
};

export default function GamesPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.2 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(250,204,21,0.05),transparent)" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <p className="tag mb-5"><Gamepad2 size={11} /> Our Portfolio</p>
            <h1 className="section-title mb-4" style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}>
              Games We&apos;ve <span className="text-gradient">Forged</span>
            </h1>
            <p className="section-subtitle">Dive into immersive worlds crafted with passion, precision, and cutting-edge technology.</p>
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="space-y-6">
          {games.map((g, i) => {
            const ss = statusStyle[g.status] || statusStyle.Released;
            return (
              <ScrollReveal key={g.slug} delay={i * 80}>
                <div className="card group rounded-2xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Logo panel */}
                    <div className="md:w-72 flex-shrink-0 flex items-center justify-center p-10 relative overflow-hidden"
                      style={{ background: `radial-gradient(ellipse at center,${g.glow},transparent 70%)`, minHeight: "220px" }}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{ background: `radial-gradient(ellipse at center,${g.color}25,transparent)` }} />
                      <Image src={g.logo} alt={g.title} width={160} height={120}
                        className="object-contain relative z-10 transition-all duration-500 group-hover:scale-110 float" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>{g.status}</span>
                          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>{g.genre}</span>
                        </div>
                        <h2 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-gradient transition-all">{g.title}</h2>
                        <p className="leading-relaxed text-sm mb-5" style={{ color: "#64748b", maxWidth: "500px" }}>{g.desc}</p>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {g.tags.map(t => (
                            <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: "rgba(255,255,255,0.03)", color: "#475569", border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
                          ))}
                        </div>
                        {/* Platforms */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#334155" }}>Platforms:</span>
                          {g.platforms.map(p => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded font-medium" style={{ color: "#64748b", background: "rgba(255,255,255,0.04)" }}>{p}</span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 mt-6">
                        <Link href={`/games/${g.slug}`} className="btn-primary text-sm px-6 py-2.5">
                          <Play size={14} fill="currentColor" /> View Details
                        </Link>
                        <Link href={`/games/${g.slug}#features`} className="btn-secondary text-sm px-6 py-2.5">
                          Features <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="gradient-border rounded-3xl p-12 text-center">
            <h2 className="display-md text-white mb-4">Got a Game Idea?</h2>
            <p className="mb-8" style={{ color: "#475569" }}>We&apos;re always open to partnerships, collaborations, and creative pitches.</p>
            <Link href="/contact" className="btn-primary px-8 py-4">Get in Touch <ArrowRight size={16} /></Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
