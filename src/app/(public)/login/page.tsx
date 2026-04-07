"use client";
import { useState, useEffect, useRef } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

/* ── Error code → human message ── */
const errMsg = (code: string) => {
  const map: Record<string, string> = {
    "auth/invalid-email":             "Invalid email address.",
    "auth/user-not-found":            "No account found with this email.",
    "auth/wrong-password":            "Incorrect password.",
    "auth/invalid-credential":        "Incorrect email or password.",
    "auth/too-many-requests":         "Too many attempts. Try again later.",
    "auth/popup-closed-by-user":      "Sign-in was cancelled.",
    "auth/network-request-failed":    "Network error. Check your connection.",
    "auth/invalid-phone-number":      "Invalid phone number. Use format: +91XXXXXXXXXX",
    "auth/invalid-verification-code": "Wrong OTP. Please try again.",
    "auth/code-expired":              "OTP expired. Please request a new one.",
    "auth/quota-exceeded":            "SMS quota exceeded. Try email login.",
    "auth/unauthorized-domain":       "Domain not authorised. Contact support.",
    "auth/email-already-in-use":      "An account already exists with this email.",
    "auth/weak-password":             "Password must be at least 6 characters.",
    "auth/account-exists-with-different-credential": "Account exists with a different sign-in method.",
  };
  return map[code] || `Authentication failed. (${code})`;
};

type Tab   = "email" | "phone";
type Mode  = "login" | "register";
// email flow steps
type EStep = "input" | "reset" | "verify-pending" | "password-otp";
// phone flow steps
type PStep = "input" | "otp";

