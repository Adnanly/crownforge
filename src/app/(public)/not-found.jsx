import Link from "next/link";

export default function PublicNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ggg-bg px-ggg py-20 text-center text-ggg-text">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-ggg-accent">
        404 — Resource not found
      </p>
      <h1 className="mt-5 font-bebas text-[clamp(44px,9vw,84px)] font-bold uppercase leading-[0.88] text-white [font-synthesis:weight_style]">
        Page not <span className="text-ggg-accent">found</span>
      </h1>
      <p className="mt-7 max-w-[560px] text-base font-normal leading-[1.7] text-ggg-muted">
        That page does not exist. Return to the studio overview or browse the games catalog.
      </p>
      <nav aria-label="404 recovery" className="mt-9 flex flex-wrap justify-center gap-3">
        <Link className="rounded-ggg bg-ggg-accent px-5 py-3 text-[13px] font-semibold tracking-[0.01em] text-[#0a0a0a]" href="/">
          Home
        </Link>
        <Link className="rounded-ggg border border-ggg-border px-5 py-3 text-[13px] font-medium tracking-[0.01em] text-white" href="/games">
          Games
        </Link>
      </nav>
    </main>
  );
}
