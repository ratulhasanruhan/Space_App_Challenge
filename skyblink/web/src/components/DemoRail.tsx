"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { DEMO_BEATS } from "@/lib/catalog";

function activeBeat(path: string, viewMode: string | null) {
  if (path.startsWith("/viewer")) return viewMode === "detective" ? "detective" : "blink";
  if (path.startsWith("/physics")) return "physics";
  if (path.startsWith("/learn")) return "academy";
  if (path.startsWith("/limits")) return "proof";
  if (path.startsWith("/stories")) return "blink";
  return "hook";
}

export default function DemoRail() {
  const path = usePathname();
  const params = useSearchParams();
  const current = activeBeat(path, params.get("viewMode"));

  return (
    <nav aria-label="Prescreen path" className="border-b border-white/10 bg-black/30">
      <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-xs">
        {DEMO_BEATS.map((beat, index) => {
          const on = beat.id === current;
          return (
            <li key={beat.id}>
              <Link
                href={beat.href}
                className={`flex items-center gap-2 rounded-full px-3 py-1 ${on ? "bg-amber-400 text-slate-950" : "text-slate-300 hover:bg-white/10"}`}
              >
                <span className="font-mono">{index + 1}</span>
                <span className="font-semibold">{beat.label}</span>
                <span className={on ? "text-slate-800" : "text-slate-500"}>{beat.hint}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
