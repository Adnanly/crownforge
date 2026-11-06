"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { isActivePath, navLinkClassName } from "./HeaderNavLinks.jsx";

export default function HeaderMobileMenu({ items }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-[1100px]:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center text-ggg-text transition-colors hover:text-ggg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ggg-accent"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden>
          <span className={`block h-px w-full bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-px w-full bg-current transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-full bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-0 top-[70px] z-[199] border-b border-ggg-border bg-ggg-bg px-ggg py-6"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-5">
            {items.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClassName(active)}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
