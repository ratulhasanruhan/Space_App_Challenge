"use client";

import Link from "next/link";
import { CASE_BADGE, emptyProgress, MISSIONS, nextRank, rankFor } from "@/lib/academy";
import { useAcademy } from "@/lib/useAcademy";

export default function LearnPage() {
  const { progress, ready, update } = useAcademy();
  const rank = rankFor(progress.xp);
  const upcoming = nextRank(progress.xp);
  const span = upcoming ? upcoming.min - rank.min : 1;
  const into = upcoming ? progress.xp - rank.min : 1;
  const pct = Math.max(0, Math.min(100, (into / span) * 100));
  const suggested = MISSIONS.find((mission) => !progress.completed.includes(mission.id));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Classroom mode</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Sky Academy</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Six short missions. Correct answers pay XP once. Ranks move from Cadet to Principal Investigator when you can say the limit out loud.
      </p>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500">Current rank</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">{ready ? rank.name : "Cadet"}</h2>
          <p className="mt-1 text-sm text-slate-400">{rank.blurb}</p>
          <p className="mt-4 font-mono text-amber-300">{progress.xp} XP · streak {progress.streak} · best {progress.bestStreak}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-amber-400" style={{ width: `${upcoming ? pct : 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {upcoming ? `${upcoming.min - progress.xp} XP to ${upcoming.name}` : "Top rank. Teach someone else."}
          </p>
          <button
            type="button"
            className="mt-4 text-xs text-slate-500 underline"
            onClick={() => update(emptyProgress())}
          >
            Reset progress for another take
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Badges</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {MISSIONS.map((mission) => {
              const earned = progress.completed.includes(mission.id);
              return (
                <li key={mission.id} className={`rounded-full px-3 py-1 text-xs ${earned ? "bg-amber-400 text-slate-950" : "bg-white/10 text-slate-500"}`}>
                  {mission.badge}
                </li>
              );
            })}
            <li className={`rounded-full px-3 py-1 text-xs ${progress.cases.length ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-500"}`}>
              {CASE_BADGE}
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-400">{progress.cases.length} field {progress.cases.length === 1 ? "case" : "cases"} filed from Detective mode.</p>
        </div>
      </section>

      {suggested && (
        <Link href={`/learn/${suggested.id}`} className="mt-6 block rounded-2xl bg-amber-400 px-5 py-4 font-semibold text-slate-950">
          Next mission · {suggested.title}
        </Link>
      )}

      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {MISSIONS.map((mission, index) => {
          const done = progress.completed.includes(mission.id);
          return (
            <li key={mission.id}>
              <Link href={`/learn/${mission.id}`} className="block h-full rounded-3xl bg-white/[0.04] px-5 py-5 ring-1 ring-white/10 hover:bg-white/[0.07]">
                <p className="text-xs text-[#8d8778]">Mission {index + 1} · {mission.xp} XP</p>
                <h3 className="mt-2 text-2xl text-white">{mission.title}</h3>
                <p className={`mt-3 text-sm ${done ? "text-amber-200" : "text-[#b7b09e]"}`}>{done ? "Cleared" : mission.badge}</p>
              </Link>
            </li>
          );
        })}
      </ol>

      <section className="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-5">
        <h2 className="text-lg font-semibold text-cyan-100">Field case</h2>
        <p className="mt-2 text-sm leading-6 text-cyan-50/80">
          Open the mover in Detective mode and mark it real or fake. The first call files the case and pays {40} XP. The cutout is illustrative. The call is about whether you read the numbers.
        </p>
        <Link
          href="/viewer/F_MOVER?mode=difference&viewMode=detective&candidate=F_MOVER_1.25_0&story=mover"
          className="mt-4 inline-block rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Open the case
        </Link>
      </section>
    </main>
  );
}
