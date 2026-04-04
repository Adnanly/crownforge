"use client";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Newspaper, MessageSquare, Users, Briefcase, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";

interface Stats { news: number; messages: number; applications: number; careers: number; }

const cards = [
  { key: "news",         label: "News Posts",    icon: Newspaper,       href: "/admin/news",         color: "#22d3ee", bg: "rgba(34,211,238,0.08)",   border: "rgba(34,211,238,0.2)"  },
  { key: "messages",     label: "Messages",      icon: MessageSquare,   href: "/admin/messages",     color: "#e879f9", bg: "rgba(232,121,249,0.08)",  border: "rgba(232,121,249,0.2)" },
  { key: "applications", label: "Applications",  icon: Users,           href: "/admin/applications", color: "#fbbf24", bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.2)"  },
  { key: "careers",      label: "Job Listings",  icon: Briefcase,       href: "/admin/careers",      color: "#4ade80", bg: "rgba(74,222,128,0.08)",   border: "rgba(74,222,128,0.2)"  },
];

const quickLinks = [
  { href: "/admin/news",         label: "Post a news update",    icon: Newspaper      },
  { href: "/admin/careers",      label: "Add a job listing",     icon: Briefcase      },
  { href: "/admin/messages",     label: "View new messages",     icon: MessageSquare  },
  { href: "/admin/applications", label: "Review applications",   icon: Users          },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ news: 0, messages: 0, applications: 0, careers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [news, messages, applications, careers] = await Promise.all([
          getCountFromServer(collection(db, "news")),
          getCountFromServer(collection(db, "messages")),
          getCountFromServer(collection(db, "applications")),
          getCountFromServer(collection(db, "careers")),
        ]);
        setStats({
          news: news.data().count,
          messages: messages.data().count,
          applications: applications.data().count,
          careers: careers.data().count,
        });
      } catch (err) {
        console.error("Stats fetch failed:", err);
        setStatsError(true);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Dashboard</h1>
          <p className="text-slate-600 text-sm">{today}</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
          style={{ color: "#4ade80", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Studio Online
        </div>
      </div>

      {/* Firestore error warning */}
      {statsError && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Firestore not connected</p>
            <p className="text-xs mt-0.5 opacity-80">
              Deploy Firestore rules or check your Firebase project. Stats unavailable.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(({ key, label, icon: Icon, href, color, bg, border }) => (
          <Link key={key} href={href}
            className="admin-card group transition-all hover:scale-[1.02]"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-3xl font-black text-white mb-1">
              {statsLoading ? <span className="inline-block w-8 h-7 bg-white/5 rounded animate-pulse" /> : statsError ? "—" : stats[key as keyof Stats]}
            </p>
            <p className="text-slate-500 text-sm">{label}</p>
            <div className="flex items-center gap-1 mt-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color }}>
              Manage <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={15} style={{ color: "#facc15" }} />
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-1.5">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(250,204,21,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(250,204,21,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Icon size={14} className="text-slate-600 group-hover:text-yellow-400 transition-colors" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                <ArrowRight size={12} className="ml-auto text-slate-700 group-hover:text-yellow-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="text-sm font-bold text-white mb-5">Studio Info</h2>
          <dl className="space-y-3">
            {[
              ["Studio",    "CrownForge Games"],
              ["Founded",   "Q1 2026"],
              ["Project",   "test-f17e0"],
              ["Contact",   "crownforgebusiness@gmail.com"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <dt className="text-slate-600">{k}</dt>
                <dd className="text-slate-300 font-medium text-right truncate max-w-[180px]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
