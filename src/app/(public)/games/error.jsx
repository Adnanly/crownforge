"use client";

import Link from "next/link";

export default function GamesError({ reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ggg-bg px-ggg text-center">
      <h2 className="m-0 font-bebas text-5xl font-bold uppercase tracking-[0.005em] text-white sm:text-6xl">
        Games failed to <span className="text-ggg-accent">load</span>
      </h2>
      <p className="max-w-md text-ggg-body-sm text-ggg-muted">
        Try again in a moment, or head back home.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-ggg bg-ggg-accent px-5 py-2.5 text-[13px] font-semibold tracking-[0.01em] text-white transition-colors hover:brightness-110"
        >
          Retry
        </button>
        <Link
          href="/"
          className="rounded-ggg border border-ggg-border px-5 py-2.5 text-[13px] font-medium tracking-[0.01em] text-ggg-muted transition-colors hover:border-ggg-border-strong hover:text-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
