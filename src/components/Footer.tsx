"use client";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Youtube, Instagram, Github, MessageCircle, ArrowUpRight } from "lucide-react";

const cols = {
  Games: [
    { href: "/games/war-x",             label: "War-X" },
    { href: "/games/black-vaile",        label: "The Black Vaile" },
    { href: "/games/zombie-strikeforce", label: "Zombie Strikeforce" },
    { href: "/games/tank-arena",         label: "Tank Arena" },
  ],
  Studio: [
    { href: "/about",   label: "About Us" },
    { href: "/careers", label: "Careers"  },
    { href: "/news",    label: "News"     },
    { href: "/contact", label: "Contact"  },
  ],
  Legal: [
    { href: "/privacy-policy",   label: "Privacy Policy"   },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/admin",            label: "Admin Panel"      },
  ],
};

const socials = [
  { icon: Twitter,       href: "#", label: "Twitter / X", color: "#1d9bf0" },
  { icon: Youtube,       href: "#", label: "YouTube",      color: "#ff0000" },
  { icon: Instagram,     href: "#", label: "Instagram",    color: "#e1306c" },
  { icon: Github,        href: "#", label: "GitHub",       color: "#fff"    },
  { icon: MessageCircle, href: "#", label: "Discord",      color: "#5865f2" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#030303", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <Image src="/images/logos/CFS_Black_logo.png" alt="CrownForge" width={32} height={32} className="h-8 w-auto object-contain" />
              <span className="font-display font-black text-base tracking-tight">
                <span style={{ color: "#facc15" }}>CROWN</span><span style={{ color: "#fff" }}>FORGE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#475569", maxWidth: "280px" }}>
              Forging next-generation immersive gaming experiences. Where worlds are born and legends are made.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#475569" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = color; el.style.borderColor = `${color}50`; el.style.background = `${color}15`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#475569"; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.background = "rgba(255,255,255,0.05)"; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm flex items-center gap-1 group transition-colors duration-200"
                      style={{ color: "#475569" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                      {l.label}
                      <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom glow line */}
        <div className="h-px mb-8" style={{ background: "linear-gradient(90deg,transparent,rgba(250,204,21,0.2),transparent)" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#1e293b" }}>
            © 2026 CrownForge Games. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
            <span className="text-xs" style={{ color: "#1e293b" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
