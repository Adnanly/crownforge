"use client";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

/* ─── Error code → human message ─── */
const errMsg = (code: string) => {
  const map: Record<string, string> = {
    "auth/invalid-email":           "Invalid email address.",
    "auth/user-not-found":          "No account found with this email.",
    "auth/wrong-password":          "Incorrect password.",
    "auth/invalid-credential":      "Incorrect email or password.",
    "auth/too-many-requests":       "Too many attempts. Try again later.",
    "auth/popup-closed-by-user":    "Sign-in was cancelled.",
    "auth/email-already-in-use":    "An account already exists with this email.",
    "auth/weak-password":           "Password must be at least 6 characters.",
    "auth/network-request-failed":  "Network error. Check your connection.",
  };
  return map[code] || `Authentication failed. (${code})`;
};

type Mode = "login" | "register" | "reset";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.push("/admin");
  }, [user, loading, router]);

  const clearMessages = () => { setError(""); setSuccess(""); };
  const switchMode = (m: Mode) => { setMode(m); clearMessages(); setPassword(""); setConfirmPassword(""); };

  /* ─── Email / Password ─── */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "register" && password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (mode === "register" && password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setBusy("email");
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/admin");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "unknown";
      setError(errMsg(code));
    } finally {
      setBusy(null);
    }
  };

  /* ─── Password Reset ─── */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email) { setError("Enter your email address."); return; }
    setBusy("reset");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Reset email sent! Check your inbox.");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "unknown";
      setError(errMsg(code));
    } finally {
      setBusy(null);
    }
  };

  /* ─── OAuth ─── */
  const handleOAuth = async (provider: "google" | "github") => {
    clearMessages();
    setBusy(provider);
    try {
      const p = provider === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      await signInWithPopup(auth, p);
      router.push("/admin");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "unknown";
      setError(errMsg(code));
    } finally {
      setBusy(null);
    }
  };

  if (!mounted || loading) return null;

  const isLogin    = mode === "login";
  const isRegister = mode === "register";
  const isReset    = mode === "reset";

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#030303", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ══════════ LEFT PANEL — Branding ══════════ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 20% 40%, rgba(250,204,21,0.08), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(244,114,182,0.06), transparent 50%), #050505" }} />
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.15 }} />

        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(250,204,21,0.06), transparent 70%)", animation: "pulse 4s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(244,114,182,0.05), transparent 70%)", animation: "pulse 6s ease-in-out infinite 2s" }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
              <Image src="/images/logos/CFS_Black_logo.png" alt="CrownForge" width={40} height={40} className="object-contain relative z-10" />
            </div>
            <span className="font-black text-lg tracking-tight">
              <span style={{ color: "#facc15" }}>CROWN</span>
              <span style={{ color: "#fff" }}>FORGE</span>
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          {/* Floating game cards */}
          <div className="relative h-64 mb-12">
            {[
              { title: "War-X",             color: "#ef4444", rotate: "-8deg",  x: "0%",   y: "10%",  delay: "0s"   },
              { title: "The Black Vaile",   color: "#8b5cf6", rotate: "4deg",   x: "30%",  y: "0%",   delay: "0.3s" },
              { title: "Zombie Strikeforce",color: "#22c55e", rotate: "-3deg",  x: "60%",  y: "15%",  delay: "0.6s" },
            ].map((g) => (
              <div key={g.title} className="absolute w-36 h-44 rounded-2xl overflow-hidden"
                style={{
                  left: g.x, top: g.y,
                  transform: `rotate(${g.rotate})`,
                  background: `linear-gradient(135deg, ${g.color}20, ${g.color}08)`,
                  border: `1px solid ${g.color}30`,
                  animation: `float 4s ease-in-out infinite`,
                  animationDelay: g.delay,
                  backdropFilter: "blur(8px)",
                }}>
                <div className="p-4 h-full flex flex-col justify-end">
                  <div className="w-6 h-6 rounded-lg mb-2" style={{ background: g.color, opacity: 0.8 }} />
                  <p className="text-white text-xs font-bold leading-tight">{g.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: g.color }}>Released</p>
                </div>
              </div>
            ))}
          </div>

          <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none mb-4">
            Access the<br />
            <span className="text-shimmer">Forge.</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
            Sign in to manage your games, review applications, post news, and run the studio backend.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10">
            {[["3+", "Games"], ["50K+", "Players"], ["2026", "Founded"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-xs text-slate-600 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-slate-700 text-xs">© 2026 CrownForge Games</p>
          <Link href="/" className="text-xs text-slate-600 hover:text-white transition-colors">← Back to site</Link>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL — Auth Form ══════════ */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col items-center justify-center p-6 md:p-12 relative"
        style={{ background: "#070707", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 self-start">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/images/logos/CFS_Black_logo.png" alt="CrownForge" width={28} height={28} className="object-contain" />
            <span className="font-black text-sm"><span style={{ color: "#facc15" }}>CROWN</span><span style={{ color: "#fff" }}>FORGE</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isLogin ? "Welcome back" : isRegister ? "Create account" : "Reset password"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin    ? "Sign in to access the CrownForge studio panel." :
               isRegister ? "Register to get access to the studio backend." :
                            "Enter your email and we'll send a reset link."}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
              {success}
            </div>
          )}

          {/* OAuth buttons — only show on login/register */}
          {!isReset && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Google */}
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={!!busy}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  {busy === "google" ? <Spinner /> : (
                    <svg width="17" height="17" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Google
                </button>

                {/* GitHub */}
                <button
                  onClick={() => handleOAuth("github")}
                  disabled={!!busy}
                  className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  {busy === "github" ? <Spinner /> : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  )}
                  GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <span className="text-xs font-medium" style={{ color: "#334155" }}>or continue with email</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
            </>
          )}

          {/* Email Form */}
          <form onSubmit={isReset ? handleReset : handleEmailAuth} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
                Email Address
              </label>
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: "2.75rem" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            {!isReset && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Password</label>
                  {isLogin && (
                    <button type="button" onClick={() => switchMode("reset")} className="text-xs transition-colors" style={{ color: "#475569" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (register only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Confirm Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: "2.75rem" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!!busy}
              className="btn-primary w-full justify-center py-3.5 mt-2"
              style={busy === "email" ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
              {busy === "email" || busy === "reset" ? (
                <><Spinner /> {isLogin ? "Signing in..." : isRegister ? "Creating account..." : "Sending..."}</>
              ) : (
                isLogin ? "Sign In" : isRegister ? "Create Account" : "Send Reset Link"
              )}
            </button>
          </form>

          {/* Mode switcher */}
          <div className="mt-6 text-center space-y-2">
            {isReset ? (
              <button onClick={() => switchMode("login")} className="text-sm transition-colors" style={{ color: "#475569" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                ← Back to sign in
              </button>
            ) : isLogin ? (
              <p className="text-sm" style={{ color: "#475569" }}>
                Don&apos;t have an account?{" "}
                <button onClick={() => switchMode("register")} className="font-semibold transition-colors" style={{ color: "#facc15" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fde047"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}>
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-sm" style={{ color: "#475569" }}>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="font-semibold transition-colors" style={{ color: "#facc15" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fde047"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}>
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs" style={{ color: "#1e293b" }}>
            By signing in you agree to our{" "}
            <Link href="/terms-of-service" className="underline hover:text-slate-500 transition-colors">Terms</Link>
            {" & "}
            <Link href="/privacy-policy" className="underline hover:text-slate-500 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-12px) rotate(var(--r,0deg))} }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
