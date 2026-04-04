"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";

const links = [
  { href: "/games",   label: "Games"   },
  { href: "/about",   label: "Studio"  },
  { href: "/news",    label: "News"    },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className="fixed w-full top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(3,3,3,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        boxShadow: scrolled ? "0 1px 40px rgba(0,0,0,0.8)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-yellow-400 rounded-lg blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            <Image src="/images/logos/CFS_Black_logo.png" alt="CrownForge" width={32} height={32} className="object-contain relative z-10" />
          </div>
          <span className="font-display font-black text-base tracking-tight">
            <span style={{ color: "#facc15" }}>CROWN</span>
            <span style={{ color: "#fff" }}>FORGE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <div key={l.href} className="relative">
              <Link
                href={l.href}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: active(l.href) ? "#facc15" : "#64748b" }}
                onMouseEnter={e => { if (!active(l.href)) (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { if (!active(l.href)) (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
              >
                {active(l.href) && (
                  <span className="absolute inset-0 rounded-lg" style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)" }} />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
              {active(l.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "#facc15" }} />
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
            style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)", color: "#facc15" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(250,204,21,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(250,204,21,0.1)"; }}
          >
            <Zap size={11} /> Admin
          </Link>
          <Link href="/games" className="hidden md:flex btn-primary text-xs px-5 py-2.5">
            Play Now
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "500px" : "0", opacity: open ? 1 : 0 }}
      >
        <div style={{ background: "rgba(3,3,3,0.98)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1rem 1.5rem 1.5rem" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="flex items-center justify-between py-3.5 text-sm font-medium transition-colors"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: active(l.href) ? "#facc15" : "#94a3b8" }}>
              <span className="flex items-center gap-2">
                {active(l.href) && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                {l.label}
              </span>
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/games" className="btn-primary justify-center text-sm">Explore Games</Link>
            <Link href="/admin" className="btn-ghost justify-center text-sm">Admin Panel</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
