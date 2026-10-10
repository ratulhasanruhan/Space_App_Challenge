"use client";

import Link from "next/link";
import InteractiveCanvas from "@/components/InteractiveCanvas";
import { DEMO_BEATS, STORIES, viewerHref } from "@/lib/catalog";

const hero = STORIES[0];

export default function HomeStage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-amber-200/90">NASA Space Apps 2026 · SPHEREx</p>
          <h1 className="mt-4 text-6xl text-white sm:text-7xl">See what moved.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-[#d4cdb8]">
            Two nights, one wavelength. Stars stay. A mover leaves and arrives. SkyBlink is the blink that does not compare different colors.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={viewerHref(hero, "explorer", "blink")} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-[#1a1408]">
              Open this sky
            </Link>
            <Link href="/learn" className="rounded-full px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/10">
              Learn it
            </Link>
          </div>
        </div>
        <div>
          <InteractiveCanvas fieldId="F_MOVER" candidateId="F_MOVER_1.25_0" mode="blink" scenario="mover" frameClassName="h-[420px] rounded-[28px]" />
          <p className="mt-3 text-sm text-[#b7b09e]">The bright source is the mover. Everything else is a star that stayed put.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-5 pb-8 sm:grid-cols-3">
        {[
          ["/stories", "Stories", "Four skies. Start with the rock that changed place."],
          ["/physics", "Physics", "Drag Planet X out to 500 AU and read the limit."],
          ["/limits", "Proof", "What the pipeline recovered, and what it missed."],
        ].map(([href, title, copy]) => (
          <Link key={href} href={href} className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.07]">
            <h2 className="text-2xl text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#b7b09e]">{copy}</p>
          </Link>
        ))}
      </section>

      <details className="mx-auto max-w-6xl px-5 pb-4 text-sm text-[#8d8778]">
        <summary className="cursor-pointer">Recording order</summary>
        <ol className="mt-3 grid gap-1 sm:grid-cols-2">
          {DEMO_BEATS.map((beat, index) => (
            <li key={beat.id}>
              <Link href={beat.href} className="hover:text-white">
                {index + 1}. {beat.label} — {beat.hint}
              </Link>
            </li>
          ))}
        </ol>
      </details>
    </main>
  );
}
