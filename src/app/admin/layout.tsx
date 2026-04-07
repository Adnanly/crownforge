"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard, Newspaper, MessageSquare,
  Users, Briefcase, LogOut, ExternalLink, Crown, ShieldX,
} from "lucide-react";

const navItems = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/news",         label: "News",         icon: Newspaper },
  { href: "/admin/messages",     label: "Messages",     icon: MessageSquare },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/careers",      label: "Careers",      icon: Briefcase },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !redirecting) {
      setRedirecting(true);
      router.push("/login");
    }
  }, [user, loading, router, redirecting]);

  /* ── Loading spinner ── */
  if (loading || (!user && !redirecting)) {
    return (
      <div style={{ minHeight: "100vh", background: "#030303", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ position: "relative", width: 56, height: 56 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(250,204,21,0.15)", borderTopColor: "#facc15", animation: "spin 1s linear infinite" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Crown size={16} style={{ color: "#facc15" }} />
          </div>
        </div>
        <p style={{ color: "#475569", fontSize: "0.875rem" }}>Loading CrownForge...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  /* ── Logged in but NOT admin ── */
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#030303", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", fontFamily: "Inter, system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldX size={28} style={{ color: "#f87171" }} />
        </div>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Access Denied</h1>
          <p style={{ color: "#475569", fontSize: "0.875rem", maxWidth: "360px" }}>
            You&apos;re logged in as <span style={{ color: "#94a3b8" }}>{user.email || user.phoneNumber}</span>, but your account does not have admin privileges.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: "10px", fontSize: "0.875rem", textDecoration: "none" }}>
            Go Home
          </Link>
          <button
            onClick={async () => { await signOut(auth); router.push("/login"); }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: "10px", fontSize: "0.875rem", cursor: "pointer" }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const displayName = user.email || user.phoneNumber || "Admin";

  return (
    <div className="min-h-screen flex" style={{ background: "#030303" }}>
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col sticky top-0 h-screen"
        style={{ background: "#070707", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Link href="/" className="flex items-center gap-2 mb-0.5">
            <Image src="/images/logos/CFS_Black_logo.png" alt="CF" width={20} height={20} className="object-contain" />
            <span className="font-black text-sm">
              <span style={{ color: "#facc15" }}>CROWN</span>
              <span style={{ color: "#fff" }}>FORGE</span>
            </span>
          </Link>
          <p className="text-xs ml-6" style={{ color: "#4ade80" }}>Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={active ? { background: "rgba(250,204,21,0.1)", color: "#facc15", border: "1px solid rgba(250,204,21,0.18)" } : { color: "#64748b", border: "1px solid transparent" }}
                onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = "#e2e8f0"; el.style.background = "rgba(255,255,255,0.04)"; } }}
                onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = "#64748b"; el.style.background = "transparent"; } }}>
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs px-2 py-1 mb-1 truncate" style={{ color: "#475569" }}>{displayName}</p>
          <Link href="/" target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all mb-0.5"
            style={{ color: "#64748b" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#e2e8f0"; el.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#64748b"; el.style.background = "transparent"; }}>
            <ExternalLink size={12} /> View Site
          </Link>
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all"
            style={{ color: "#64748b" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#f87171"; el.style.background = "rgba(239,68,68,0.06)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#64748b"; el.style.background = "transparent"; }}>
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
