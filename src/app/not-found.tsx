"use client";
import Link from "next/link";
import { ArrowRight, Home, Gamepad2, Mail } from "lucide-react";
import ParticleField from "@/components/ParticleField";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#030303", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "1.5rem" }}>
      <ParticleField />
      {/* Glows */}
      <div style={{ position: "absolute", top: "20%", left: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(250,204,21,0.06),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle,rgba(244,114,182,0.05),transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "600px" }}>
        {/* 404 number */}
        <div style={{ fontSize: "clamp(8rem,20vw,16rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.05em", fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,rgba(250,204,21,0.15),rgba(250,204,21,0.04))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: "0", userSelect: "none" }}>
          404
        </div>

        <div style={{ position: "relative", marginTop: "-2rem", marginBottom: "1.5rem" }}>
          <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(250,204,21,0.3),transparent)", marginBottom: "2rem" }} />
          <h1 style={{ color: "#fff", fontSize: "clamp(1.5rem,4vw,2.25rem)", fontWeight: 800, margin: "0 0 1rem", letterSpacing: "-0.03em", fontFamily: "'Space Grotesk',sans-serif" }}>
            Page Not Found
          </h1>
          <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: 1.7, margin: "0 auto 2.5rem", maxWidth: "420px" }}>
            This page has been consumed by The Black Vaile. The world you&apos;re looking for doesn&apos;t exist in this dimension.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", alignItems: "center" }}>
          <Link href="/" className="btn-primary" style={{ width: "100%", maxWidth: "300px", justifyContent: "center", padding: "0.9rem 2rem" }}>
            <Home size={17} /> Return Home
          </Link>
          <div style={{ display: "flex", gap: "0.75rem", width: "100%", maxWidth: "300px" }}>
            <Link href="/games" className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "0.85rem", fontSize: "0.875rem" }}>
              <Gamepad2 size={15} /> Games
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "0.85rem", fontSize: "0.875rem" }}>
              <Mail size={15} /> Contact
            </Link>
          </div>
        </div>

        {/* Brand */}
        <div style={{ marginTop: "3rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <img src="/images/logos/CFS_Black_logo.png" alt="CF" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
            <span style={{ color: "#facc15" }}>CROWN</span>
            <span style={{ color: "#334155" }}>FORGE</span>
          </span>
        </div>
      </div>
    </div>
  );
}
