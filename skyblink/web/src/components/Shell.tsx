"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/stories", label: "Stories" },
  { href: "/learn", label: "Academy" },
  { href: "/physics", label: "Physics" },
  { href: "/limits", label: "Proof" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06080f]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-baseline gap-3 text-white">
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight">SkyBlink</span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-amber-200/80 sm:inline">Simulated sky</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {LINKS.map((link) => {
              const on = path === link.href || path.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 ${on ? "bg-[#f4f0e6] text-[#16130e]" : "text-[#d9d3c5] hover:bg-white/10"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="mx-auto mt-20 max-w-6xl px-5 py-8 text-xs leading-5 text-[#8d8778]">
        Simulated SPHEREx-like fields for NASA Space Apps. These are not flight observations.
        <br />
        QR2 DOI 10.26131/IRSA652. The official IRSA acknowledgement still has to be pasted in before a public data release.
      </footer>
    </>
  );
}
