"use client";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Career } from "@/types";
import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";

const typeColors: Record<string, string> = {
  "Full-time": "bg-green-500/10 text-green-400 border-green-500/25",
  "Part-time": "bg-blue-500/10 text-blue-400 border-blue-500/25",
  Contract: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  Remote: "bg-purple-500/10 text-purple-400 border-purple-500/25",
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, "careers"), where("isOpen", "==", true), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Career)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      {/* Header */}
      <div className="mb-14">
        <h1 className="section-title text-5xl mb-4">Careers at <span className="text-gradient">CrownForge</span></h1>
        <p className="section-subtitle">Help us forge next-generation worlds. We value craftsmanship, curiosity, and player-first design.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Jobs list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-2xl">Open Positions</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500">Live</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-slate-600" size={32} /></div>
          ) : !jobs.length ? (
            <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-10 text-center">
              <Briefcase className="text-slate-700 mx-auto mb-3" size={36} />
              <p className="text-slate-400 font-semibold">No open positions right now</p>
              <p className="text-slate-600 text-sm mt-2">Send us your CV at <a href="mailto:crownforgebusiness@gmail.com" className="text-brand-accent">crownforgebusiness@gmail.com</a></p>
            </div>
          ) : jobs.map((job) => (
            <div key={job.id} className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-6 hover:border-brand-accent/30 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`status-badge border text-xs ${typeColors[job.type] ?? "bg-white/5 text-slate-400 border-white/10"}`}>{job.type}</span>
                    <span className="text-slate-600 text-xs">{job.department}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-brand-accent transition-colors">{job.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-slate-600 text-xs">
                    <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{job.type}</span>
                  </div>
                </div>
                <Link href={`/careers/apply?id=${job.id}&title=${encodeURIComponent(job.title)}`}
                  className="flex-shrink-0 btn-primary text-sm py-2 px-4">
                  Apply <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-6">
            <h3 className="text-white font-bold text-xl mb-4">Studio Culture</h3>
            <ul className="space-y-3 text-slate-500 text-sm">
              {["Flexible work and healthy pace.", "Transparent roadmaps and open comms.", "Learning support and conference budgets.", "Diverse, inclusive, and collaborative team."].map(i => (
                <li key={i} className="flex items-center gap-2 before:content-['→'] before:text-brand-accent before:text-xs">{i}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0d0d0d] border border-white/[0.07] rounded-2xl p-6">
            <h3 className="text-white font-bold text-xl mb-4">General Application</h3>
            <p className="text-slate-500 text-sm mb-4">Don&apos;t see your role? Send us your CV and portfolio directly.</p>
            <a href="mailto:crownforgebusiness@gmail.com?subject=General Application" className="btn-primary w-full justify-center text-sm">
              Email Us <ArrowRight size={14} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
