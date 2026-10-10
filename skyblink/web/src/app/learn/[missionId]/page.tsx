"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import InteractiveCanvas from "@/components/InteractiveCanvas";
import { PlanetXPanel } from "@/components/PhysicsLab";
import { awardMission, missionById, MISSIONS, rankFor } from "@/lib/academy";
import { useAcademy } from "@/lib/useAcademy";

export default function MissionPage() {
  const params = useParams<{ missionId: string }>();
  const missionId = Array.isArray(params.missionId) ? params.missionId[0] : params.missionId;
  const mission = missionById(missionId);
  const { progress, update } = useAcademy();
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  if (!mission) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Mission not found</h1>
        <Link href="/learn" className="mt-4 inline-block text-amber-300">Back to the academy</Link>
      </main>
    );
  }

  const choice = mission.choices.find((item) => item.id === picked);
  const index = MISSIONS.findIndex((item) => item.id === mission.id);
  const next = MISSIONS[index + 1];

  const choose = (id: string) => {
    setPicked(id);
    const selected = mission.choices.find((item) => item.id === id);
    if (!selected) return;
    const wasDone = progress.completed.includes(mission.id);
    const next = awardMission(progress, mission.id, mission.xp, selected.correct);
    update(next);
    if (!selected.correct) {
      setNote("Not yet. Streak resets. Read the why, then try another answer.");
      return;
    }
    setNote(wasDone ? "Already cleared. XP was paid once." : `Cleared. +${mission.xp} XP. Rank: ${rankFor(next.xp).name}.`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/learn" className="text-sm text-slate-400">Academy</Link>
      <p className="mt-4 text-xs uppercase tracking-widest text-amber-300">Mission {index + 1} · {mission.xp} XP · {mission.badge}</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">{mission.title}</h1>
      <div className="mt-4 space-y-3 text-slate-300">
        {mission.lesson.map((paragraph) => (
          <p key={paragraph} className="leading-7">{paragraph}</p>
        ))}
      </div>

      {mission.id === "dipole" && (
        <div className="mt-6">
          <InteractiveCanvas fieldId="F_MOVER" candidateId="lesson-dipole" mode="blink" scenario="mover" />
        </div>
      )}
      {mission.id === "honest" && (
        <div className="mt-6">
          <PlanetXPanel />
        </div>
      )}

      <h2 className="mt-8 text-xl font-semibold">Your call</h2>
      <div className="mt-3 grid gap-2">
        {mission.choices.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => choose(item.id)}
            className={`rounded-xl border px-4 py-3 text-left text-sm ${picked === item.id ? "border-amber-400 bg-amber-400/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {choice && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${choice.correct ? "bg-emerald-400/15 text-emerald-100" : "bg-red-500/15 text-red-100"}`}>
          <p className="font-semibold">{note}</p>
          <p className="mt-1">{choice.why}</p>
        </div>
      )}

      <div className="mt-6 flex gap-4 text-sm font-semibold">
        {next ? (
          <Link href={`/learn/${next.id}`} className="text-amber-300">Next mission</Link>
        ) : (
          <Link href="/learn" className="text-amber-300">See your rank</Link>
        )}
        <Link href="/viewer/F_MOVER?mode=blink&viewMode=explorer&candidate=F_MOVER_1.25_0&story=mover" className="text-slate-400">
          Practice on a field
        </Link>
      </div>
    </main>
  );
}
