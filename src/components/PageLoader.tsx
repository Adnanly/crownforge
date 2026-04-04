"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const steps = [
      { p: 20, d: 100 }, { p: 45, d: 200 }, { p: 70, d: 150 },
      { p: 90, d: 200 }, { p: 100, d: 300 },
    ];
    let i = 0;
    const run = () => {
      if (i >= steps.length) {
        setTimeout(() => setFading(true), 100);
        setTimeout(() => setVisible(false), 600);
        return;
      }
      setTimeout(() => { setProgress(steps[i].p); i++; run(); }, steps[i].d);
    };
    run();
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999, background: "#030303",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "1.5rem", transition: "opacity 0.5s ease", opacity: fading ? 0 : 1,
      pointerEvents: fading ? "none" : "all",
    }}>
      {/* Logo */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(250,204,21,0.15)", animation: "ping 2s ease-out infinite" }} />
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(250,204,21,0.25)", background: "rgba(250,204,21,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image src="/images/logos/CFS_Black_logo.png" alt="CrownForge" width={28} height={28} style={{ objectFit: "contain" }} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
          <span style={{ color: "#facc15" }}>CROWN</span>
          <span style={{ color: "#fff" }}>FORGE</span>
        </p>
        <p style={{ color: "#334155", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Loading...</p>
      </div>

      {/* Progress bar */}
      <div style={{ width: "120px", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "999px", transition: "width 0.3s ease",
          width: `${progress}%`, background: "linear-gradient(90deg,#facc15,#fde047)",
        }} />
      </div>

      <style>{`
        @keyframes ping { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2);opacity:0} }
      `}</style>
    </div>
  );
}
