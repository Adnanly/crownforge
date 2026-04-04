import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Gamepad2, Users, Calendar, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const GAMES: Record<string, any> = {
  "war-x": {
    title: "War-X", genre: "Tactical FPS / Action", status: "Released", platform: ["Mobile", "PC"],
    year: "2026", players: "10K+",
    logo: "/images/logos/game_War-X_logo.png",
    accentColor: "#ef4444",
    tagline: "Dominate. Conquer. Survive.",
    description: "War-X redefines mobile tactical combat. Command your squad, master complex terrain, and outmaneuver opponents in ever-escalating conflicts. Every decision matters. Every bullet counts.",
    longDesc: "From the fog of war to the heat of urban combat, War-X puts you in the boots of an elite soldier. Experience visceral gunfights, deep strategy, and heart-pounding multiplayer battles that test your tactical mind and reflexes simultaneously.",
    features: ["Real-time multiplayer PvP", "Squad-based tactics", "Advanced ballistics system", "100+ weapons & loadouts", "Dynamic weather & day/night", "Ranked competitive mode"],
    rating: "4.8",
  },
  "black-vaile": {
    title: "The Black Vaile", genre: "Psychological Horror", status: "Released", platform: ["Mobile"],
    year: "2026", players: "8K+",
    logo: "/images/logos/game_The Black Vaile_logo.png",
    accentColor: "#8b5cf6",
    tagline: "The darkness is watching.",
    description: "Uncover the secrets hidden in the shadows. A psychological horror experience that will test your sanity and challenge everything you thought you knew about reality.",
    longDesc: "The Black Vaile is not just a game — it is a descent into madness. Navigate through a cursed mansion where the walls breathe, the shadows move, and every room holds a new nightmare. Your mind is your greatest enemy.",
    features: ["Immersive first-person horror", "Dynamic fear system", "Procedural nightmare sequences", "Multiple endings", "Atmospheric audio design", "No jump-scare reliance"],
    rating: "4.6",
  },
  "zombie-strikeforce": {
    title: "Zombie Strikeforce", genre: "Action Shooter", status: "Released", platform: ["Mobile"],
    year: "2026", players: "15K+",
    logo: "/images/logos/game_Zombie Strikeforce_logo.png",
    accentColor: "#22c55e",
    tagline: "Humanity's last stand.",
    description: "Join the elite strikeforce and reclaim the world from the undead horde. Fast-paced action, upgradeable weapons, and relentless enemies await.",
    longDesc: "The dead have risen and civilization has fallen. You are the last line of defense — a hand-picked member of the Zombie Strikeforce, humanity's elite response unit. Fight through hordes, rescue survivors, and uncover the conspiracy behind the outbreak.",
    features: ["50+ mission campaign", "Co-op multiplayer", "Deep weapon upgrade tree", "10+ zombie types", "Base building & defense", "Weekly events & challenges"],
    rating: "4.7",
  },
  "tank-arena": {
    title: "Tank Arena", genre: "Action / Strategy", status: "In Development", platform: ["Mobile"],
    year: "2026", players: "Coming Soon",
    logo: "/images/logos/CFS_Black_logo.png",
    accentColor: "#f59e0b",
    tagline: "Armored warfare at its finest.",
    description: "Command powerful tanks in explosive arena battles. Upgrade, customize, and destroy your opponents in this adrenaline-fueled strategy-action hybrid.",
    longDesc: "Tank Arena places you at the helm of the world's most powerful armored vehicles. Choose your tank, build your loadout, and roll into battle against players worldwide. Deep upgrade trees, destructible environments, and real-time tactical decisions make every match a unique experience.",
    features: ["Real-time PvP tank battles", "Deep customization tree", "Destructible environments", "20+ tank classes", "Ranked season system", "Weekly tournaments"],
    rating: "TBD",
  },
};

export async function generateStaticParams() {
  return Object.keys(GAMES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GAMES[slug];
  return { title: g ? g.title : "Game Not Found" };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GAMES[slug];
  if (!g) notFound();

  return (
    <div className="overflow-x-hidden min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${g.accentColor}15, transparent 70%), #050505` }} />
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32" style={{ background: "linear-gradient(to top, #050505, transparent)" }} />

        {/* Floating logo */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative float">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ background: g.accentColor }} />
            <Image src={g.logo} alt={g.title} width={300} height={240} className="object-contain relative z-10" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <Link href="/games" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> All Games
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: `${g.accentColor}20`, border: `1px solid ${g.accentColor}40`, color: g.accentColor }}>{g.status}</span>
            <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>{g.genre}</span>
            {g.platform.map((p: string) => <span key={p} className="text-xs text-slate-600 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>{p}</span>)}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-3 leading-none">{g.title}</h1>
          <p className="text-xl font-medium mb-6" style={{ color: g.accentColor }}>{g.tagline}</p>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-8">{g.description}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#features" className="btn-primary">Explore <ArrowRight size={16} /></a>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star,     label: "Rating",   value: g.rating === "TBD" ? "TBD" : `${g.rating}/5` },
            { icon: Users,    label: "Players",  value: g.players },
            { icon: Calendar, label: "Year",     value: g.year },
            { icon: Gamepad2, label: "Platform", value: g.platform.join(" / ") },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="admin-card text-center">
              <Icon size={20} className="mx-auto mb-2 text-yellow-400" />
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">About the <span className="text-gradient">Game</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">{g.longDesc}</p>
            </div>
            <div className="lg:flex items-center justify-center hidden">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse" style={{ background: g.accentColor }} />
                <Image src={g.logo} alt={g.title} fill className="object-contain relative z-10" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="section-title mb-10">Key <span className="text-gradient">Features</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.features.map((f: string, i: number) => (
              <ScrollReveal key={f} delay={i * 80}>
                <div className="card-glass rounded-xl p-5 flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${g.accentColor}20`, border: `1px solid ${g.accentColor}30` }}>
                    <span className="text-sm font-black" style={{ color: g.accentColor }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{f}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="gradient-border rounded-3xl p-12">
            <h2 className="text-3xl font-black text-white mb-4">
              {g.status === "In Development" ? "Stay Tuned" : "Ready to Play?"}
            </h2>
            <p className="text-slate-400 mb-8">
              {g.status === "In Development"
                ? "This game is currently in development. Follow us for updates."
                : "Download now and join thousands of players worldwide."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {g.status !== "In Development" && (
                <a href="#" className="btn-primary px-8 py-4">Download Free <ArrowRight size={16} /></a>
              )}
              <Link href="/games" className="btn-secondary px-8 py-4">Other Games</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