declare global {
  interface Window { recaptchaVerifier?: RecaptchaVerifier; }
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  /* ── Tab / Mode ── */
  const [tab,  setTab]  = useState<Tab>("email");
  const [mode, setMode] = useState<Mode>("login");

  /* ── Email state ── */
  const [eStep,           setEStep]           = useState<EStep>("input");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);

  /* ── Phone state ── */
  const [pStep,         setPStep]         = useState<PStep>("input");
  const [phone,         setPhone]         = useState("");
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [otpTimer,      setOtpTimer]      = useState(0);

  /* ── Shared OTP boxes (used for both phone OTP and email-after-password OTP) ── */
  const [otp,    setOtp]    = useState(["","","","","",""]);
  const otpRefs             = useRef<(HTMLInputElement | null)[]>([]);

  /* ── UI ── */
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [busy,    setBusy]    = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (!loading && user) router.push("/"); }, [user, loading, router]);

  /* OTP countdown */
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const clearMessages = () => { setError(""); setSuccess(""); };
  const resetOtp      = () => setOtp(["","","","","",""]);

  /* ── reCAPTCHA ── */
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
    return window.recaptchaVerifier;
  };

  /* ── OTP box handlers ── */
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  /* ════════════════════════════════
     EMAIL HANDLERS
  ════════════════════════════════ */

  /* REGISTER — create account → send verification email → show pending screen */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages();
    if (!email || !password || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword)            { setError("Passwords do not match."); return; }
    if (password.length < 6)                     { setError("Password must be at least 6 characters."); return; }
    setBusy("email");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      await signOut(auth); // sign out — must verify first
      setEStep("verify-pending");
      setSuccess("Verification email sent! Check your inbox then come back to sign in.");
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  /* LOGIN — check email verified → then send phone OTP if phone set, else sign in */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setBusy("email");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Block unverified email accounts
      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        await signOut(auth);
        setEStep("verify-pending");
        setSuccess("Your email isn't verified yet. We've resent the verification email.");
        setBusy(null);
        return;
      }

      // Signed in successfully — redirect
      router.push("/");
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  /* PASSWORD RESET */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages();
    if (!email) { setError("Enter your email address."); return; }
    setBusy("reset");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Reset email sent! Check your inbox.");
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  /* RESEND VERIFICATION */
  const handleResendVerification = async () => {
    clearMessages(); setBusy("resend");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        await signOut(auth);
        setSuccess("Verification email resent!");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  /* ════════════════════════════════
     OAUTH HANDLERS
  ════════════════════════════════ */
  const handleGoogle = async () => {
    clearMessages(); setBusy("google");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/");
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  const handleGithub = async () => {
    clearMessages(); setBusy("github");
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
      router.push("/");
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  /* ════════════════════════════════
     PHONE HANDLERS
  ════════════════════════════════ */
  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault(); clearMessages();
    const cleaned = phone.trim();
    if (!cleaned)                          { setError("Enter your phone number."); return; }
    if (!/^\+\d{10,15}$/.test(cleaned))   { setError("Use format: +91XXXXXXXXXX"); return; }
    setBusy("sendOtp");
    try {
      const verifier = setupRecaptcha();
      const result   = await signInWithPhoneNumber(auth, cleaned, verifier);
      setConfirmResult(result);
      setPStep("otp");
      resetOtp();
      setOtpTimer(60);
      setSuccess("OTP sent to " + cleaned);
    } catch (err: unknown) {
      window.recaptchaVerifier = undefined;
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages();
    const code = otp.join("");
    if (code.length < 6)   { setError("Enter the 6-digit OTP."); return; }
    if (!confirmResult)    { setError("Session expired. Please resend OTP."); return; }
    setBusy("verifyOtp");
    try {
      await confirmResult.confirm(code);
      router.push("/");
    } catch (err: unknown) {
      setError(errMsg((err as { code?: string }).code || "unknown"));
    } finally { setBusy(null); }
  };

  /* ── Guards ── */
  if (!mounted || loading) return null;

  const isReset         = eStep === "reset";
  const isVerifyPending = eStep === "verify-pending";

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#030303", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ══ LEFT PANEL — Branding ══ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 20% 40%, rgba(250,204,21,0.08), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(244,114,182,0.06), transparent 50%), #050505" }} />
        <div className="absolute inset-0 bg-grid-pattern bg-grid-60 pointer-events-none" style={{ opacity: 0.15 }} />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
              <Image src="/images/logos/CFS_Black_logo.png" alt="CrownForge" width={40} height={40} className="object-contain relative z-10" />
            </div>
            <span className="font-black text-lg tracking-tight">
              <span style={{ color: "#facc15" }}>CROWN</span><span style={{ color: "#fff" }}>FORGE</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none mb-4">
            {mode === "register" ? "Join the\n" : "Access the\n"}
            <span className="text-shimmer">{mode === "register" ? "Forge." : "Forge."}</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
            {mode === "register"
              ? "Create an account to apply for jobs, send messages, and be part of CrownForge."
              : "Sign in to apply for jobs, send messages, and interact with the CrownForge studio."}
          </p>
          <div className="flex items-center gap-8 mt-10">
            {[["3+", "Games"], ["50K+", "Players"], ["2026", "Founded"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-xs text-slate-600 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-slate-700 text-xs">© 2026 CrownForge Games</p>
          <Link href="/" className="text-xs text-slate-600 hover:text-white transition-colors">← Back to site</Link>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Auth Form ══ */}
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

          {/* ── VERIFY PENDING SCREEN ── */}
          {isVerifyPending ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Check your email</h2>
              <p className="text-slate-500 text-sm mb-1">We sent a verification link to</p>
              <p className="text-white font-semibold text-sm mb-6">{email}</p>
              <p className="text-slate-600 text-xs mb-6 leading-relaxed">
                Click the link in the email to verify your account. Once verified, come back here and sign in.
              </p>
              {success && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm text-left"
                  style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm text-left"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <button onClick={handleResendVerification} disabled={!!busy}
                  className="btn-primary w-full justify-center py-3"
                  style={busy ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
                  {busy === "resend" ? <><Spinner /> Resending...</> : "Resend Verification Email"}
                </button>
                <button onClick={() => { setEStep("input"); clearMessages(); }}
                  className="w-full py-2 text-sm transition-colors" style={{ color: "#475569" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                  ← Back to sign in
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-7">
                <h2 className="text-3xl font-black text-white tracking-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {isReset ? "Reset password" : mode === "register" ? "Create account" : "Welcome back"}
                </h2>
                <p className="text-slate-500 text-sm">
                  {isReset
                    ? "Enter your email and we'll send a reset link."
                    : mode === "register"
                    ? "Sign up to join the CrownForge community."
                    : "Sign in to your CrownForge account."}
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

              {/* Social buttons — only on login/register, not reset */}
              {!isReset && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {/* Google */}
                    <button onClick={handleGoogle} disabled={!!busy}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                      {busy === "google" ? <Spinner /> : (
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Google
                    </button>

                    {/* GitHub */}
                    <button onClick={handleGithub} disabled={!!busy}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                      {busy === "github" ? <Spinner /> : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                      GitHub
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <span className="text-xs font-medium" style={{ color: "#334155" }}>or continue with</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>

                  {/* Tab — Email / Phone (only for login, not register) */}
                  {mode === "login" && (
                    <div className="flex rounded-xl p-1 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {(["email", "phone"] as Tab[]).map(t => (
                        <button key={t} onClick={() => { setTab(t); setPStep("input"); clearMessages(); resetOtp(); }}
                          className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={tab === t
                            ? { background: "rgba(250,204,21,0.12)", color: "#facc15", border: "1px solid rgba(250,204,21,0.2)" }
                            : { color: "#475569", border: "1px solid transparent" }}>
                          {t === "email" ? "📧 Email" : "📱 Phone"}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ════ EMAIL / REGISTER FORM ════ */}
              {(tab === "email" || mode === "register" || isReset) && (
                <form onSubmit={isReset ? handleReset : mode === "register" ? handleRegister : handleEmailLogin} className="space-y-4">

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Email Address</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <input type="email" autoComplete="email" placeholder="you@example.com" value={email}
                        onChange={e => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: "2.75rem" }}
                        onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                    </div>
                  </div>

                  {/* Password */}
                  {!isReset && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Password</label>
                        {mode === "login" && (
                          <button type="button" onClick={() => { setEStep("reset"); clearMessages(); }}
                            className="text-xs transition-colors" style={{ color: "#475569" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <input type={showPassword ? "text" : "password"}
                          autoComplete={mode === "register" ? "new-password" : "current-password"}
                          placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                          className="input-field" style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
                          onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#475569" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                          {showPassword
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm password — register only */}
                  {mode === "register" && !isReset && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Confirm Password</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        <input type={showPassword ? "text" : "password"} autoComplete="new-password"
                          placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          className="input-field" style={{ paddingLeft: "2.75rem" }}
                          onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={!!busy} className="btn-primary w-full justify-center py-3.5 mt-2"
                    style={busy ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
                    {busy === "email" ? <><Spinner /> {mode === "register" ? "Creating account..." : "Signing in..."}</>
                      : busy === "reset" ? <><Spinner /> Sending...</>
                      : isReset ? "Send Reset Link"
                      : mode === "register" ? "Create Account"
                      : "Sign In"}
                  </button>

                  {isReset && (
                    <button type="button" onClick={() => { setEStep("input"); clearMessages(); }}
                      className="w-full text-center text-sm py-2 transition-colors" style={{ color: "#475569" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                      ← Back to sign in
                    </button>
                  )}
                </form>
              )}

              {/* ════ PHONE FORM ════ */}
              {tab === "phone" && mode === "login" && !isReset && (
                <>
                  {pStep === "input" && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#475569" }}>Phone Number</label>
                        <input type="tel" placeholder="+91XXXXXXXXXX" value={phone}
                          onChange={e => setPhone(e.target.value)} className="input-field"
                          onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                        <p className="text-xs mt-1.5" style={{ color: "#334155" }}>Include country code — e.g. +91 for India</p>
                      </div>
                      <button type="submit" disabled={!!busy} className="btn-primary w-full justify-center py-3.5"
                        style={busy ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
                        {busy === "sendOtp" ? <><Spinner /> Sending OTP...</> : "Send OTP"}
                      </button>
                    </form>
                  )}

                  {pStep === "otp" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div>
                        <p className="text-sm text-white font-semibold mb-1">Enter the 6-digit OTP</p>
                        <p className="text-xs mb-4" style={{ color: "#475569" }}>Sent to <span style={{ color: "#94a3b8" }}>{phone}</span></p>
                        <div className="flex gap-2.5 justify-center">
                          {otp.map((digit, i) => (
                            <input key={i} ref={el => { otpRefs.current[i] = el; }}
                              type="text" inputMode="numeric" maxLength={1} value={digit}
                              onChange={e => handleOtpChange(i, e.target.value)}
                              onKeyDown={e => handleOtpKey(i, e)}
                              className="w-11 h-12 text-center text-white text-lg font-bold rounded-xl outline-none transition-all"
                              style={{ background: "rgba(255,255,255,0.04)", border: digit ? "1px solid rgba(250,204,21,0.5)" : "1px solid rgba(255,255,255,0.1)", caretColor: "#facc15" }}
                              onFocus={e => { e.target.style.borderColor = "rgba(250,204,21,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.08)"; }}
                              onBlur={e => { if (!digit) { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; } }} />
                          ))}
                        </div>
                      </div>
                      <button type="submit" disabled={!!busy || otp.join("").length < 6} className="btn-primary w-full justify-center py-3.5"
                        style={(busy || otp.join("").length < 6) ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
                        {busy === "verifyOtp" ? <><Spinner /> Verifying...</> : "Verify & Sign In"}
                      </button>
                      <div className="flex items-center justify-between text-xs">
                        <button type="button" onClick={() => { setPStep("input"); resetOtp(); clearMessages(); }} style={{ color: "#475569" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; }}>
                          ← Change number
                        </button>
                        {otpTimer > 0
                          ? <span style={{ color: "#475569" }}>Resend in {otpTimer}s</span>
                          : <button type="button" onClick={() => handleSendOtp()} style={{ color: "#facc15" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fde047"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}>
                              Resend OTP
                            </button>
                        }
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* ── Mode switcher ── */}
              {!isReset && (
                <p className="mt-6 text-center text-sm" style={{ color: "#475569" }}>
                  {mode === "login" ? (
                    <>Don&apos;t have an account?{" "}
                      <button onClick={() => { setMode("register"); setTab("email"); clearMessages(); setPassword(""); setConfirmPassword(""); }}
                        className="font-semibold transition-colors" style={{ color: "#facc15" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fde047"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}>
                        Create one
                      </button>
                    </>
                  ) : (
                    <>Already have an account?{" "}
                      <button onClick={() => { setMode("login"); clearMessages(); setPassword(""); setConfirmPassword(""); }}
                        className="font-semibold transition-colors" style={{ color: "#facc15" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fde047"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#facc15"; }}>
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              )}

              <p className="mt-6 text-center text-xs" style={{ color: "#1e293b" }}>
                By continuing you agree to our{" "}
                <Link href="/terms-of-service" className="underline hover:text-slate-500 transition-colors">Terms</Link>
                {" & "}
                <Link href="/privacy-policy" className="underline hover:text-slate-500 transition-colors">Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container" />
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: "spin 0.8s linear infinite" }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
