"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../../../../lib/utils.js";

export function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function navLinkClassName(active) {
  return cn(
    "font-inter text-[13px] font-bold uppercase tracking-[0.07em] text-ggg-text touch-manipulation transition-colors hover:text-ggg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ggg-accent",
    active && "text-ggg-accent underline underline-offset-[6px] decoration-2 decoration-ggg-accent",
  );
}

export default function HeaderNavLinks({ items }) {
  const pathname = usePathname();

  return items.map((item) => {
    const active = isActivePath(pathname, item.href);
    return (
      <Link className={navLinkClassName(active)} key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
        {item.label}
      </Link>
    );
  });
}
